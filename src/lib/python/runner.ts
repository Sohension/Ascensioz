import { spawn, execFile, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, writeFile, rm, mkdir, readdir } from "node:fs/promises";
import { tmpdir, platform, homedir } from "node:os";
import { join } from "node:path";
import type { PythonRunRequest, PythonRunResult, RunnerStatus } from "./types";

export const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_SOURCE_BYTES = 256 * 1024; // 256 KB
const MAX_OUTPUT_BYTES = 1 * 1024 * 1024; // 1 MB
const MAX_FILES = 50;

const PYTHON_CANDIDATE_DIRS = [
  join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WindowsApps"),
  join(process.env.ProgramFiles ?? "C:\\Program Files", "Python"),
  join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "Python"),
  join(homedir(), "AppData", "Local", "Programs", "Python"),
];

let cachedPython: string | undefined;

function probeExecutable(p: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(p, ["-c", "import sys;sys.stdout.write('ok')"], {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let out = "";
    child.stdout?.on("data", (d: Buffer) => (out += d.toString()));
    child.on("error", () => resolve(false));
    child.on("close", (code) => {
      resolve(code === 0 && out.includes("ok"));
    });
  });
}

async function resolvePython(): Promise<string> {
  // --- FINAL HARDCODED PATH FOR YOUR MACHINE ---
  return "C:\\Users\\Bucher\\AppData\\Local\\Python\\bin\\python.exe";
}

async function probeCommand(
  cmd: string,
  args: string[],
): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(cmd, args, { timeout: 5000, windowsHide: true }, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      const line = String(stdout).trim().split(/\r?\n/)[0]?.trim();
      if (line) resolve(line);
      else resolve(null);
    });
  });
}

async function getPython(): Promise<string> {
  if (cachedPython !== undefined) return cachedPython;
  cachedPython = await resolvePython();
  return cachedPython;
}

export async function getPythonPath(): Promise<string> {
  return getPython();
}

export interface PythonRunResponse extends PythonRunResult {
  runId: string;
}

interface ActiveRun {
  process: ChildProcess;
  timer: NodeJS.Timeout;
}

const activeRuns = new Map<string, ActiveRun>();

function sanitizeEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { NODE_ENV: "production" };
  const blocklist = [
    /^SECRET/i,
    /^TOKEN/i,
    /^KEY/i,
    /^PASSWORD/i,
    /SUPABASE/i,
    /DATABASE/i,
    /NEXT_PUBLIC/i,
    /JWT/i,
    /AUTH/i,
    /COOKIE/i,
  ];
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined) continue;
    if (blocklist.some((re) => re.test(key))) continue;
    env[key] = value;
  }
  env.PATH = process.env.PATH ?? "";
  env.HOME = process.env.HOME ?? tmpdir();
  env.PYTHONIOENCODING = "utf-8";
  env.PYTHONUNBUFFERED = "1";
  env.PYTHONDONTWRITEBYTECODE = "1";
  return env;
}

function killProcessTree(proc: ChildProcess): void {
  if (!proc.pid) return;
  if (platform() === "win32") {
    try {
      const killer = spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
      killer.on("error", () => {
        proc.kill("SIGKILL");
      });
      setTimeout(() => proc.kill("SIGKILL"), 500);
    } catch {
      proc.kill("SIGKILL");
    }
  } else {
    try {
      process.kill(-proc.pid, "SIGKILL");
    } catch {
      proc.kill("SIGKILL");
    }
  }
}

function finalize(
  base: PythonRunResponse,
  started: number,
  stdout: string,
  stderr: string,
  exitCode: number | null,
  killed: boolean,
  timedOut: boolean,
  truncated: boolean,
  timeoutMs: number,
): PythonRunResponse {
  const result: PythonRunResponse = {
    ...base,
    stdout,
    stderr,
    exitCode,
    executionTime: (Date.now() - started) / 1000,
    timedOut,
    stopped: killed && !timedOut,
    truncated,
  };
  if (killed) {
    result.status = timedOut ? "timeout" : "stopped";
    if (timedOut) {
      result.stderr += `\n[runner] Execution timed out after ${timeoutMs / 1000}s and was terminated.`;
    } else {
      result.stderr += "\n[runner] Execution was stopped by the user.";
    }
  } else {
    result.status = (
      result.exitCode === 0 ? "success" : "error"
    ) as RunnerStatus;
  }
  return result;
}

