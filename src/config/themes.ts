export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
    shadow: string;
  };
}

export const THEMES_CATALOG: ThemeConfig[] = [
  {
    id: "default",
    name: "Default",
    description: "The standard clean system theme.",
    price: 0,
    colors: {
      background: "#0f172a",
      surface: "#1e293b",
      primary: "#3b82f6",
      secondary: "#60a5fa",
      accent: "#1d4ed8",
      text: "#f8fafc",
      muted: "#94a3b8",
      border: "#334155",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon lights, futuristic interfaces, and cybernetic energy.",
    price: 100,
    colors: {
      background: "#080812",
      surface: "#111122",
      primary: "#00FFFF",
      secondary: "#FF00FF",
      accent: "#8A2BE2",
      text: "#FFFFFF",
      muted: "#A8A8C0",
      border: "#27274A",
      shadow: "0 0 20px rgba(0, 255, 255, 0.2)",
    },
  },
  {
    id: "rose",
    name: "Rose",
    description: "Elegant rose tones with a premium soft glow.",
    price: 100,
    colors: {
      background: "#1A0F14",
      surface: "#2D1822",
      primary: "#FF66B2",
      secondary: "#FF99CC",
      accent: "#E05695",
      text: "#FFF0F5",
      muted: "#C49AAF",
      border: "#4D2639",
      shadow: "0 4px 20px rgba(255, 102, 178, 0.15)",
    },
  },
  {
    id: "caramel",
    name: "Caramel",
    description: "Warm gold accents, rich creams, and a cozy premium feel.",
    price: 100,
    colors: {
      background: "#181412",
      surface: "#26201C",
      primary: "#E0A96D",
      secondary: "#F4D06F",
      accent: "#C18C5D",
      text: "#FDF8F5",
      muted: "#B5A499",
      border: "#453830",
      shadow: "0 4px 20px rgba(224, 169, 109, 0.15)",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep blue depths paired with clean aqua and cyan gradients.",
    price: 100,
    colors: {
      background: "#0A1118",
      surface: "#121F2C",
      primary: "#00B4D8",
      secondary: "#90E0EF",
      accent: "#0077B6",
      text: "#CAF0F8",
      muted: "#8D99AE",
      border: "#1D3557",
      shadow: "0 4px 20px rgba(0, 180, 216, 0.2)",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description:
      "Deep earthy greens and organic tones for a natural atmosphere.",
    price: 100,
    colors: {
      background: "#0A140C",
      surface: "#132417",
      primary: "#2D6A4F",
      secondary: "#52B788",
      accent: "#40916C",
      text: "#D8F3DC",
      muted: "#95D5B2",
      border: "#1B4332",
      shadow: "0 4px 20px rgba(45, 106, 79, 0.2)",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description:
      "Minimalist dark navy scheme with sharp professional highlights.",
    price: 100,
    colors: {
      background: "#0B0F19",
      surface: "#111827",
      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#1E40AF",
      text: "#F3F4F6",
      muted: "#9CA3AF",
      border: "#1F2937",
      shadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Vibrant blend of warm oranges, deep reds, and rich purples.",
    price: 100,
    colors: {
      background: "#160C14",
      surface: "#251422",
      primary: "#FF5964",
      secondary: "#FFB703",
      accent: "#FB8500",
      text: "#FFF3B0",
      muted: "#E0A9A2",
      border: "#4A223E",
      shadow: "0 4px 20px rgba(255, 89, 100, 0.2)",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    description:
      "Northern lights inspired palette featuring cyan, green, and purple.",
    price: 100,
    colors: {
      background: "#081018",
      surface: "#102030",
      primary: "#06D6A0",
      secondary: "#118AB2",
      accent: "#7209B7",
      text: "#E2FDCB",
      muted: "#8FA8BF",
      border: "#1A365D",
      shadow: "0 4px 20px rgba(6, 214, 160, 0.2)",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    description:
      "Soft cherry blossom pinks and cream whites for an elegant look.",
    price: 100,
    colors: {
      background: "#1F161A",
      surface: "#302228",
      primary: "#FFB5A7",
      secondary: "#FCD5CE",
      accent: "#F8EDEB",
      text: "#FFF1ED",
      muted: "#D8A47F",
      border: "#4D333D",
      shadow: "0 4px 20px rgba(255, 181, 167, 0.15)",
    },
  },
  {
    id: "retro",
    name: "Retro",
    description:
      "Vintage arcade inspiration with warm contrasting arcade tones.",
    price: 100,
    colors: {
      background: "#14121C",
      surface: "#211D2E",
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFE66D",
      text: "#F7FFF7",
      muted: "#A39BA8",
      border: "#3D354A",
      shadow: "0 4px 20px rgba(78, 205, 196, 0.15)",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    description:
      "Luxurious deep emerald greens set against refined gold accents.",
    price: 100,
    colors: {
      background: "#08120E",
      surface: "#10221A",
      primary: "#D4AF37",
      secondary: "#50C878",
      accent: "#2A7B4C",
      text: "#F0FDF4",
      muted: "#86A592",
      border: "#1E3F30",
      shadow: "0 4px 20px rgba(212, 175, 55, 0.15)",
    },
  },
  {
    id: "cosmic",
    name: "Cosmic",
    description: "Deep space purples, electric blues, and celestial cyan hues.",
    price: 100,
    colors: {
      background: "#0C071E",
      surface: "#160F30",
      primary: "#9D4EDD",
      secondary: "#00F5D4",
      accent: "#7209B7",
      text: "#F8F9FA",
      muted: "#9E90B9",
      border: "#2C1D54",
      shadow: "0 4px 20px rgba(157, 78, 221, 0.2)",
    },
  },
];
