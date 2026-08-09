"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  Plus,
} from "lucide-react";

interface FileExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  onSelect: (name: string) => void;
  onCreateFile: (name: string) => void;
  onRenameFile: (oldName: string, newName: string) => void;
  onDeleteFile: (name: string) => void;
}

function iconFor(name: string) {
  if (name.endsWith(".py")) return <FileCode2 className="h-4 w-4 text-sky-400" />;
  if (name.endsWith(".md")) return <FileText className="h-4 w-4 text-slate-400" />;
  return <FileText className="h-4 w-4 text-slate-400" />;
}

export default function FileExplorer({
  files,
  activeFile,
  onSelect,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
const [menuFor, setMenuFor] = useState<string | null>(null);
  const [folderOpen, setFolderOpen] = useState(true);

  const names = Object.keys(files).sort();

  const commitCreate = () => {
    const trimmed = newName.trim();
    if (trimmed && !files[trimmed]) {
      onCreateFile(trimmed);
    }
    setCreating(false);
    setNewName("");
  };

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (renaming && trimmed && trimmed !== renaming && !files[trimmed]) {
      onRenameFile(renaming, trimmed);
    }
    setRenaming(null);
    setRenameValue("");
  };

  return (
    <div className="flex h-full flex-col bg-[#0B0F14] text-slate-300">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Explorer
        </span>
        <button
          onClick={() => setCreating((c) => !c)}
          aria-label="New file"
          title="New file"
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {creating && (
        <div className="px-2 pb-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitCreate();
              if (e.key === "Escape") setCreating(false);
            }}
            onBlur={commitCreate}
            placeholder="file.py"
            aria-label="New file name"
            className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 outline-none focus:border-sky-500"
          />
        </div>
      )}

<div className="px-2">
        <button
          onClick={() => setFolderOpen((o) => !o)}
          aria-expanded={folderOpen}
          className="flex w-full items-center gap-1 py-1 text-left text-slate-400 transition-colors hover:text-slate-200"
        >
          {folderOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          )}
          {folderOpen ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-slate-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-slate-500" />
          )}
          <span className="truncate text-xs font-medium">my-project</span>
        </button>
      </div>

      {folderOpen && (
        <div className="flex-1 overflow-y-auto pb-2">
          {names.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-600">No files yet.</p>
          )}
        {names.map((name) => {
          const isActive = name === activeFile;
          const isRenaming = renaming === name;
          return (
            <div
              key={name}
              className={`group relative flex items-center gap-1.5 py-1 pl-[18px] pr-1 text-sm ${
                isActive
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:bg-slate-800/50"
              }`}
              onClick={() => !isRenaming && onSelect(name)}
            >
              <span className="shrink-0">
                {isRenaming ? <Folder className="h-4 w-4 text-slate-500" /> : iconFor(name)}
              </span>
              {isRenaming ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  onBlur={commitRename}
                  aria-label={`Rename ${name}`}
                  className="w-full rounded border border-sky-500 bg-slate-900 px-1 py-0.5 text-sm text-slate-100 outline-none"
                />
              ) : (
                <>
                  <span className="truncate">{name}</span>
                  <div className="ml-auto flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenaming(name);
                        setRenameValue(name);
                        setMenuFor(null);
                      }}
                      aria-label={`Rename ${name}`}
                      title="Rename"
                      className="rounded p-0.5 text-slate-500 hover:text-slate-200"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuFor(name);
                      }}
                      aria-label={`Delete ${name}`}
                      title="Delete"
                      className="rounded p-0.5 text-slate-500 hover:text-red-400"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                </>
              )}

              {menuFor === name && (
                <div
                  className="absolute right-1 top-6 z-20 w-24 rounded border border-slate-700 bg-slate-900 py-1 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="block w-full px-3 py-1 text-left text-xs text-red-400 hover:bg-slate-800"
                    onClick={() => {
                      onDeleteFile(name);
                      setMenuFor(null);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="block w-full px-3 py-1 text-left text-xs text-slate-300 hover:bg-slate-800"
                    onClick={() => {
                      setMenuFor(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
)}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
