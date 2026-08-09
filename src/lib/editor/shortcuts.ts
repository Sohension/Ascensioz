export type ShortcutAction =
  | "run"
  | "save"
  | "quickOpen"
  | "toggleExplorer"
  | "toggleTerminal";

interface ShortcutMapping {
  action: ShortcutAction;
  key: string;
  ctrl: boolean;
  shift?: boolean;
}

const SHORTCUTS: ShortcutMapping[] = [
  { action: "run", key: "Enter", ctrl: true },
  { action: "save", key: "s", ctrl: true },
  { action: "quickOpen", key: "p", ctrl: true },
  { action: "toggleExplorer", key: "b", ctrl: true },
  { action: "toggleTerminal", key: "`", ctrl: true },
];

/**
 * Maps a keydown event to a ShortcutAction, or null if no shortcut matches.
 * Handles both Cmd (mac) and Ctrl (windows/linux).
 */
export function resolveShortcut(e: KeyboardEvent): ShortcutAction | null {
  const isCtrlLike = e.ctrlKey || e.metaKey;
  if (!isCtrlLike) return null;

  const key = e.key.toLowerCase();
  for (const shortcut of SHORTCUTS) {
    if (shortcut.key.toLowerCase() !== key) continue;
    if (shortcut.ctrl && !isCtrlLike) continue;
    if (shortcut.shift && !e.shiftKey) continue;
    if (!shortcut.shift && e.shiftKey) continue;
    e.preventDefault();
    e.stopPropagation();
    return shortcut.action;
  }
  return null;
}

export function shortcutLabel(action: ShortcutAction): string {
  const platform = navigator.platform.toLowerCase().includes("mac")
    ? "⌘"
    : "Ctrl";
  switch (action) {
    case "run":
      return `${platform} + Enter`;
    case "save":
      return `${platform} + S`;
    case "quickOpen":
      return `${platform} + P`;
    case "toggleExplorer":
      return `${platform} + B`;
    case "toggleTerminal":
      return `${platform} + \``;
  }
}
