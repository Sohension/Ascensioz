declare module "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js" {
  export interface Pyodide {
    runPythonAsync(code: string): Promise<unknown>;
    FS: {
      writeFile(path: string, data: string | ArrayBuffer, opts?: { encoding?: string }): void;
      ensureDir(path: string): void;
      unlink(path: string): void;
    };
    setStdout(opts: { batched?: (text: string) => void; stream?: (text: string) => void }): void;
    setStderr(opts: { batched?: (text: string) => void; stream?: (text: string) => void }): void;
    globals: { get(name: string): unknown };
    loadPackage(packages: string[]): Promise<void>;
  }
  export function loadPyodide(): Promise<Pyodide>;
}
