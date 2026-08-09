"use client";

import { useCallback, useMemo, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  path: string;
  value: string;
  language: string;
  theme: "vs-dark" | "light";
  onValueChange: (value: string) => void;
  onCursorChange?: (line: number, col: number) => void;
  onRun: () => void;
  onSave: () => void;
}

export default function CodeEditor({
  value,
  language,
  theme,
  onValueChange,
  onCursorChange,
  onRun,
  onSave,
}: CodeEditorProps) {
  const beforeMount = useCallback((monaco: typeof import("monaco-editor")) => {
    monaco.editor.defineTheme("ascension-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "FF8E4C", fontStyle: "bold" },
        { token: "string", foreground: "7DD0A0" },
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "number", foreground: "FFD479" },
        { token: "type", foreground: "6FB3FF" },
        { token: "function", foreground: "FF9E64" },
      ],
      colors: {
        "editor.background": "#0B0F14",
        "editor.foreground": "#E5E7EB",
        "editorLineNumber.foreground": "#3B4252",
        "editorLineNumber.activeForeground": "#8B93A7",
        "editorCursor.foreground": "#4FC3F7",
        "editor.selectionBackground": "#1F2937",
        "editor.inactiveSelectionBackground": "#16202E",
        "editor.lineHighlightBackground": "#0F1420",
        "editorIndentGuide.background1": "#1A2230",
        "editorIndentGuide.activeBackground1": "#2A3548",
        "editorWidget.background": "#111827",
        "editorWidget.border": "#1F2937",
        "scrollbarSlider.background": "#2A3548",
        "scrollbarSlider.hoverBackground": "#3B4658",
        "scrollbarSlider.activeBackground": "#4B5769",
      },
    });

    monaco.editor.defineTheme("ascension-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "D73A49", fontStyle: "bold" },
        { token: "string", foreground: "22863A" },
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "number", foreground: "005CC5" },
        { token: "type", foreground: "6F42C1" },
      ],
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#24292F",
        "editorLineNumber.foreground": "#C0C7CF",
        "editorCursor.foreground": "#24292F",
        "editor.selectionBackground": "#C8E1FF",
      },
    });
  }, []);

  const onMount: OnMount = useCallback(
    (editor, monaco) => {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      });
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        onSave();
      });
      editor.onDidChangeCursorPosition((e) => {
        onCursorChange?.(e.position.lineNumber, e.position.column);
      });
    },
    [onRun, onSave, onCursorChange],
  );

  const options = useMemo(
    () => ({
      fontSize: 14,
      fontFamily:
        "'Geist Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace",
      minimap: { enabled: true, scale: 1 },
      lineNumbers: "on" as const,
      folding: true,
      bracketPairColorization: { enabled: true },
      autoIndent: "full" as const,
      tabSize: 4,
      insertSpaces: true,
      renderWhitespace: "selection" as const,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth" as const,
      padding: { top: 12, bottom: 12 },
      wordWrap: "off" as const,
      fixedOverflowWidgets: true,
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      tabCompletion: "on" as const,
    }),
    [],
  );

  return (
    <Editor
      height="100%"
      language={language}
      theme={theme === "light" ? "ascension-light" : "ascension-dark"}
      beforeMount={beforeMount}
      onMount={onMount}
      value={value}
      onChange={(v) => onValueChange(v ?? "")}
      options={options}
      loading={
        <div className="flex h-full items-center justify-center bg-[#0B0F14] text-sm text-slate-500">
          Loading editor…
        </div>
      }
    />
  );
}
