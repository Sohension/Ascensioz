"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { THEMES_CATALOG, ThemeConfig } from "@/config/themes";
import { createClient } from "@/lib/client";

interface ThemeContextType {
  currentTheme: ThemeConfig;
  equippedThemeId: string;
  ownedThemeIds: string[];
  previewTheme: (themeId: string | null) => void;
  previewedTheme: ThemeConfig | null;
  equipTheme: (themeId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [supabase] = useState(() => createClient());

  const [equippedThemeId, setEquippedThemeId] = useState<string>("default");
  const [previewedThemeId, setPreviewedThemeId] = useState<string | null>(null);
  const [ownedThemeIds, setOwnedThemeIds] = useState<string[]>(["default"]);

  const activeThemeId = previewedThemeId || equippedThemeId;
  const currentTheme =
    THEMES_CATALOG.find((t) => t.id === activeThemeId) || THEMES_CATALOG[0];
  const previewedTheme = previewedThemeId
    ? THEMES_CATALOG.find((t) => t.id === previewedThemeId) || null
    : null;

  const refreshUserData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("equipped_theme_id")
        .eq("id", user.id)
        .single();

      if (profile?.equipped_theme_id) {
        setEquippedThemeId(profile.equipped_theme_id);
      }

      const { data: ownerships } = await supabase
        .from("user_themes")
        .select("theme_id")
        .eq("user_id", user.id);

      if (ownerships) {
        setOwnedThemeIds(["default", ...ownerships.map((o) => o.theme_id)]);
      }
    } catch (err) {
      console.error("Error refreshing user theme data:", err);
    }
  }, [supabase]);

  // Fetch user data on mount using queueMicrotask to satisfy React linter rules safely
  useEffect(() => {
    queueMicrotask(() => {
      refreshUserData();
    });
  }, [refreshUserData]);

  // Handle CSS variable injection
  useEffect(() => {
    const root = document.documentElement;
    const t = currentTheme.tokens;
    const isDark = currentTheme.mode === "dark";

    // A theme is the single source of truth for the entire visual language,
    // including light/dark mode. No separate global switcher exists.
    root.setAttribute("data-theme", currentTheme.id);
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    // --- Color tokens ---
    root.style.setProperty("--color-background", t.background);
    root.style.setProperty("--color-surface", t.surface);
    root.style.setProperty("--color-surface-alt", t.surfaceAlt);
    root.style.setProperty("--color-text", t.text);
    root.style.setProperty("--color-muted", t.muted);
    root.style.setProperty("--color-primary", t.primary);
    root.style.setProperty("--color-primary-foreground", t.primaryForeground);
    root.style.setProperty("--color-secondary", t.secondary);
    root.style.setProperty("--color-accent", t.accent);
    root.style.setProperty("--color-border", t.border);
    root.style.setProperty("--color-input", t.input);
    root.style.setProperty("--color-ring", t.ring);
    root.style.setProperty("--color-shadow", t.shadowCard);

    // --- Geometry tokens ---
    root.style.setProperty("--radius-sm", t.radiusInput);
    root.style.setProperty("--radius-md", t.radiusButton);
    root.style.setProperty("--radius-lg", t.radiusButton);
    root.style.setProperty("--radius", t.radiusButton);
    root.style.setProperty("--radius-card", t.radiusCard);
    root.style.setProperty("--radius-button", t.radiusButton);
    root.style.setProperty("--radius-input", t.radiusInput);
    root.style.setProperty("--radius-pill", t.radiusPill);
    root.style.setProperty("--border-width", t.borderWidth);
    root.style.setProperty("--border-style", t.borderStyle);
    root.style.setProperty("--border-color", t.border);
    root.style.setProperty("--navbar-height", "64px");

    // --- Depth / effect tokens ---
    root.style.setProperty("--shadow-sm", "0 1px 2px rgba(0,0,0,0.10)");
    root.style.setProperty("--shadow-md", t.shadowCard);
    root.style.setProperty("--shadow-lg", t.shadowButton);
    root.style.setProperty("--shadow-card", t.shadowCard);
    root.style.setProperty("--shadow-button", t.shadowButton);
    root.style.setProperty("--glow-primary", t.effectGlow);
    root.style.setProperty("--glow-secondary", t.effectGlow);
    root.style.setProperty("--effect-glow", t.effectGlow);
    root.style.setProperty("--blur", t.blur);
    root.style.setProperty("--backdrop-opacity", t.backdropOpacity);
    root.style.setProperty("--background-gradient", t.gradient ?? "none");
    root.style.setProperty("--background-pattern", t.backgroundPattern ?? "none");
    root.style.setProperty("--background-texture", t.texture ?? "none");
    root.style.setProperty("--background-image", [t.texture, t.backgroundPattern]
      .filter(Boolean)
      .join(", ") || "none");
    if (t.gradient) root.style.setProperty("--theme-gradient", t.gradient);
    else root.style.removeProperty("--theme-gradient");

    // --- Typography tokens ---
    root.style.setProperty("--font-body", t.fontBody);
    root.style.setProperty("--font-display", t.fontHeading);
    root.style.setProperty("--font-heading", "var(--font-display)");
    root.style.setProperty("--font-button", t.fontButton);
    root.style.setProperty("--font-nav", "var(--font-body)");
    root.style.setProperty("--font-weight-normal", "400");
    root.style.setProperty("--font-weight-bold", "700");
    root.style.setProperty("--letter-spacing", t.letterSpacing);
    root.style.setProperty("--heading-weight", t.headingWeight);
    root.style.setProperty("--text-transform", t.textTransform);
    root.style.setProperty("--button-height", t.buttonHeight);
    root.style.setProperty("--card-padding", t.cardPadding);
    root.style.setProperty("--theme-control-padding", t.density === "compact" ? "0.4rem 0.75rem" : t.density === "spacious" ? "0.7rem 1.15rem" : "0.55rem 0.9rem");
    root.style.setProperty("--theme-density", t.density);
    root.style.setProperty("--theme-visual-style", t.visualStyle);
    root.style.setProperty("--theme-card-style", t.cardStyle);
    root.style.setProperty("--theme-button-style", t.buttonStyle);
    root.style.setProperty("--theme-border-mode", t.borderStyleMode);
    root.style.setProperty("--theme-motion", t.motion);

    // --- Spacing + motion tokens ---
    root.style.setProperty("--spacing-xs", "0.25rem");
    root.style.setProperty("--spacing-sm", "0.5rem");
    root.style.setProperty("--spacing-md", "1rem");
    root.style.setProperty("--spacing-lg", "1.5rem");
    root.style.setProperty("--spacing-xl", "2.5rem");
    root.style.setProperty("--transition-fast", "120ms");
    root.style.setProperty("--transition-normal", "220ms");
    root.style.setProperty("--transition-slow", "380ms");
    root.style.setProperty("--animation-easing", "cubic-bezier(0.4, 0, 0.2, 1)");

    // --- Keep shadcn semantic tokens in sync so body + shadcn components
    //     (buttons, popovers, progress, etc.) follow the theme's mode. ---
    root.style.setProperty("--background", t.background);
    root.style.setProperty("--foreground", t.text);
    root.style.setProperty("--card", t.surface);
    root.style.setProperty("--card-foreground", t.text);
    root.style.setProperty("--popover", t.surface);
    root.style.setProperty("--popover-foreground", t.text);
    root.style.setProperty("--primary", t.primary);
    root.style.setProperty("--primary-foreground", t.primaryForeground);
    root.style.setProperty("--secondary", t.secondary);
    root.style.setProperty("--secondary-foreground", t.primaryForeground);
    root.style.setProperty("--muted", isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)");
    root.style.setProperty("--muted-foreground", t.muted);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-foreground", t.primaryForeground);
    root.style.setProperty("--border", t.border);
    root.style.setProperty("--input", t.input);
    root.style.setProperty("--ring", t.ring);
  }, [currentTheme]);

  const previewTheme = (themeId: string | null) => {
    setPreviewedThemeId(themeId);
  };

  const equipTheme = async (themeId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("profiles")
      .update({ equipped_theme_id: themeId })
      .eq("id", user.id);

    if (error) throw error;

    setEquippedThemeId(themeId);
    setPreviewedThemeId(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        equippedThemeId,
        ownedThemeIds,
        previewTheme,
        previewedTheme,
        equipTheme,
        refreshUserData,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  // Graceful fallback during static page prerendering (e.g. _not-found)
  if (!context) {
    return {
      currentTheme: THEMES_CATALOG[0],
      equippedThemeId: "default",
      ownedThemeIds: ["default"],
      previewTheme: () => {},
      previewedTheme: null,
      equipTheme: async () => {},
      refreshUserData: async () => {},
    };
  }

  return context;
};
