"use client";
import { useEffect, useRef } from "react";

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // smoother but not too slow
    }
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Soft blur layer for depth */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-lg opacity-20"
      >
        <source src="/shopwebm.webm" type="video/webm" />
      </video>

      {/* Main video (natural look) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute inset-0 w-full h-full object-cover
          brightness-[0.9]
          contrast-[1.05]
          saturate-[0.95]
          hue-rotate-20
        "
      >
        <source src="/shopwebm.webm" type="video/webm" />
      </video>

      {/* Very light overlay (not dark) */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
