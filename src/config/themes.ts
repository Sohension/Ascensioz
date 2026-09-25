import {
  Rajdhani,
  Orbitron,
  Inter,
  DM_Sans,
  Space_Grotesk,
  Bebas_Neue,
  Cinzel,
  Cormorant_Garamond,
  JetBrains_Mono,
  Press_Start_2P,
  Barlow_Condensed,
  Manrope,
  Syne,
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Sora,
  IBM_Plex_Sans,
  Noto_Sans,
} from "next/font/google";

export type ThemeMode = "light" | "dark";
export type ThemeRarity = "common" | "uncommon" | "rare";

export const THEME_RARITY_PRICES: Record<ThemeRarity, number> = {
  common: 200,
  uncommon: 500,
  rare: 1000,
};

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  mode: ThemeMode;
  rarity: ThemeRarity;
  tokens: ThemeTokens;
}

export interface ThemeTokens {
  // ---- Color ----
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  border: string;
  input: string;
  ring: string;

  // ---- Geometry ----
  radiusCard: string;
  radiusButton: string;
  radiusInput: string;
  radiusPill: string;
  borderWidth: string;
  borderStyle: string;

  // ---- Depth / effects ----
  shadowCard: string;
  shadowButton: string;
  effectGlow: string;
  blur: string;
  backdropOpacity: string;

  // ---- Typography ----
  fontBody: string;
  fontHeading: string;
  fontButton: string;
  letterSpacing: string;
  headingWeight: string;

  // ---- Layout personality ----
  density: "compact" | "comfortable" | "spacious";
  buttonHeight: string;
  cardPadding: string;

  // ---- Visual personality ----
  visualStyle:
    | "minimal"
    | "cyber"
    | "luxury"
    | "organic"
    | "editorial"
    | "technical"
    | "cinematic"
    | "ethereal"
    | "retro"
    | "executive"
    | "cosmic";

  cardStyle: "flat" | "glass" | "outlined" | "elevated" | "tactile" | "soft";

  buttonStyle: "solid" | "pill" | "sharp" | "outline" | "tactile" | "ghost";

  borderStyleMode: "subtle" | "visible" | "heavy" | "neon" | "none";

  textTransform: "none" | "uppercase" | "display";

  // ---- Motion / atmosphere ----
  motion: "calm" | "snappy" | "mechanical" | "fluid" | "dramatic" | "playful";

  gradient?: string;
  backgroundPattern?: string;
  texture?: string;
}

/* ============================================================
   GOOGLE FONTS
   ============================================================ */

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/* ============================================================
   FONT HELPERS
   ============================================================ */

const FONT = {
  rajdhani: rajdhani.style.fontFamily,
  orbitron: orbitron.style.fontFamily,
  inter: inter.style.fontFamily,
  dmSans: dmSans.style.fontFamily,
  spaceGrotesk: spaceGrotesk.style.fontFamily,
  bebas: bebas.style.fontFamily,
  cinzel: cinzel.style.fontFamily,
  cormorant: cormorant.style.fontFamily,
  jetbrains: jetbrains.style.fontFamily,
  pressStart: pressStart.style.fontFamily,
  barlow: barlowCondensed.style.fontFamily,
  manrope: manrope.style.fontFamily,
  syne: syne.style.fontFamily,
  plusJakarta: plusJakarta.style.fontFamily,
  instrumentSerif: instrumentSerif.style.fontFamily,
  sora: sora.style.fontFamily,
  ibmPlexSans: ibmPlexSans.style.fontFamily,
  notoSans: notoSans.style.fontFamily,
};

/* ============================================================
   BASE TOKEN BUILDERS
   ============================================================ */

