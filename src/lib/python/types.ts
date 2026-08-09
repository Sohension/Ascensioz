export type RunnerStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "timeout"
  | "stopped";

export interface PythonRunRequest {
  /** Client-generated id used to stop this run. */
  runId?: string;
  /** The primary file to execute (basename). */
  entry?: string;
  /** Map of filename -> file content for the virtual project. */
  files?: Record<string, string>;
}

export interface PythonRunResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTime: number;
  timedOut: boolean;
  stopped: boolean;
  truncated: boolean;
  status: RunnerStatus;
}

export interface PythonStopRequest {
  runId: string;
}

export interface PythonStopResult {
  ok: boolean;
  message?: string;
}
