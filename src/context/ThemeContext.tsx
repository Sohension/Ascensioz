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
    root.style.setProperty(
      "--color-background",
      currentTheme.colors.background,
    );
    root.style.setProperty("--color-surface", currentTheme.colors.surface);
    root.style.setProperty("--color-primary", currentTheme.colors.primary);
    root.style.setProperty("--color-secondary", currentTheme.colors.secondary);
    root.style.setProperty("--color-accent", currentTheme.colors.accent);
    root.style.setProperty("--color-text", currentTheme.colors.text);
    root.style.setProperty("--color-muted", currentTheme.colors.muted);
    root.style.setProperty("--color-border", currentTheme.colors.border);
    root.style.setProperty("--color-shadow", currentTheme.colors.shadow);
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
