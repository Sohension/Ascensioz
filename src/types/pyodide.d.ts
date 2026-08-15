declare module "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js" {
  export interface Pyodide {
    runPythonAsync(code: string): Promise<unknown>;
    FS: {
      writeFile(path: string, data: string | ArrayBuffer, opts?: { encoding?: string }): void;
      ensureDir(path: string): void;
      unlink(path: string): void;
    };
    globals: { get(name: string): unknown };
    loadPackage(packages: string[]): Promise<void>;
  }
  export interface LoadPyodideOptions {
    indexURL?: string;
  }
  export function loadPyodide(options?: LoadPyodideOptions): Promise<Pyodide>;
}
