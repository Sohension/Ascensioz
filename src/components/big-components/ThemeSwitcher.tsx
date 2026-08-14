"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { THEMES_CATALOG } from "@/config/themes";

export const ThemeSwitcher: React.FC = () => {
  const { equippedThemeId, ownedThemeIds, equipTheme, refreshUserData } =
    useTheme();
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter catalog to show only themes the user actually owns
  const availableThemes = THEMES_CATALOG.filter(
    (t) => ownedThemeIds.includes(t.id) || t.id === "default",
  );

  const handleThemeChange = async (newThemeId: string) => {
    try {
      setIsUpdating(true);
      // Ensure context data is fresh before applying
      await refreshUserData();
      // Apply the theme
      await equipTheme(newThemeId);
    } catch (err) {
      console.error("Failed to switch theme:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <select
        value={equippedThemeId}
        onChange={(e) => handleThemeChange(e.target.value)}
        disabled={isUpdating}
        style={{
          background: "var(--color-surface)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          cursor: isUpdating ? "not-allowed" : "pointer",
          fontWeight: "bold",
          opacity: isUpdating ? 0.7 : 1,
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
