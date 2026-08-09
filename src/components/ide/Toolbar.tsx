"use client";

import {
  Play,
  Square,
  Save,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import type { RunnerStatus } from "@/lib/python/types";

interface ToolbarProps {
  projectName: string;
  running: boolean;
  status: RunnerStatus;
  explorerOpen: boolean;
  mobileTerminalOpen: boolean;
  onToggleExplorer: () => void;
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onReset: () => void;
  onOpenMobileExplorer: () => void;
  onToggleMobileTerminal: () => void;
}

export default function Toolbar({
  projectName,
  running,
  explorerOpen,
  mobileTerminalOpen,
  onToggleExplorer,
  onRun,
  onStop,
  onSave,
  onReset,
  onOpenMobileExplorer,
  onToggleMobileTerminal,
}: ToolbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[#1A2230] bg-[#10151f] px-2 sm:px-3">
      {/* Mobile explorer toggle */}
      <button
        onClick={onOpenMobileExplorer}
        aria-label="Open file explorer"
        title="Files"
        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop explorer toggle */}
      <button
        onClick={onToggleExplorer}
        aria-label={explorerOpen ? "Collapse explorer" : "Expand explorer"}
        title={`Toggle explorer (Ctrl+B)`}
        className="hidden rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 md:block"
      >
        {explorerOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </button>

      <div className="flex min-w-0 items-center gap-2">
        <span className="h-6 w-6 shrink-0 rounded bg-gradient-to-br from-sky-500 to-violet-600 text-center text-sm font-bold leading-6 text-white">
          P
        </span>
        <span className="truncate text-sm font-semibold text-slate-200">
          {projectName}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onSave}
          aria-label="Save"
          title="Save (Ctrl+S)"
          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          <Save className="h-4 w-4" />
        </button>

        <button
          onClick={onReset}
          aria-label="Reset project"
          title="Reset project"
          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

<div className="mx-1 hidden h-5 w-px bg-[#1A2230] sm:block" />

        {/* Mobile-terminal toggle */}
        <button
          onClick={onToggleMobileTerminal}
          aria-label={mobileTerminalOpen ? "Hide terminal" : "Show terminal"}
          title="Toggle terminal"
          className={`rounded p-1.5 transition-colors md:hidden ${
            mobileTerminalOpen
              ? "bg-slate-800 text-sky-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          }`}
        >
          <TerminalSquare className="h-4 w-4" />
        </button>

        {running ? (
          <button
            onClick={onStop}
            aria-label="Stop execution"
            title="Stop (running)"
            className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            aria-label="Run Python"
            title="Run (Ctrl+Enter)"
            className="flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run</span>
          </button>
        )}
      </div>
    </header>
  );
}
