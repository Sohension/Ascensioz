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

let pyodidePromise: Promise<unknown> | null = null;
let pyodideLoadError: Error | null = null;

async function ensurePyodide(): Promise<unknown> {
  if (pyodidePromise) return pyodidePromise;
  if (pyodideLoadError) throw pyodideLoadError;

  pyodidePromise = import("https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js")
    .then((mod) => mod.loadPyodide())
    .catch((err) => {
      pyodideLoadError = err instanceof Error ? err : new Error(String(err));
      throw pyodideLoadError;
    });

  return pyodidePromise;
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
        writeFile: (path: string, data: string | ArrayBuffer, opts?: { encoding?: string }) => void;
        ensureDir: (path: string) => void;
        unlink: (path: string) => void;
      };
      setStdout: (opts: { batched?: (text: string) => void; stream?: (text: string) => void }) => void;
      setStderr: (opts: { batched?: (text: string) => void; stream?: (text: string) => void }) => void;
      globals: { get: (name: string) => unknown };
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

    pyodide.setStdout({
      batched: (text: string) => capture({ current: stdoutText, bytes: stdoutBytes }, text),
    });
    pyodide.setStderr({
      batched: (text: string) => capture({ current: stderrText, bytes: stderrBytes }, text),
    });

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
      const sys = pyodide.globals.get("sys") as { exit: (code: number) => void } | undefined;
      try {
        sys?.exit(1);
      } catch {
        // best-effort
      }
    }, timeoutMs);

    try {
      await pyodide.runPythonAsync(`
import sys
import os

sys.path.insert(0, "")

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
