"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.12;
    audio.loop = true;
    audio.play().then(() => {
      setIsPlaying(true);
      setIsBlocked(false);
    }).catch(() => {
      setIsPlaying(false);
      setIsBlocked(true);
    });
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsBlocked(false);
      } catch {
        setIsBlocked(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/alex-morgan-lofi-coffee-shop-568150.mp3"
        preload="auto"
        loop
        playsInline
      />
      <button
        type="button"
        onClick={toggleAudio}
        className="global-audio-btn"
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={isBlocked ? "Tap to enable audio" : isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "♫" : "🔈"}
      </button>
    </>
  );
}
