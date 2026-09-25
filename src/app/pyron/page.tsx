"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Rajdhani } from "next/font/google";
import { ArrowLeft, Maximize, Smartphone } from "lucide-react";
import styles from "./page.module.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function fullscreenGame() {
  const iframe = document.getElementById("game-frame") as HTMLIFrameElement;

  if (iframe?.requestFullscreen) {
    void iframe.requestFullscreen().then(() => {
      const orientation = window.screen.orientation as ScreenOrientation & {
        lock?: (mode: OrientationLockType) => Promise<void>;
      };

      void orientation.lock?.("landscape").catch(() => undefined);
    });
  }
}

export default function PyronPage() {
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const updateOrientation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setIsPortrait(window.innerHeight > window.innerWidth);
        frameId = null;
      });
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <main className={`${rajdhani.className} relative min-h-dvh w-full overflow-hidden bg-slate-950`}>
      {isPortrait && (
        <div className={styles.orientationOverlay} role="alert" aria-live="assertive">
          <div className={styles.orientationMessage}>
            <Smartphone className={styles.orientationIcon} aria-hidden="true" />
            <h1>Please rotate your device to landscape mode</h1>
          </div>
        </div>
      )}

      {/* Top Button Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        {/* Back Button - Left */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-semibold shadow-lg transition-all duration-200 hover:bg-blue-700 hover:border-blue-600 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        {/* Fullscreen Button - Right */}
        <button
          onClick={fullscreenGame}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-semibold shadow-lg transition-all duration-200 hover:bg-yellow-600 hover:border-yellow-500 hover:text-yellow-100 hover:-translate-y-0.5"
        >
          <Maximize className="w-5 h-5" />
          Fullscreen
        </button>
      </div>

      {/* Game Frame */}
      <div
        className={`${styles.gameContainer} ${isPortrait ? styles.gameContainerBlocked : ""}`}
        aria-hidden={isPortrait === true}
      >
        <iframe
          id="game-frame"
          src="/game/index.html"
          className="h-full w-full border-0"
          allow="fullscreen"
        />
      </div>
    </main>
  );
}
