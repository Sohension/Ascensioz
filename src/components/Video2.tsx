"use client";

import { useEffect, useRef } from "react";

export default function BackgroundVideoTwo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Background blur layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute inset-0 w-full h-full object-cover
          scale-110 blur-2xl opacity-10
        "
      >
        <source src="/shipjourney.mp4" type="video/mp4" />
      </video>

      {/* Main video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute inset-0 w-full h-full object-cover
          brightness-[0.08]
          contrast-[1.4]
          saturate-[0.7]
        "
      >
        <source src="/shipjourney.mp4" type="video/mp4" />
      </video>

      {/* Main dark layer */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Extra shadow depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
    </div>
  );
}
