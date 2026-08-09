"use client";

interface StatusBarProps {
  language: string;
  line: number;
  col: number;
  running: boolean;
}

export default function StatusBar({ language, line, col, running }: StatusBarProps) {
  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-[#1A2230] bg-[#10151f] px-3 text-[11px] text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        Python IDE
      </span>
      <span className="ml-auto hidden sm:inline">{language}</span>
      <span>
        Ln {line}, Col {col}
      </span>
      {running && (
        <span className="flex items-center gap-1 text-sky-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          Running
        </span>
      )}
    </footer>
  );
}