export async function runPython(
  request: PythonRunRequest,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<PythonRunResponse> {
  const runId = request.runId ?? randomUUID();
  const files = request.files ?? {};
  const entry = request.entry ?? "main.py";
  const started = Date.now();

  const base: PythonRunResponse = {
    runId,
    stdout: "",
    stderr: "",
    exitCode: null,
    executionTime: 0,
    timedOut: false,
    stopped: false,
    truncated: false,
    status: "running",
  };

  const fileNames = Object.keys(files);
  if (fileNames.length === 0) {
    return finalize(
      base,
      started,
      "",
      "No files were provided to run.",
      1,
      false,
      false,
      false,
      timeoutMs,
    );
  }
  if (fileNames.length > MAX_FILES) {
    return finalize(
      base,
      started,
      "",
      `Too many files (max ${MAX_FILES}).`,
      1,
      false,
      false,
      false,
      timeoutMs,
    );
  }
  let totalBytes = 0;
  for (const [name, content] of Object.entries(files)) {
    if (typeof content !== "string") {
      return finalize(
        base,
        started,
        "",
        `File "${name}" is not valid text.`,
        1,
        false,
        false,
        false,
        timeoutMs,
      );
    }
    totalBytes += Buffer.byteLength(content, "utf8");
    if (totalBytes > MAX_SOURCE_BYTES) {
      return finalize(
        base,
        started,
        "",
        `Source too large (max ${MAX_SOURCE_BYTES} bytes).`,
        1,
        false,
        false,
        false,
        timeoutMs,
      );
    }
  }
  if (!fileNames.includes(entry)) {
    return finalize(
      base,
      started,
      "",
      `Entry file "${entry}" not found in the project.`,
      1,
      false,
      false,
      false,
      timeoutMs,
    );
  }

  let dir = "";
  try {
    dir = await mkdtemp(join(tmpdir(), "asci-ide-"));
    for (const [name, content] of Object.entries(files)) {
      const safeName = name.replace(/\\/g, "/");
      const parts = safeName.split("/");
      if (
        parts.some((p) => p === ".." || p === "." || p === "") ||
        safeName.startsWith("/") ||
        /[:]/.test(safeName)
      ) {
        await rm(dir, { recursive: true, force: true }).catch(() => {});
        return finalize(
          base,
          started,
          "",
          `Invalid file name: "${name}"`,
          1,
          false,
          false,
          false,
          timeoutMs,
        );
      }
      const target = join(dir, safeName);
      await mkdir(join(dir, ...parts.slice(0, -1)), { recursive: true });
      await writeFile(target, content, "utf8");
    }

    const entryPath = join(dir, entry.replace(/\\/g, "/"));
    const pythonBin = await getPython();

    return await new Promise<PythonRunResponse>((resolve) => {
      let stdout = "";
      let stderr = "";
      let stdoutBytes = 0;
      let stderrBytes = 0;
      let killed = false;
      let timedOut = false;

      const proc = spawn(pythonBin, [entryPath], {
        cwd: dir,
        env: sanitizeEnv(),
        shell: true,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      const timer = setTimeout(() => {
        killed = true;
        timedOut = true;
        killProcessTree(proc);
      }, timeoutMs);

      activeRuns.set(runId, { process: proc, timer });

      proc.stdout!.on("data", (chunk: Buffer) => {
        const remaining = MAX_OUTPUT_BYTES - stdoutBytes;
        if (remaining > 0) {
          stdout += chunk.toString(
            "utf8",
            0,
            Math.min(chunk.length, remaining),
          );
          stdoutBytes += Math.min(chunk.length, remaining);
          if (stdoutBytes >= MAX_OUTPUT_BYTES) {
            killed = true;
            killProcessTree(proc);
          }
        }
      });

      proc.stderr!.on("data", (chunk: Buffer) => {
        const remaining = MAX_OUTPUT_BYTES - stderrBytes;
        if (remaining > 0) {
          stderr += chunk.toString(
            "utf8",
            0,
            Math.min(chunk.length, remaining),
          );
          stderrBytes += Math.min(chunk.length, remaining);
          if (stderrBytes >= MAX_OUTPUT_BYTES) {
            killed = true;
            killProcessTree(proc);
          }
        }
      });

      proc.on("error", (err) => {
        clearTimeout(timer);
        activeRuns.delete(runId);
        const msg = `[runner] Failed to launch Python: ${err.message}`;
        const combined = stderr ? stderr + "\n" + msg : msg;
        resolve(
          finalize(
            base,
            started,
            stdout,
            combined,
            1,
            false,
            false,
            false,
            timeoutMs,
          ),
        );
        rm(dir, { recursive: true, force: true }).catch(() => {});
      });

      proc.on("close", (code, signal) => {
        clearTimeout(timer);
        activeRuns.delete(runId);
        const exitCode = killed
          ? (code ?? (signal === "SIGKILL" ? 137 : 1))
          : code;
        const truncated =
          stdoutBytes >= MAX_OUTPUT_BYTES || stderrBytes >= MAX_OUTPUT_BYTES;
        resolve(
          finalize(
            base,
            started,
            stdout,
            stderr,
            exitCode,
            killed,
            timedOut,
            truncated,
            timeoutMs,
          ),
        );
        rm(dir, { recursive: true, force: true }).catch(() => {});
      });
    });
  } catch (err) {
    const msg = `[runner] ${err instanceof Error ? err.message : String(err)}`;
    if (dir) await rm(dir, { recursive: true, force: true }).catch(() => {});
    return finalize(base, started, "", msg, 1, false, false, false, timeoutMs);
  }
}

export function stopPython(runId: string): boolean {
  const run = activeRuns.get(runId);
  if (!run) return false;
  try {
    killProcessTree(run.process);
  } catch {
    /* ignore */
  }
  return true;
}

export function hasActiveRun(runId: string): boolean {
  return activeRuns.has(runId);
}
