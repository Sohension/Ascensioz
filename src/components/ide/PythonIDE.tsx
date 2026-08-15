"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Group,
  Panel,
  Separator,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import type { RunnerStatus } from "@/lib/python/types";
import {
  loadProject,
  saveProject,
  resetProject,
  type PersistedProject,
} from "@/lib/editor/persistence";
import { resolveShortcut } from "@/lib/editor/shortcuts";
import Toolbar from "./Toolbar";
import EditorTabs from "./EditorTabs";
import FileExplorer from "./FileExplorer";
import Terminal, { type TerminalEntry } from "./Terminal";
import StatusBar from "./StatusBar";
import { runPythonInBrowser } from "@/lib/python/pyodide-runner";

const CodeEditor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0B0F14] text-sm text-slate-500">
      Loading editor…
    </div>
  ),
});

export default function PythonIDE() {
  const [project, setProject] = useState<PersistedProject>(() => loadProject());
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(
    () => new Set<string>(),
  );
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([]);
  const [status, setStatus] = useState<RunnerStatus>("idle");
  const [running, setRunning] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState(false);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(true);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const activeRunIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const explorerPanelRef = useRef<PanelImperativeHandle>(null);

  // Debounced persistence
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProject(project);
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [project]);

  // Collapse / expand explorer panel via imperative API safely
  useEffect(() => {
    const panel = explorerPanelRef.current;
    if (!panel) return;
    if (project.explorerOpen) {
      panel.expand();
    } else {
      panel.collapse();
    }
  }, [project.explorerOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const action = resolveShortcut(e);
      if (!action) return;
      switch (action) {
        case "run":
          runCode();
          break;
        case "save":
          handleSave();
          break;
        case "toggleExplorer":
          setProject((p) => ({ ...p, explorerOpen: !p.explorerOpen }));
          break;
        case "toggleTerminal":
          setTerminalOpen((o) => !o);
          break;
        case "quickOpen":
          setQuickOpen((o) => !o);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.explorerOpen]);

  const activeFile = project.activeFile;
  const activeContent = project.files[activeFile] ?? "";

  const appendEntry = useCallback((entry: TerminalEntry) => {
    setTerminalEntries((prev) => {
      const next = [...prev, entry];
      return next.length > 500 ? next.slice(-500) : next;
    });
  }, []);

  const handleValueChange = useCallback(
    (value: string) => {
      setProject((p) => ({
        ...p,
        files: { ...p.files, [p.activeFile]: value },
      }));
      setDirtyFiles((prev) => {
        const next = new Set(prev);
        next.add(activeFile);
        return next;
      });
    },
    [activeFile],
  );

  const handleSave = useCallback(() => {
    setDirtyFiles((prev) => {
      const next = new Set(prev);
      next.delete(activeFile);
      return next;
    });
  }, [activeFile]);

  const runCode = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setStatus("running");
    setExitCode(null);
    setExecutionTime(null);
    setTerminalOpen(true);
    setTerminalEntries([]);

    const controller = new AbortController();
    abortRef.current = controller;

    const runId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    activeRunIdRef.current = runId;

    appendEntry({ kind: "system", text: "$ Running Python..." });

    const files = project.files;
    const entry = activeFile;

    try {
      const res = await fetch("/api/python/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, entry, runId }),
        signal: controller.signal,
      });

      let serverFailed = false;
      let serverError = "";

      if (!res.ok) {
        serverFailed = true;
        const data = await res.json().catch(() => ({}));
        serverError =
          (data as { error?: string }).error ?? `Run failed (${res.status})`;
      } else {
        const result = (await res.json()) as {
          status?: string;
          stdout?: string;
          stderr?: string;
          exitCode?: number | null;
          executionTime?: number;
          truncated?: boolean;
          error?: string;
        };

        if (result.status === "error" && result.error) {
          serverFailed = true;
          serverError = result.error;
        } else {
          activeRunIdRef.current = null;
          if (result.stdout) {
            appendEntry({
              kind: "stdout",
              text: result.stdout.replace(/\n$/, ""),
            });
          }
          if (result.stderr) {
            appendEntry({
              kind: "stderr",
              text: result.stderr.replace(/\n$/, ""),
            });
          }
          if (result.truncated) {
            appendEntry({
              kind: "system",
              text: "[output truncated: limit reached]",
            });
          }
          setStatus(
            (result.status ?? "idle") as Parameters<typeof setStatus>[0],
          );
          setExitCode(result.exitCode ?? null);
          setExecutionTime(result.executionTime ?? null);
        }
      }

      if (serverFailed) {
        const isPythonInfraError =
          serverError.includes("Python interpreter not found") ||
          serverError.includes("spawn python") ||
          serverError.includes("ENOENT") ||
          serverError.includes("[runner]");

        if (isPythonInfraError) {
          appendEntry({
            kind: "system",
            text: "[fallback] Server Python unavailable, running in browser with Pyodide...",
          });
          try {
            const result = await runPythonInBrowser(files, entry);
            activeRunIdRef.current = null;
            if (result.stdout) {
              appendEntry({
                kind: "stdout",
                text: result.stdout.replace(/\n$/, ""),
              });
            }
            if (result.stderr) {
              appendEntry({
                kind: "stderr",
                text: result.stderr.replace(/\n$/, ""),
              });
            }
            if (result.truncated) {
              appendEntry({
                kind: "system",
                text: "[output truncated: limit reached]",
              });
            }
            setStatus(result.status);
            setExitCode(result.exitCode);
            setExecutionTime(result.executionTime);
          } catch (pyErr) {
            appendEntry({
              kind: "stderr",
              text: `Error: ${pyErr instanceof Error ? pyErr.message : String(pyErr)}`,
            });
            setStatus("error");
            setExitCode(1);
          }
        } else {
          appendEntry({
            kind: "stderr",
            text: `Error: ${serverError}`,
          });
          setStatus("error");
          setExitCode(1);
        }
      }
    } catch (err) {
      if (controller.signal.aborted) {
        appendEntry({ kind: "system", text: "Run cancelled." });
        setStatus("stopped");
      } else {
        const message = err instanceof Error ? err.message : String(err);
        const isPythonInfraError =
          message.includes("Python interpreter not found") ||
          message.includes("spawn python") ||
          message.includes("ENOENT") ||
          message.includes("[runner]");

        if (isPythonInfraError) {
          appendEntry({
            kind: "system",
            text: "[fallback] Server Python unavailable, running in browser with Pyodide...",
          });
          try {
            const result = await runPythonInBrowser(files, entry);
            activeRunIdRef.current = null;
            if (result.stdout) {
              appendEntry({
                kind: "stdout",
                text: result.stdout.replace(/\n$/, ""),
              });
            }
            if (result.stderr) {
              appendEntry({
                kind: "stderr",
                text: result.stderr.replace(/\n$/, ""),
              });
            }
            if (result.truncated) {
              appendEntry({
                kind: "system",
                text: "[output truncated: limit reached]",
              });
            }
            setStatus(result.status);
            setExitCode(result.exitCode);
            setExecutionTime(result.executionTime);
          } catch (pyErr) {
            appendEntry({
              kind: "stderr",
              text: `Error: ${pyErr instanceof Error ? pyErr.message : String(pyErr)}`,
            });
            setStatus("error");
            setExitCode(1);
          }
        } else {
          appendEntry({
            kind: "stderr",
            text: `Error: ${message}`,
          });
          setStatus("error");
          setExitCode(1);
        }
      }
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }, [running, activeFile, project.files, appendEntry]);

  const stopRun = useCallback(async () => {
    const runId = activeRunIdRef.current;
    abortRef.current?.abort();
    if (runId) {
      try {
        await fetch("/api/python/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ runId }),
        });
      } catch {
        /* ignore */
      }
    }
    setRunning(false);
    setStatus("stopped");
    appendEntry({ kind: "system", text: "Execution stopped." });
  }, [appendEntry]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    const fresh = resetProject();
    setProject(fresh);
    setDirtyFiles(new Set());
    setTerminalEntries([]);
    setStatus("idle");
    setRunning(false);
    setExitCode(null);
    setExecutionTime(null);
  }, []);

  const selectFile = useCallback((name: string) => {
    setProject((p) => ({ ...p, activeFile: name }));
    setMobileExplorerOpen(false);
  }, []);

  const openTab = useCallback((name: string) => {
    setProject((p) => {
      if (p.openTabs.includes(name)) return p;
      return { ...p, openTabs: [...p.openTabs, name] };
    });
  }, []);

  const closeTab = useCallback((name: string) => {
    setProject((p) => {
      const tabs = p.openTabs.filter((t) => t !== name);
      const next: PersistedProject = {
        ...p,
        openTabs: tabs,
      };
      if (p.activeFile === name) {
        next.activeFile =
          tabs[tabs.length - 1] ?? Object.keys(p.files)[0] ?? "";
      }
      return next;
    });
  }, []);

  const createFile = useCallback((name: string) => {
    setProject((p) => ({
      ...p,
      files: { ...p.files, [name]: "" },
      openTabs: p.openTabs.includes(name) ? p.openTabs : [...p.openTabs, name],
      activeFile: name,
    }));
  }, []);

  const renameFile = useCallback((oldName: string, newName: string) => {
    setProject((p) => {
      const files: Record<string, string> = {};
      for (const [k, v] of Object.entries(p.files)) {
        files[k === oldName ? newName : k] = v;
      }
      return {
        ...p,
        files,
        activeFile: p.activeFile === oldName ? newName : p.activeFile,
        openTabs: p.openTabs.map((t) => (t === oldName ? newName : t)),
      };
    });
  }, []);

  const deleteFile = useCallback((name: string) => {
    setProject((p) => {
      const files: Record<string, string> = {};
      for (const [k, v] of Object.entries(p.files)) {
        if (k !== name) files[k] = v;
      }
      const openTabs = p.openTabs.filter((t) => t !== name);
      let activeFile = p.activeFile;
      if (activeFile === name) {
        activeFile =
          openTabs[openTabs.length - 1] ?? Object.keys(files)[0] ?? "";
      }
      return { ...p, files, openTabs, activeFile };
    });
  }, []);

  const quickOpenFile = useCallback(
    (name: string) => {
      selectFile(name);
      openTab(name);
      setQuickOpen(false);
      setQuickFilter("");
    },
    [selectFile, openTab],
  );

  const fileNames = useMemo(
    () => Object.keys(project.files).sort(),
    [project.files],
  );

  const quickMatches = useMemo(() => {
    if (!quickFilter) return fileNames;
    return fileNames.filter((f) =>
      f.toLowerCase().includes(quickFilter.toLowerCase()),
    );
  }, [fileNames, quickFilter]);

  const lazyEditor = useMemo(
    () => (
      <CodeEditor
        path={activeFile}
        value={activeContent}
        language="python"
        theme={project.theme}
        onValueChange={handleValueChange}
        onCursorChange={(line, col) => setCursor({ line, col })}
        onRun={runCode}
        onSave={handleSave}
      />
    ),
    [
      activeFile,
      activeContent,
      project.theme,
      handleValueChange,
      runCode,
      handleSave,
    ],
  );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0B0F14] text-slate-200">
      <Toolbar
        projectName="my-project"
        running={running}
        status={status}
        explorerOpen={project.explorerOpen}
        mobileTerminalOpen={mobileTerminalOpen}
        onToggleExplorer={() =>
          setProject((p) => ({ ...p, explorerOpen: !p.explorerOpen }))
        }
        onRun={() => {
          setExitCode(null);
          setExecutionTime(null);
          runCode();
        }}
        onStop={stopRun}
        onSave={handleSave}
        onReset={handleReset}
        onOpenMobileExplorer={() => setMobileExplorerOpen(true)}
        onToggleMobileTerminal={() => setMobileTerminalOpen((o) => !o)}
      />

      {/* Desktop layout */}
      <div className="hidden flex-1 min-h-0 md:flex">
        <Group className="flex w-full" orientation="horizontal">
          <Panel
            id="explorer"
            defaultSize={18}
            minSize={12}
            maxSize={35}
            collapsedSize={0}
            collapsible
            panelRef={explorerPanelRef}
            className="flex min-h-0 min-w-0"
          >
            <FileExplorer
              files={project.files}
              activeFile={activeFile}
              onSelect={(name) => {
                selectFile(name);
                openTab(name);
              }}
              onCreateFile={createFile}
              onRenameFile={renameFile}
              onDeleteFile={deleteFile}
            />
          </Panel>
          <Separator className="w-1 bg-[#1A2230] transition-colors hover:bg-sky-600/50" />
          <Panel minSize={40} className="flex min-h-0 min-w-0">
            <Group className="flex w-full flex-1" orientation="vertical">
              <Panel
                defaultSize={65}
                minSize={30}
                className="flex min-h-0 min-w-0"
              >
                <div className="flex h-full w-full flex-col bg-[#0B0F14]">
                  <EditorTabs
                    tabs={project.openTabs}
                    activeFile={activeFile}
                    dirtyFiles={dirtyFiles}
                    onSelect={(name) => {
                      selectFile(name);
                      openTab(name);
                    }}
                    onClose={closeTab}
                  />
                  <div className="min-h-0 flex-1">{lazyEditor}</div>
                </div>
              </Panel>
              <Separator className="h-1 bg-[#1A2230] transition-colors hover:bg-sky-600/50" />
              <Panel
                defaultSize={35}
                minSize={15}
                className="flex min-h-0 min-w-0"
              >
                <Terminal
                  entries={terminalEntries}
                  status={status}
                  exitCode={exitCode}
                  executionTime={executionTime}
                  running={running}
                  open={terminalOpen}
                  onToggleOpen={() => setTerminalOpen((o) => !o)}
                  onClear={() => setTerminalEntries([])}
                />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>

      {/* Mobile layout */}
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <EditorTabs
          tabs={project.openTabs}
          activeFile={activeFile}
          dirtyFiles={dirtyFiles}
          onSelect={(name) => {
            selectFile(name);
            openTab(name);
          }}
          onClose={closeTab}
        />
        <div className="min-h-0 flex-1">{lazyEditor}</div>
        {mobileTerminalOpen ? (
          <div className="h-56 shrink-0 border-t border-[#1A2230]">
            <Terminal
              entries={terminalEntries}
              status={status}
              exitCode={exitCode}
              executionTime={executionTime}
              running={running}
              open={terminalOpen}
              onToggleOpen={() => setTerminalOpen((o) => !o)}
              onClear={() => setTerminalEntries([])}
            />
          </div>
        ) : (
          <button
            onClick={() => setMobileTerminalOpen(true)}
            className="flex h-9 shrink-0 items-center gap-2 border-t border-[#1A2230] bg-[#10151f] px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-800/50 hover:text-slate-300"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                running ? "animate-pulse bg-sky-400" : "bg-slate-600"
              }`}
            />
            Terminal
            <span className="ml-auto text-[10px] font-normal normal-case text-slate-600">
              {status === "idle" ? "" : status}
            </span>
          </button>
        )}
      </div>

      <StatusBar
        language="Python"
        line={cursor.line}
        col={cursor.col}
        running={running}
      />

      {/* Mobile explorer drawer */}
      {mobileExplorerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileExplorerOpen(false)}
        >
          <div
            className="h-full w-64 border-r border-[#1A2230] bg-[#0B0F14]"
            onClick={(e) => e.stopPropagation()}
          >
            <FileExplorer
              files={project.files}
              activeFile={activeFile}
              onSelect={(name) => {
                selectFile(name);
                openTab(name);
              }}
              onCreateFile={createFile}
              onRenameFile={renameFile}
              onDeleteFile={deleteFile}
            />
          </div>
        </div>
      )}

      {/* Quick open modal */}
      {quickOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24"
          onClick={() => setQuickOpen(false)}
        >
          <div
            className="w-80 rounded-lg border border-[#1A2230] bg-[#111827] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuickOpen(false);
                  setQuickFilter("");
                }
              }}
              placeholder="Type a file name…"
              aria-label="Quick open file"
              className="w-full border-b border-[#1A2230] bg-transparent px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
            <div className="max-h-64 overflow-y-auto py-1">
              {quickMatches.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate-500">No matches</p>
              )}
              {quickMatches.map((name) => (
                <button
                  key={name}
                  onClick={() => quickOpenFile(name)}
                  className="block w-full px-3 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-800"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