function darkTokens(over: Partial<ThemeTokens>): ThemeTokens {
  return {
    background: "#07080D",
    surface: "#0E1017",
    surfaceAlt: "#161923",

    text: "#F8FAFC",
    muted: "#94A3B8",

    primary: "#3B82F6",
    primaryForeground: "#FFFFFF",
    secondary: "#60A5FA",
    accent: "#2563EB",

    border: "#1E2230",
    input: "#1E2230",
    ring: "#3B82F6",

    radiusCard: "20px",
    radiusButton: "12px",
    radiusInput: "10px",
    radiusPill: "9999px",

    borderWidth: "1px",
    borderStyle: "solid",

    shadowCard: "0 20px 40px -15px rgba(0,0,0,0.7)",
    shadowButton: "0 8px 25px -6px rgba(59,130,246,0.5)",

    effectGlow: "none",
    blur: "16px",
    backdropOpacity: "0.8",

    fontBody: FONT.inter,
    fontHeading: FONT.inter,
    fontButton: FONT.inter,

    letterSpacing: "-0.01em",
    headingWeight: "700",

    density: "comfortable",
    buttonHeight: "44px",
    cardPadding: "24px",

    visualStyle: "minimal",
    cardStyle: "elevated",
    buttonStyle: "solid",
    borderStyleMode: "subtle",
    textTransform: "none",
    motion: "calm",

    gradient: undefined,
    backgroundPattern: undefined,
    texture: undefined,

    ...over,
  };
}

function lightTokens(over: Partial<ThemeTokens>): ThemeTokens {
  return {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceAlt: "#F1F5F9",

    text: "#090D16",
    muted: "#64748B",

    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    secondary: "#DBEAFE",
    accent: "#1D4ED8",

    border: "#E2E8F0",
    input: "#E2E8F0",
    ring: "#2563EB",

    radiusCard: "20px",
    radiusButton: "12px",
    radiusInput: "10px",
    radiusPill: "9999px",

    borderWidth: "1px",
    borderStyle: "solid",

    shadowCard: "0 20px 40px -15px rgba(15,23,42,0.08)",
    shadowButton: "0 8px 25px -6px rgba(37,99,235,0.3)",

    effectGlow: "none",
    blur: "16px",
    backdropOpacity: "0.8",

    fontBody: FONT.inter,
    fontHeading: FONT.inter,
    fontButton: FONT.inter,

    letterSpacing: "-0.01em",
    headingWeight: "700",

    density: "comfortable",
    buttonHeight: "44px",
    cardPadding: "24px",

    visualStyle: "minimal",
    cardStyle: "elevated",
    buttonStyle: "solid",
    borderStyleMode: "subtle",
    textTransform: "none",
    motion: "calm",

    gradient: undefined,
    backgroundPattern: undefined,
    texture: undefined,

    ...over,
  };
}

/* ============================================================
   THEMES
   ============================================================ */

