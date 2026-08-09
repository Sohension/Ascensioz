"use client";

import { useEffect, useRef } from "react";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { RunnerStatus } from "@/lib/python/types";

export interface TerminalEntry {
  kind: "stdout" | "stderr" | "system" | "info";
  text: string;
}

interface TerminalProps {
  entries: TerminalEntry[];
  status: RunnerStatus;
  exitCode: number | null;
  executionTime: number | null;
  running: boolean;
  open: boolean;
  onToggleOpen: () => void;
  onClear: () => void;
}

const MAX_ENTRIES = 500;

export default function Terminal({
  entries,
  status,
  exitCode,
  executionTime,
  running,
  open,
  onToggleOpen,
  onClear,
}: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visible = entries.slice(-MAX_ENTRIES);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible.length, open]);

  const statusColor =
    status === "success"
      ? "text-emerald-400"
      : status === "error" || status === "timeout"
        ? "text-red-400"
        : status === "stopped"
          ? "text-amber-400"
          : status === "running"
            ? "text-sky-400"
            : "text-slate-500";

  return (
    <div className="flex h-full flex-col bg-[#0B0F14]">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[#1A2230] px-2">
        <button
          onClick={onToggleOpen}
          aria-label={open ? "Collapse terminal" : "Expand terminal"}
          className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          Terminal
        </button>
        <span className={`ml-1 text-xs ${statusColor}`}>
          {running ? "● Running" : status === "idle" ? "" : status}
        </span>
        <button
          onClick={onClear}
          aria-label="Clear terminal output"
          title="Clear output"
          className="ml-auto rounded p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {open && (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed"
          role="log"
          aria-live="polite"
        >
          {visible.length === 0 && !running && (
            <p className="text-slate-600">
              Press Run to execute the active Python file.
            </p>
          )}

          {visible.map((entry, i) => {
            const cls =
              entry.kind === "stderr"
                ? "text-red-400"
                : entry.kind === "system"
                  ? "text-amber-300"
                  : entry.kind === "info"
                    ? "text-slate-500"
                    : "text-emerald-300";
            return (
              <div key={i} className={`whitespace-pre-wrap break-words ${cls}`}>
                {entry.text}
              </div>
            );
          })}

          {running && (
            <div className="text-sky-400">
              <span className="inline-block animate-pulse">●</span> Running
              Python...
            </div>
          )}

          {!running && (exitCode !== null || executionTime !== null) && (
            <div className="mt-2 border-t border-[#1A2230] pt-2 text-slate-500">
              {exitCode !== null && (
                <>
                  Process {status === "timeout" ? "timed out" : "finished"} with
                  exit code <span className="text-slate-300">{exitCode}</span>
                </>
              )}
              {executionTime !== null && (
                <span>
                  {"  ·  "}Execution time: {executionTime.toFixed(2)}s
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
