import {
  Inter,
  Space_Grotesk,
  JetBrains_Mono,
  Playfair_Display,
  Cinzel,
  Press_Start_2P,
} from "next/font/google";

// -----------------------------------------------------------------------------
// 1. Google Fonts Initialization (CSS Variables)
// -----------------------------------------------------------------------------

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

/**
 * Combined font variable classnames to inject into root <html> or <body>
 */
export const fontVariables = [
  inter.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  playfair.variable,
  cinzel.variable,
  pressStart2P.variable,
].join(" ");

export const FONT = {
  inter: "var(--font-inter)",
  spaceGrotesk: "var(--font-space-grotesk)",
  jetbrainsMono: "var(--font-jetbrains-mono)",
  playfair: "var(--font-playfair)",
  cinzel: "var(--font-cinzel)",
  pressStart2P: "var(--font-press-start)",
};

// -----------------------------------------------------------------------------
// 2. Types & Typescript Interfaces
// -----------------------------------------------------------------------------

export type ThemeMode = "light" | "dark";
export type ThemeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ThemeTokens {
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
  radiusCard: string;
  radiusButton: string;
  fontBody: string;
  fontHeading: string;
  shadowCard: string;
  shadowButton: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: ThemeMode;
  rarity: ThemeRarity;
  price: number;
  tokens: ThemeTokens;
}

// -----------------------------------------------------------------------------
// 3. Pricing & Tier Constants
// -----------------------------------------------------------------------------

export const THEME_RARITY_PRICES: Record<ThemeRarity, number> = {
  common: 0,
  uncommon: 100,
  rare: 250,
  epic: 500,
  legendary: 1000,
};

// -----------------------------------------------------------------------------
// 4. Default Base Tokens
// -----------------------------------------------------------------------------

const baseTokens: ThemeTokens = {
  background: "#09090b",
  surface: "#18181b",
  surfaceAlt: "#27272a",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  primary: "#3b82f6",
  primaryForeground: "#ffffff",
  secondary: "#64748b",
  accent: "#8b5cf6",
  border: "#27272a",
  radiusCard: "12px",
  radiusButton: "8px",
  fontBody: FONT.inter,
  fontHeading: FONT.spaceGrotesk,
  shadowCard:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  shadowButton: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
};

export const darkTokens = (overrides?: Partial<ThemeTokens>): ThemeTokens => ({
  ...baseTokens,
  ...overrides,
});

export const lightTokens = (overrides?: Partial<ThemeTokens>): ThemeTokens => ({
  ...baseTokens,
  background: "#ffffff",
  surface: "#f4f4f5",
  surfaceAlt: "#e4e4e7",
  text: "#09090b",
  muted: "#71717a",
  border: "#e4e4e7",
  ...overrides,
});

// -----------------------------------------------------------------------------
// 5. Theme Definitions
// -----------------------------------------------------------------------------

