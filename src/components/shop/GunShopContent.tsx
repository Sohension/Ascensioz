"use client";

import Image from "next/image";
import { toast } from "sonner";

export default function GunShopContent() {
  const handlePreviewPurchase = () => {
    toast("Coming soon", {
      description: "Gun purchases will be available in a future update.",
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Arsenal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Gun Shop
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Collect rare gear for your next challenge.
          </p>
        </div>
      </div>

      <div className="max-w-sm rounded-2xl border border-amber-400/70 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
        <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl border border-amber-400/30 bg-black/10">
          <Image
            src="/untitled.gif"
            alt="Ascensioza animated preview"
            width={32}
            height={64}
            unoptimized
            className="h-72 w-56 rotate-90 object-contain [image-rendering:pixelated]"
          />
          <span className="absolute right-3 top-3 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-500">
            Legendary
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">Ascensioza</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              The first gun in the Ascensioz website.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePreviewPurchase}
          className="mt-5 w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-[var(--color-primary-foreground)] shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Gun
        </button>
      </div>
    </section>
  );
}
