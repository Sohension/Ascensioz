"use client";

import { useState } from "react";
import GunShopContent from "@/components/shop/GunShopContent";
import ThemeShopContent from "@/components/shop/ThemeShopContent";

type ShopCategory = "themes" | "guns";

type ShopCategoryDefinition = {
  id: ShopCategory;
  label: string;
};

const shopCategories: ShopCategoryDefinition[] = [
  { id: "themes", label: "Theme Shop" },
  { id: "guns", label: "Gun Shop" },
];

const categoryContent = {
  themes: <ThemeShopContent />,
  guns: <GunShopContent />,
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("themes");

  return (
    <main className="page-shell px-4 pb-12 pt-8 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="glass-panel mb-6 flex flex-col gap-6 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="section-kicker">Ascensioz Market</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--color-text)]">Shop</h1>
          </div>

          <nav aria-label="Shop categories" className="flex w-full gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/60 p-1 sm:w-auto">
            {shopCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-lg"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </nav>
        </header>

        {categoryContent[activeCategory]}
      </div>
    </main>
  );
}