const rawThemes: Omit<ThemeConfig, "price">[] = [
  {
    id: "default-dark",
    name: "Dark Default",
    mode: "dark",
    rarity: "common",
    tokens: darkTokens(),
  },
  {
    id: "default-light",
    name: "Light Default",
    mode: "light",
    rarity: "common",
    tokens: lightTokens(),
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    mode: "dark",
    rarity: "uncommon",
    tokens: darkTokens({
      background: "#0d0f18",
      surface: "#16192b",
      surfaceAlt: "#1f243f",
      primary: "#ffe600",
      primaryForeground: "#000000",
      secondary: "#00f0ff",
      accent: "#ff0055",
      border: "#00f0ff44",
      fontHeading: FONT.spaceGrotesk,
      shadowCard: "0 0 15px rgba(0, 240, 255, 0.2)",
    }),
  },
  {
    id: "synthwave",
    name: "Synthwave '84",
    mode: "dark",
    rarity: "rare",
    tokens: darkTokens({
      background: "#1a102f",
      surface: "#261745",
      surfaceAlt: "#36225e",
      text: "#f3e8ff",
      muted: "#b09ec8",
      primary: "#ff71ce",
      primaryForeground: "#ffffff",
      secondary: "#01cdfe",
      accent: "#05ffa1",
      border: "#ff71ce44",
      fontHeading: FONT.spaceGrotesk,
      shadowCard: "0 0 20px rgba(255, 113, 206, 0.25)",
    }),
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    mode: "dark",
    rarity: "rare",
    tokens: darkTokens({
      background: "#061811",
      surface: "#0d2b20",
      surfaceAlt: "#143f30",
      primary: "#10b981",
      primaryForeground: "#000000",
      secondary: "#34d399",
      accent: "#f59e0b",
      border: "#10b98133",
      fontHeading: FONT.cinzel,
    }),
  },
  {
    id: "luxury-gold",
    name: "Royal Obsidian",
    mode: "dark",
    rarity: "epic",
    tokens: darkTokens({
      background: "#0a0a0a",
      surface: "#141414",
      surfaceAlt: "#1f1f1f",
      text: "#fafafa",
      muted: "#a3a3a3",
      primary: "#d4af37",
      primaryForeground: "#000000",
      secondary: "#f3e5ab",
      accent: "#e5c158",
      border: "#d4af3744",
      radiusCard: "16px",
      radiusButton: "12px",
      fontBody: FONT.playfair,
      fontHeading: FONT.cinzel,
      shadowCard: "0 10px 30px -10px rgba(212, 175, 55, 0.2)",
    }),
  },
  {
    id: "retrogaming",
    name: "8-Bit Arcade",
    mode: "dark",
    rarity: "legendary",
    tokens: darkTokens({
      background: "#0f0f1b",
      surface: "#1b1b2f",
      surfaceAlt: "#272740",
      text: "#00ff66",
      muted: "#009933",
      primary: "#ff0055",
      primaryForeground: "#ffffff",
      secondary: "#33ccff",
      accent: "#ffcc00",
      border: "#00ff6644",
      radiusCard: "0px",
      radiusButton: "0px",
      fontBody: FONT.pressStart2P,
      fontHeading: FONT.pressStart2P,
      shadowCard: "4px 4px 0px #ff0055",
      shadowButton: "2px 2px 0px #33ccff",
    }),
  },
];

/**
 * Exported themes array synced with rarity prices
 */
export const THEMES: ThemeConfig[] = rawThemes.map((theme) => ({
  ...theme,
  price: THEME_RARITY_PRICES[theme.rarity],
}));

export const DEFAULT_THEME_ID = "default-dark";

// -----------------------------------------------------------------------------
// 6. Runtime Utility Helpers
// -----------------------------------------------------------------------------

/**
 * Converts a ThemeTokens object into standard CSS variable mappings.
 */
export function getThemeCssVariables(
  tokens: ThemeTokens,
): Record<string, string> {
  return {
    "--bg-background": tokens.background,
    "--bg-surface": tokens.surface,
    "--bg-surface-alt": tokens.surfaceAlt,
    "--text-main": tokens.text,
    "--text-muted": tokens.muted,
    "--color-primary": tokens.primary,
    "--color-primary-fg": tokens.primaryForeground,
    "--color-secondary": tokens.secondary,
    "--color-accent": tokens.accent,
    "--color-border": tokens.border,
    "--radius-card": tokens.radiusCard,
    "--radius-button": tokens.radiusButton,
    "--font-body": tokens.fontBody,
    "--font-heading": tokens.fontHeading,
    "--shadow-card": tokens.shadowCard,
    "--shadow-button": tokens.shadowButton,
  };
}

/**
 * Applies a theme's tokens directly to an HTML element (defaults to document.documentElement).
 */
export function applyThemeVariables(
  theme: ThemeConfig,
  targetElement?: HTMLElement,
): void {
  if (typeof window === "undefined" && !targetElement) return;

  const el = targetElement || document.documentElement;
  const variables = getThemeCssVariables(theme.tokens);

  Object.entries(variables).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });

  el.setAttribute("data-theme", theme.id);
  el.setAttribute("data-theme-mode", theme.mode);
}
