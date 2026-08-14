"use client";

import React from "react";
import { THEMES_CATALOG } from "@/config/themes";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeShopPage() {
  const {
    equippedThemeId,
    ownedThemeIds,
    equipTheme,
    previewTheme,
    previewedTheme,
  } = useTheme();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Theme Shop
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Customize your workspace with unique color palettes. Preview them live
          before equipping!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES_CATALOG.map((theme) => {
          const isOwned =
            ownedThemeIds.includes(theme.id) || theme.id === "default";
          const isEquipped = equippedThemeId === theme.id;
          const isPreviewing = previewedTheme?.id === theme.id;

          return (
            <div
              key={theme.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 bg-[var(--color-surface)] ${
                isEquipped
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                  : "border-[var(--color-border)]"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    {theme.name}
                  </h3>
                  {isEquipped && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      Equipped
                    </span>
                  )}
                </div>

                {/* Color Swatch Preview Blocks */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.surface }}
                    title="Surface"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
                {isOwned ? (
                  <button
                    onClick={() => equipTheme(theme.id)}
                    disabled={isEquipped}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isEquipped
                        ? "bg-[var(--color-background)] text-[var(--color-muted)] cursor-not-allowed"
                        : "bg-[var(--color-primary)] text-white hover:opacity-90"
                    }`}
                  >
                    {isEquipped ? "Equipped" : "Equip Theme"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Hook up your purchase logic here (e.g., spend coins/ascenzy)
                      alert("Theme purchasing integration goes here!");
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-[var(--color-primary)] text-white hover:opacity-90 transition-all duration-200"
                  >
                    Unlock Theme
                  </button>
                )}

                <button
                  onMouseEnter={() => previewTheme(theme.id)}
                  onMouseLeave={() => previewTheme(null)}
                  className="py-2 px-3 rounded-xl text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                  title="Hover to preview live"
                >
                  {isPreviewing ? "Previewing" : "Preview"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