export const THEMES_CATALOG: ThemeConfig[] = (
  [
  /* ==========================================================
     DEFAULT — MODERN PRODUCT
     ========================================================== */

  {
    id: "default",
    name: "Default",
    description:
      "A polished modern product aesthetic — confident, balanced, clean, and highly usable.",
    price: 0,
    mode: "dark",
    rarity: "common",

    tokens: darkTokens({
      background: "#090D16",
      surface: "#111827",
      surfaceAlt: "#1F2937",

      primary: "#3B82F6",
      secondary: "#60A5FA",
      accent: "#2563EB",

      radiusCard: "18px",
      radiusButton: "10px",
      radiusInput: "9px",

      shadowCard: "0 18px 45px -20px rgba(0,0,0,.7)",
      shadowButton: "0 8px 24px -8px rgba(59,130,246,.45)",

      fontBody: FONT.inter,
      fontHeading: FONT.spaceGrotesk,
      fontButton: FONT.spaceGrotesk,

      letterSpacing: "-0.02em",
      headingWeight: "700",

      density: "comfortable",
      buttonHeight: "46px",
      cardPadding: "24px",

      visualStyle: "minimal",
      cardStyle: "elevated",
      buttonStyle: "solid",
      borderStyleMode: "subtle",
      motion: "calm",

      gradient: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
    }),
  },

  /* ==========================================================
     CYBERPUNK — NEON / INDUSTRIAL / HIGH ENERGY
     ========================================================== */

  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description:
      "A hostile neon interface inspired by underground megacities, machine terminals, holographic signage, and high-voltage nightlife.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#020207",
      surface: "#07070D",
      surfaceAlt: "#11111D",

      primary: "#00F0FF",
      primaryForeground: "#020207",
      secondary: "#FF007F",
      accent: "#A855F7",

      text: "#FFFFFF",
      muted: "#77789A",
      border: "#242444",
      input: "#15152A",

      radiusCard: "3px",
      radiusButton: "2px",
      radiusInput: "2px",
      radiusPill: "2px",

      borderWidth: "1px",

      shadowCard:
        "0 0 35px rgba(0,240,255,.12), inset 0 0 20px rgba(0,240,255,.04)",

      shadowButton: "0 0 24px rgba(255,0,127,.55)",

      effectGlow: "0 0 32px rgba(0,240,255,.4)",

      blur: "8px",
      backdropOpacity: "0.7",

      fontBody: FONT.rajdhani,
      fontHeading: FONT.orbitron,
      fontButton: FONT.rajdhani,

      letterSpacing: "0.08em",
      headingWeight: "800",

      density: "compact",
      buttonHeight: "40px",
      cardPadding: "18px",

      visualStyle: "cyber",
      cardStyle: "outlined",
      buttonStyle: "sharp",
      borderStyleMode: "neon",
      textTransform: "uppercase",
      motion: "mechanical",

      gradient: "linear-gradient(135deg,#00F0FF 0%,#7928CA 45%,#FF007F 100%)",

      backgroundPattern:
        "linear-gradient(rgba(0,240,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.035) 1px,transparent 1px)",

      texture:
        "repeating-linear-gradient(0deg,rgba(255,255,255,.015) 0px,rgba(255,255,255,.015) 1px,transparent 1px,transparent 3px)",
    }),
  },

  /* ==========================================================
     ROSE — FEMININE LUXURY / PERFUME / VELVET
     ========================================================== */

  {
    id: "rose",
    name: "Rose",
    description:
      "Soft romantic luxury — perfume bottles, velvet interiors, polished jewelry, deep crimson, and editorial elegance.",
    price: 100,
    mode: "light",
    rarity: "rare",

    tokens: lightTokens({
      background: "#FFF7F9",
      surface: "#FFFFFF",
      surfaceAlt: "#FFF0F3",

      primary: "#E11D48",
      primaryForeground: "#FFFFFF",
      secondary: "#FDA4AF",
      accent: "#BE123C",

      text: "#4C0519",
      muted: "#9F6673",
      border: "#F8DCE3",
      input: "#FDE7EB",

      radiusCard: "22px",
      radiusButton: "18px",
      radiusInput: "12px",

      shadowCard: "0 30px 70px -20px rgba(159,18,57,.15)",
      shadowButton: "0 12px 35px -8px rgba(225,29,72,.35)",

      effectGlow: "0 0 35px rgba(225,29,72,.14)",
      blur: "22px",
      backdropOpacity: "0.85",

      fontBody: FONT.plusJakarta,
      fontHeading: FONT.instrumentSerif,
      fontButton: FONT.plusJakarta,

      letterSpacing: "-0.025em",
      headingWeight: "700",

      density: "spacious",
      buttonHeight: "50px",
      cardPadding: "30px",

      visualStyle: "luxury",
      cardStyle: "soft",
      buttonStyle: "pill",
      borderStyleMode: "subtle",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#E11D48,#9F1239)",
    }),
  },

  /* ==========================================================
     CARAMEL — EDITORIAL / CAFÉ / ARTISAN
     ========================================================== */

  {
    id: "caramel",
    name: "Caramel",
    description:
      "Warm editorial craftsmanship — parchment, espresso, leather, architecture magazines, and boutique cafés.",
    price: 100,
    mode: "light",
    rarity: "uncommon",

    tokens: lightTokens({
      background: "#FBF8F1",
      surface: "#FFFDF8",
      surfaceAlt: "#F1E8D8",

      primary: "#B45309",
      primaryForeground: "#FFFFFF",
      secondary: "#F4C66A",
      accent: "#92400E",

      text: "#2D241B",
      muted: "#83725D",
      border: "#E8DDCC",
      input: "#EEE4D4",

      radiusCard: "10px",
      radiusButton: "7px",
      radiusInput: "6px",

      shadowCard: "0 18px 40px -22px rgba(120,70,20,.18)",
      shadowButton: "0 7px 18px -5px rgba(180,83,9,.25)",

      effectGlow: "none",
      blur: "8px",
      backdropOpacity: "0.95",

      fontBody: FONT.plusJakarta,
      fontHeading: FONT.instrumentSerif,
      fontButton: FONT.barlow,

      letterSpacing: "0.01em",
      headingWeight: "600",

      density: "comfortable",
      buttonHeight: "44px",
      cardPadding: "26px",

      visualStyle: "editorial",
      cardStyle: "flat",
      buttonStyle: "outline",
      borderStyleMode: "visible",
      motion: "calm",

      gradient: "linear-gradient(135deg,#D97706,#92400E)",

      texture: "linear-gradient(rgba(120,70,20,.025) 1px,transparent 1px)",
    }),
  },

  /* ==========================================================
     OCEAN — GLASS / LIQUID / CALM
     ========================================================== */

  {
    id: "ocean",
    name: "Ocean",
    description:
      "Liquid glass and deep-water calm — translucent surfaces, flowing geometry, cyan light, and underwater depth.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#020814",
      surface: "#071426",
      surfaceAlt: "#0D2238",

      primary: "#22D3EE",
      primaryForeground: "#031018",
      secondary: "#38BDF8",
      accent: "#0284C7",

      text: "#E0F7FF",
      muted: "#76AFC8",
      border: "#16405F",
      input: "#102B45",

      radiusCard: "28px",
      radiusButton: "24px",
      radiusInput: "16px",

      shadowCard: "0 30px 70px -20px rgba(14,165,233,.25)",
      shadowButton: "0 12px 30px -8px rgba(14,165,233,.5)",

      effectGlow: "0 0 45px rgba(34,211,238,.3)",
      blur: "28px",
      backdropOpacity: "0.6",

      fontBody: FONT.manrope,
      fontHeading: FONT.sora,
      fontButton: FONT.sora,

      letterSpacing: "-0.025em",
      headingWeight: "700",

      density: "comfortable",
      buttonHeight: "48px",
      cardPadding: "28px",

      visualStyle: "ethereal",
      cardStyle: "glass",
      buttonStyle: "pill",
      borderStyleMode: "subtle",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#22D3EE,#0284C7,#1E3A8A)",
    }),
  },

  /* ==========================================================
     FOREST — ORGANIC / TACTILE / NATURAL
     ========================================================== */

  {
    id: "forest",
    name: "Forest",
    description:
      "Grounded naturalism — pine, moss, wood, handmade materials, botanical forms, and tactile surfaces.",
    price: 100,
    mode: "dark",
    rarity: "uncommon",

    tokens: darkTokens({
      background: "#030B07",
      surface: "#071810",
      surfaceAlt: "#0E281A",

      primary: "#34D399",
      primaryForeground: "#03100A",
      secondary: "#6EE7B7",
      accent: "#059669",

      text: "#ECFDF5",
      muted: "#73A88E",
      border: "#174B30",
      input: "#12351F",

      radiusCard: "12px",
      radiusButton: "8px",
      radiusInput: "6px",

      shadowCard: "0 24px 50px -20px rgba(0,0,0,.7)",
      shadowButton: "0 8px 20px -6px rgba(16,185,129,.3)",

      effectGlow: "0 0 20px rgba(16,185,129,.12)",

      blur: "12px",
      backdropOpacity: "0.85",

      fontBody: FONT.notoSans,
      fontHeading: FONT.cormorant,
      fontButton: FONT.manrope,

      letterSpacing: "0",
      headingWeight: "700",

      density: "comfortable",
      buttonHeight: "42px",
      cardPadding: "22px",

      visualStyle: "organic",
      cardStyle: "flat",
      buttonStyle: "solid",
      borderStyleMode: "visible",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#34D399,#047857)",
    }),
  },

  /* ==========================================================
     MIDNIGHT — COMMAND CENTER / TECHNICAL
     ========================================================== */

  {
    id: "midnight",
    name: "Midnight",
    description:
      "A disciplined command center — terminal precision, monochrome data, restrained violet, and zero visual noise.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#010308",
      surface: "#060B15",
      surfaceAlt: "#0B1424",

      primary: "#818CF8",
      primaryForeground: "#FFFFFF",
      secondary: "#A5B4FC",
      accent: "#4F46E5",

      text: "#F8FAFC",
      muted: "#7D8AA3",
      border: "#142039",
      input: "#0D1729",

      radiusCard: "6px",
      radiusButton: "4px",
      radiusInput: "4px",

      shadowCard: "0 30px 70px -25px rgba(0,0,0,.9)",
      shadowButton: "0 5px 16px -5px rgba(99,102,241,.28)",

      effectGlow: "none",

      blur: "6px",
      backdropOpacity: "0.95",

      fontBody: FONT.jetbrains,
      fontHeading: FONT.ibmPlexSans,
      fontButton: FONT.jetbrains,

      letterSpacing: "-0.025em",
      headingWeight: "700",

      density: "compact",
      buttonHeight: "40px",
      cardPadding: "20px",

      visualStyle: "technical",
      cardStyle: "outlined",
      buttonStyle: "sharp",
      borderStyleMode: "visible",
      motion: "mechanical",
    }),
  },

  /* ==========================================================
     SUNSET — CINEMATIC / BOLD / ART DIRECTION
     ========================================================== */

  {
    id: "sunset",
    name: "Sunset",
    description:
      "A cinematic late-evening world — burning coral, orange fire, dramatic typography, oversized composition, and emotional contrast.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#10030A",
      surface: "#1D0814",
      surfaceAlt: "#301020",

      primary: "#FB7185",
      primaryForeground: "#FFFFFF",
      secondary: "#FB923C",
      accent: "#F43F5E",

      text: "#FFF1F2",
      muted: "#D995A1",
      border: "#4A1730",
      input: "#351124",

      radiusCard: "24px",
      radiusButton: "18px",
      radiusInput: "12px",

      shadowCard: "0 35px 80px -22px rgba(244,63,94,.35)",
      shadowButton: "0 14px 38px -8px rgba(244,63,94,.6)",

      effectGlow: "0 0 50px rgba(244,63,94,.35)",

      blur: "20px",
      backdropOpacity: "0.68",

      fontBody: FONT.barlow,
      fontHeading: FONT.bebas,
      fontButton: FONT.barlow,

      letterSpacing: "0.035em",
      headingWeight: "400",

      density: "spacious",
      buttonHeight: "52px",
      cardPadding: "30px",

      visualStyle: "cinematic",
      cardStyle: "soft",
      buttonStyle: "pill",
      borderStyleMode: "subtle",
      textTransform: "display",
      motion: "dramatic",

      gradient: "linear-gradient(135deg,#F43F5E,#F97316,#FBBF24)",
    }),
  },

  /* ==========================================================
     AURORA — ETHEREAL / GLASS / DREAMLIKE
     ========================================================== */

  {
    id: "aurora",
    name: "Aurora",
    description:
      "Dreamlike northern-light atmosphere — translucent glass, violet haze, cyan energy, soft geometry, and ambient depth.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#010A12",
      surface: "#061521",
      surfaceAlt: "#0B2234",

      primary: "#2DD4BF",
      primaryForeground: "#02100F",
      secondary: "#C084FC",
      accent: "#8B5CF6",

      text: "#ECFFFC",
      muted: "#72BEB6",
      border: "#145565",
      input: "#103342",

      radiusCard: "30px",
      radiusButton: "32px",
      radiusInput: "18px",

      shadowCard: "0 30px 70px -20px rgba(45,212,191,.2)",
      shadowButton: "0 12px 35px -8px rgba(45,212,191,.42)",

      effectGlow: "0 0 50px rgba(45,212,191,.3)",

      blur: "32px",
      backdropOpacity: "0.52",

      fontBody: FONT.plusJakarta,
      fontHeading: FONT.syne,
      fontButton: FONT.sora,

      letterSpacing: "-0.03em",
      headingWeight: "700",

      density: "spacious",
      buttonHeight: "48px",
      cardPadding: "28px",

      visualStyle: "ethereal",
      cardStyle: "glass",
      buttonStyle: "pill",
      borderStyleMode: "subtle",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#2DD4BF,#06B6D4,#A855F7)",
    }),
  },

  /* ==========================================================
     SAKURA — PORCELAIN / JAPANESE MINIMALISM
     ========================================================== */

  {
    id: "sakura",
    name: "Sakura",
    description:
      "Porcelain minimalism inspired by Japanese stationery, cherry blossoms, quiet luxury, and delicate spring light.",
    price: 100,
    mode: "light",
    rarity: "uncommon",

    tokens: lightTokens({
      background: "#FFF9FB",
      surface: "#FFFFFF",
      surfaceAlt: "#FCEEF4",

      primary: "#DB2777",
      primaryForeground: "#FFFFFF",
      secondary: "#F9A8D4",
      accent: "#BE185D",

      text: "#500724",
      muted: "#A35D79",
      border: "#F3D3E1",
      input: "#FBE7EF",

      radiusCard: "26px",
      radiusButton: "20px",
      radiusInput: "18px",

      shadowCard: "0 24px 60px -28px rgba(219,39,119,.13)",
      shadowButton: "0 10px 28px -8px rgba(219,39,119,.25)",

      effectGlow: "0 0 35px rgba(219,39,119,.1)",

      blur: "22px",
      backdropOpacity: "0.9",

      fontBody: FONT.notoSans,
      fontHeading: FONT.cormorant,
      fontButton: FONT.plusJakarta,

      letterSpacing: "-0.02em",
      headingWeight: "600",

      density: "spacious",
      buttonHeight: "50px",
      cardPadding: "30px",

      visualStyle: "luxury",
      cardStyle: "soft",
      buttonStyle: "pill",
      borderStyleMode: "subtle",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#DB2777,#EC4899,#9D174D)",
    }),
  },

  /* ==========================================================
     RETRO — ARCADE / BRUTALIST / PHYSICAL
     ========================================================== */

  {
    id: "retro",
    name: "Retro",
    description:
      "A physical arcade interface — chunky borders, cream paper, orange plastic, pixel type, and buttons that feel pressable.",
    price: 100,
    mode: "light",
    rarity: "rare",

    tokens: lightTokens({
      background: "#F3EBDD",
      surface: "#FFFDF5",
      surfaceAlt: "#E7DDC9",

      primary: "#F97316",
      primaryForeground: "#FFFFFF",
      secondary: "#FACC15",
      accent: "#DC2626",

      text: "#201B16",
      muted: "#655C52",
      border: "#201B16",
      input: "#E9DEC9",

      radiusCard: "4px",
      radiusButton: "3px",
      radiusInput: "2px",
      radiusPill: "2px",

      borderWidth: "3px",

      shadowCard: "8px 8px 0 #201B16",
      shadowButton: "5px 5px 0 #201B16",

      effectGlow: "none",
      blur: "0px",
      backdropOpacity: "1",

      fontBody: FONT.barlow,
      fontHeading: FONT.pressStart,
      fontButton: FONT.pressStart,

      letterSpacing: "0.03em",
      headingWeight: "400",

      density: "compact",
      buttonHeight: "46px",
      cardPadding: "20px",

      visualStyle: "retro",
      cardStyle: "tactile",
      buttonStyle: "tactile",
      borderStyleMode: "heavy",
      textTransform: "uppercase",
      motion: "playful",

      gradient: "linear-gradient(135deg,#F97316,#DC2626)",

      texture:
        "repeating-linear-gradient(45deg,rgba(32,27,22,.025) 0px,rgba(32,27,22,.025) 1px,transparent 1px,transparent 4px)",
    }),
  },

  /* ==========================================================
     EMERALD — PRIVATE CLUB / EXECUTIVE
     ========================================================== */

  {
    id: "emerald",
    name: "Emerald",
    description:
      "Private-club sophistication — dark green, ivory, tailored typography, understated borders, and quiet wealth.",
    price: 100,
    mode: "light",
    rarity: "uncommon",

    tokens: lightTokens({
      background: "#F5F8F4",
      surface: "#FFFFFC",
      surfaceAlt: "#E8F1E9",

      primary: "#047857",
      primaryForeground: "#FFFFFF",
      secondary: "#86EFAC",
      accent: "#065F46",

      text: "#062C22",
      muted: "#60786F",
      border: "#C8DDD0",
      input: "#E2EEE6",

      radiusCard: "10px",
      radiusButton: "5px",
      radiusInput: "5px",

      shadowCard: "0 24px 50px -22px rgba(4,120,87,.15)",
      shadowButton: "0 8px 22px -6px rgba(4,120,87,.28)",

      effectGlow: "none",

      blur: "10px",
      backdropOpacity: "0.94",

      fontBody: FONT.manrope,
      fontHeading: FONT.cinzel,
      fontButton: FONT.plusJakarta,

      letterSpacing: "0.015em",
      headingWeight: "600",

      density: "comfortable",
      buttonHeight: "44px",
      cardPadding: "26px",

      visualStyle: "executive",
      cardStyle: "flat",
      buttonStyle: "outline",
      borderStyleMode: "visible",
      motion: "calm",

      gradient: "linear-gradient(135deg,#059669,#047857)",
    }),
  },

  /* ==========================================================
     COSMIC — SCI-FI / NEBULA / FUTURISTIC
     ========================================================== */

  {
    id: "cosmic",
    name: "Cosmic",
    description:
      "Deep-space futurism — ultraviolet nebulae, electric teal, infinite voids, luminous controls, and spacecraft-inspired UI.",
    price: 100,
    mode: "dark",
    rarity: "rare",

    tokens: darkTokens({
      background: "#04020C",
      surface: "#0B0618",
      surfaceAlt: "#160D2B",

      primary: "#A78BFA",
      primaryForeground: "#080311",
      secondary: "#22D3EE",
      accent: "#8B5CF6",

      text: "#FAF5FF",
      muted: "#B6A7D6",
      border: "#32145E",
      input: "#21113D",

      radiusCard: "20px",
      radiusButton: "14px",
      radiusInput: "9px",

      shadowCard: "0 35px 80px -20px rgba(139,92,246,.35)",
      shadowButton: "0 12px 38px -8px rgba(139,92,246,.58)",

      effectGlow: "0 0 55px rgba(139,92,246,.34)",

      blur: "24px",
      backdropOpacity: "0.6",

      fontBody: FONT.spaceGrotesk,
      fontHeading: FONT.orbitron,
      fontButton: FONT.sora,

      letterSpacing: "-0.02em",
      headingWeight: "700",

      density: "comfortable",
      buttonHeight: "46px",
      cardPadding: "26px",

      visualStyle: "cosmic",
      cardStyle: "glass",
      buttonStyle: "solid",
      borderStyleMode: "neon",
      motion: "fluid",

      gradient: "linear-gradient(135deg,#8B5CF6,#6366F1,#06B6D4)",

      backgroundPattern:
        "radial-gradient(circle at 20% 20%,rgba(139,92,246,.18),transparent 28%),radial-gradient(circle at 80% 70%,rgba(6,182,212,.12),transparent 30%)",
    }),
  },
  ] satisfies ThemeConfig[]
).map((theme) => ({
  ...theme,
  price: theme.id === "default" ? 0 : THEME_RARITY_PRICES[theme.rarity],
}));
