"use client";

import Link from "next/link";

function fullscreenGame() {
  const iframe = document.getElementById("game-frame") as HTMLIFrameElement;

  if (iframe?.requestFullscreen) {
    iframe.requestFullscreen();
  }
}

export default function PyronPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Back Button - Top Left */}
      <Link
        href="/dashboard"
        className="absolute top-4 mt-10 left-4 z-50 rounded bg-black/80 px-4 py-2 text-white hover:bg-black transition-colors flex items-center gap-2 text-sm font-medium"
      >
        ← Back
      </Link>

      {/* Fullscreen Button - Top Right */}
      <button
        onClick={fullscreenGame}
        className="absolute top-4 right-4 z-50 rounded bg-black/80 px-4 py-2 text-white hover:bg-black transition-colors text-sm font-medium"
      >
        Fullscreen
      </button>

      {/* Game Frame */}
      <iframe
        id="game-frame"
        src="/game/index.html"
        className="h-full w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
