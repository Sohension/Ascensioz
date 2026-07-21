"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function CodeEditor({
  onCodeChange,
}: {
  onCodeChange?: (code: string) => void;
}) {
  const [code, setCode] = useState(`print("Hello World")`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBeforeMount = (monaco: any) => {
    monaco.editor.defineTheme("ascension-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        {
          token: "keyword",
          foreground: "FFD400", // electric yellow
          fontStyle: "bold",
        },
        {
          token: "string",
          foreground: "7FDBFF", // cool-steel
        },
        {
          token: "comment",
          foreground: "6B7280",
          fontStyle: "italic",
        },
      ],
      colors: {
        "editor.background": "#0B0F14", // ink-black
        "editor.foreground": "#e5e7eb",
        "editorLineNumber.foreground": "#374151",
        "editorCursor.foreground": "#FFD400",
        "editor.selectionBackground": "#1F2937",
      },
    });
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="python"
      theme="ascension-theme"
      beforeMount={handleBeforeMount}
      value={code}
      onChange={(value) => {
        const newCode = value || "";
        setCode(newCode);
        onCodeChange?.(newCode);
      }}
    />
  );
}
