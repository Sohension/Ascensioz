export interface PersistedProject {
  files: Record<string, string>;
  activeFile: string;
  openTabs: string[];
  theme: "vs-dark" | "light";
  explorerOpen: boolean;
}

const STORAGE_KEY = "ascension-ide-project";

export const DEFAULT_PROJECT: PersistedProject = {
  files: {
    "main.py": `def hello():
    print("Hello World")


hello()
`,
    "utils.py": `def add(a, b):
    return a + b


def greet(name):
    return f"Hello, {name}!"
`,
    "README.md": `# Python IDE

Welcome to your Python IDE.

- Press **Ctrl/Cmd + Enter** to run the active file.
- Press **Ctrl/Cmd + S** to save.
- Press **Ctrl/Cmd + P** to open a file quickly.
- Press **Ctrl/Cmd + B** to toggle the explorer.

Try editing \`main.py\` and running it!
`,
  },
  activeFile: "main.py",
  openTabs: ["main.py", "utils.py", "README.md"],
  theme: "vs-dark",
  explorerOpen: true,
};

export function loadProject(): PersistedProject {
  if (typeof window === "undefined") return DEFAULT_PROJECT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROJECT;
    const parsed = JSON.parse(raw) as Partial<PersistedProject>;
    return {
      files: parsed.files ?? DEFAULT_PROJECT.files,
      activeFile:
        parsed.activeFile && parsed.files?.[parsed.activeFile]
          ? parsed.activeFile
          : DEFAULT_PROJECT.activeFile,
      openTabs: parsed.openTabs ?? DEFAULT_PROJECT.openTabs,
      theme: parsed.theme === "light" ? "light" : "vs-dark",
      explorerOpen: parsed.explorerOpen ?? true,
    };
  } catch {
    return DEFAULT_PROJECT;
  }
}

export function saveProject(project: PersistedProject): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function resetProject(): PersistedProject {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ...DEFAULT_PROJECT, files: { ...DEFAULT_PROJECT.files } };
}
