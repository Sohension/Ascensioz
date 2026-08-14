"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { THEMES_CATALOG } from "@/config/themes";

export const ThemeSwitcher: React.FC = () => {
  const { equippedThemeId, ownedThemeIds, equipTheme } = useTheme();

  // Filter catalog to show only themes the user actually owns
  const availableThemes = THEMES_CATALOG.filter(
    (t) => ownedThemeIds.includes(t.id) || t.id === "default",
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <select
        value={equippedThemeId}
        onChange={(e) => equipTheme(e.target.value)}
        style={{
          background: "var(--color-surface)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {availableThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            🎨 {theme.name} {theme.id === equippedThemeId ? "(Active)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
};
