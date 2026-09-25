"use client";

import React, { useState, useEffect } from "react";
import { THEMES_CATALOG, THEME_RARITY_PRICES } from "@/config/themes";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/client";

export default function ThemeShopContent() {
  const {
    equippedThemeId,
    ownedThemeIds,
    equipTheme,
    previewTheme,
    previewedTheme,
    refreshUserData,
  } = useTheme();
  const [supabase] = useState(() => createClient());
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loadingThemeId, setLoadingThemeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCoins = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_stats")
        .select("coins")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setUserCoins(data.coins ?? 0);
      }
    };

    fetchUserCoins();
  }, [supabase]);

  const handleUnlock = async (themeId: string, price: number) => {
    try {
      setLoadingThemeId(themeId);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (userCoins < price) {
        alert("Not enough coins to unlock this theme!");
        return;
      }

      // Deduct coins from user_stats
      const { error: coinError } = await supabase
        .from("user_stats")
        .update({ coins: userCoins - price })
        .eq("user_id", user.id);

      if (coinError) throw coinError;

      // Grant ownership in user_themes
      const { error: unlockError } = await supabase
        .from("user_themes")
        .insert({ user_id: user.id, theme_id: themeId });

      if (unlockError) throw unlockError;

      // Update local state
      setUserCoins((prev) => prev - price);
      await refreshUserData();
      await equipTheme(themeId);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error unlocking theme:", error.message);
      alert("Failed to unlock theme. Check console for details.");
    } finally {
      setLoadingThemeId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Theme Shop
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Customize your workspace with unique color palettes. Preview them
            live before equipping!
          </p>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 rounded-xl text-sm font-bold text-[var(--color-text)] shadow-sm">
          🪙 {userCoins} Coins
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES_CATALOG.map((theme) => {
          const isOwned =
            ownedThemeIds.includes(theme.id) || theme.id === "default";
          const isEquipped = equippedThemeId === theme.id;
          const isPreviewing = previewedTheme?.id === theme.id;
          const isPurchasing = loadingThemeId === theme.id;
          const themePrice =
            theme.id === "default"
              ? 0
              : THEME_RARITY_PRICES[theme.rarity];

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
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                      {theme.name}
                    </h3>
                    <span className="text-xs text-[var(--color-muted)]">
                      {theme.mode === "dark" ? "🌃 Dark" : "☀️ Light"}
                    </span>
                    <span className="ml-2 text-xs font-semibold capitalize text-[var(--color-primary)]">
                      {theme.rarity}
                    </span>
                    {!isOwned && (
                      <span className="text-xs text-[var(--color-muted)] ml-2">
                        🪙 {themePrice} Coins
                      </span>
                    )}
                  </div>
                  {isEquipped && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      Equipped
                    </span>
                  )}
                </div>

                {/* Color Swatch Preview Blocks */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.tokens.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.tokens.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.tokens.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.tokens.background }}
                    title="Background"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.tokens.surface }}
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
                        : "bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md"
                    }`}
                  >
                    {isEquipped ? "Equipped" : "Equip Theme"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(theme.id, themePrice)}
                    disabled={isPurchasing}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-[var(--color-primary)] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-md"
                  >
                    {isPurchasing
                      ? "Unlocking..."
                      : `Unlock (${themePrice} 🪙)`}
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
