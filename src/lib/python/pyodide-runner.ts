type PyodideRunResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTime: number;
  timedOut: boolean;
  stopped: boolean;
  truncated: boolean;
  status: "success" | "error" | "timeout" | "stopped" | "running";
};

let pyodideLoadPromise: Promise<unknown> | null = null;
let pyodideLoadError: Error | null = null;

function injectPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Pyodide can only be loaded in a browser environment"));
      return;
    }

    if ((window as any).__pyodideLoading) {
      (window as any).__pyodideResolve?.push(resolve);
      (window as any).__pyodideReject?.push(reject);
      return;
    }

    (window as any).__pyodideLoading = true;
    (window as any).__pyodideResolve = [resolve];
    (window as any).__pyodideReject = [reject];

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js";
    script.async = true;
    script.onload = () => {
      const resolvers = (window as any).__pyodideResolve ?? [];
      const rejectors = (window as any).__pyodideReject ?? [];
      resolvers.forEach((r: () => void) => r());
      rejectors.forEach((r: (e: Error) => void) => r(new Error("Pyodide script loaded but loadPyodide not called")));
    };
    script.onerror = () => {
      const rejectors = (window as any).__pyodideReject ?? [];
      rejectors.forEach((r: (e: Error) => void) =>
        r(new Error("Failed to load Pyodide script from CDN")),
      );
    };
    document.head.appendChild(script);
  });
}

async function ensurePyodide(): Promise<unknown> {
  if (pyodideLoadPromise) return pyodideLoadPromise;
  if (pyodideLoadError) throw pyodideLoadError;

  await injectPyodideScript();

  pyodideLoadPromise = new Promise<unknown>((resolve, reject) => {
    try {
      const loader = (window as any).loadPyodide;
      if (typeof loader !== "function") {
        throw new Error("loadPyodide is not available on window");
      }
      loader({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/",
      })
        .then((pyodide: unknown) => {
          pyodideLoadPromise = Promise.resolve(pyodide);
          resolve(pyodide);
        })
        .catch((err: Error) => {
          pyodideLoadError = err;
          reject(err);
        });
    } catch (err) {
      pyodideLoadError = err instanceof Error ? err : new Error(String(err));
      reject(pyodideLoadError);
    }
  });

  return pyodideLoadPromise;
}

export async function runPythonInBrowser(
  files: Record<string, string>,
  entry: string,
  timeoutMs = 10_000,
): Promise<PyodideRunResult> {
  const started = Date.now();
  const base: PyodideRunResult = {
    stdout: "",
    stderr: "",
    exitCode: null,
    executionTime: 0,
    timedOut: false,
    stopped: false,
    truncated: false,
    status: "running",
  };

  try {
    const pyodide = (await ensurePyodide()) as {
      runPythonAsync: (code: string) => Promise<unknown>;
      FS: {
        writeFile(path: string, data: string | ArrayBuffer, opts?: { encoding?: string }): void;
        ensureDir(path: string): void;
        unlink(path: string): void;
      };
      globals: { get(name: string): unknown };
    };

    const safeFiles: Record<string, string> = {};
    for (const [name, content] of Object.entries(files)) {
      const safeName = name.replace(/\\/g, "/");
      const parts = safeName.split("/");
      if (
        parts.some((p) => p === ".." || p === "." || p === "") ||
        safeName.startsWith("/") ||
        /[:]/.test(safeName)
      ) {
        return {
          ...base,
          stderr: `Invalid file name: "${name}"`,
          status: "error",
          exitCode: 1,
        };
      }
      safeFiles[safeName] = content;
    }

    if (!safeFiles[entry]) {
      return {
        ...base,
        stderr: `Entry file "${entry}" not found in the project.`,
        status: "error",
        exitCode: 1,
      };
    }

    const MAX_OUTPUT_BYTES = 1 * 1024 * 1024;
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let stdoutText = "";
    let stderrText = "";
    let timedOut = false;
    let stopped = false;

    const capture = (buf: { current: string; bytes: number }, chunk: string) => {
      buf.current += chunk;
      const remaining = MAX_OUTPUT_BYTES - buf.bytes;
      if (remaining > 0) {
        buf.bytes += new TextEncoder().encode(chunk).length;
      }
    };

    for (const [name, content] of Object.entries(safeFiles)) {
      const dir = name.includes("/") ? name.slice(0, name.lastIndexOf("/")) : "";
      if (dir) {
        try {
          pyodide.FS.ensureDir(dir);
        } catch {
          /* ignore */
        }
      }
      pyodide.FS.writeFile(name, content, { encoding: "utf8" });
    }

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        const sys = pyodide.globals.get("sys") as { exit: (code: number) => void } | undefined;
        sys?.exit(1);
      } catch {
        // best-effort
      }
    }, timeoutMs);

    try {
      await pyodide.runPythonAsync(`
import sys
import os
import io

sys.path.insert(0, "")

_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()

sys.stdout = _stdout_buf
sys.stderr = _stderr_buf

try:
    exec(open(${JSON.stringify(entry)}).read(), {"__name__": "__main__"})
except SystemExit as e:
    code = int(e.code) if e.code is not None else 0
    if code != 0:
        raise
except Exception:
    import traceback
    traceback.print_exc()
`);
    } catch (err) {
      if (!timedOut) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!stderrText) {
          stderrText = msg;
        }
      }
    } finally {
      clearTimeout(timer);
    }

    const truncated = stdoutBytes >= MAX_OUTPUT_BYTES || stderrBytes >= MAX_OUTPUT_BYTES;
    const exitCode = timedOut ? (stopped ? 137 : 1) : 0;
    const status = timedOut ? "timeout" : stopped ? "stopped" : stderrText ? "error" : "success";

    return {
      stdout: stdoutText.replace(/\n$/, ""),
      stderr: stderrText.replace(/\n$/, ""),
      exitCode,
      executionTime: (Date.now() - started) / 1000,
      timedOut,
      stopped,
      truncated,
      status,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ...base,
      stderr: `[browser] Failed to run code: ${msg}`,
      status: "error",
      exitCode: 1,
      executionTime: (Date.now() - started) / 1000,
    };
  }
}
