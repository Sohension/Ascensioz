"use client";

import { X } from "lucide-react";

interface EditorTabsProps {
  tabs: string[];
  activeFile: string;
  dirtyFiles: Set<string>;
  onSelect: (name: string) => void;
  onClose: (name: string) => void;
}

export default function EditorTabs({
  tabs,
  activeFile,
  dirtyFiles,
  onSelect,
  onClose,
}: EditorTabsProps) {
  return (
    <div className="flex items-stretch overflow-x-auto border-b border-[#1A2230] bg-[#0B0F14]">
      {tabs.map((name) => {
        const isActive = name === activeFile;
        const isDirty = dirtyFiles.has(name);
        return (
          <div
            key={name}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelect(name)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelect(name);
            }}
            className={`group flex shrink-0 cursor-pointer items-center gap-2 border-r border-[#1A2230] px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-[#111827] text-slate-100"
                : "text-slate-500 hover:bg-[#0f1420] hover:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span className="font-mono">{name}</span>
            </span>
            {isDirty ? (
              <span
                className="h-2 w-2 rounded-full bg-amber-400"
                title="Unsaved changes"
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(name);
                }}
                aria-label={`Close ${name}`}
                title="Close"
                className="rounded p-0.5 text-slate-500 opacity-0 transition-opacity hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
