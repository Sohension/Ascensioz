"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { THEMES_CATALOG } from "@/config/themes";

export const ThemeSwitcher: React.FC = () => {
  const { equippedThemeId, ownedThemeIds, equipTheme, refreshUserData } =
    useTheme();
  const [isUpdating, setIsUpdating] = useState(false);

  const availableThemes = THEMES_CATALOG.filter(
    (t) => ownedThemeIds.includes(t.id) || t.id === "default",
  );

  const handleThemeChange = async (newThemeId: string) => {
    try {
      setIsUpdating(true);
      await refreshUserData();
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
          border: "var(--border-width) var(--border-style) var(--color-border)",
          padding: "var(--theme-control-padding, 0.5rem 1rem)",
          borderRadius: "var(--radius-input)",
          cursor: isUpdating ? "not-allowed" : "pointer",
          fontWeight: 500,
          letterSpacing: "var(--letter-spacing)",
          boxShadow: "var(--shadow-button)",
          opacity: isUpdating ? 0.7 : 1,
          outline: "none",
          transition: "all 0.2s ease",
        }}
      >
        {availableThemes.map((theme) => (
          <option
            key={theme.id}
            value={theme.id}
            style={{
              background: theme.tokens.surface,
              color: theme.tokens.text,
            }}
          >
            🎨 {theme.name} {theme.id === equippedThemeId ? "(Active)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
};
