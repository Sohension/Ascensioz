"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "pointer">("default");

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleHover = (e: Event) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button")) {
        setVariant("pointer");
      } else {
        setVariant("default");
      }
    };

    const animate = () => {
      if (!cursorRef.current) return;

      // smooth follow
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleHover);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleHover);
    };
  }, []);

  return (
    <>
      {/* Hide default cursor */}
      <style>{`body { cursor: none; }`}</style>

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {variant === "default" ? <PixelArrow /> : <PixelHand />}
      </div>
    </>
  );
}

/* 🧠 Arrow */
function PixelArrow() {
  return (
    <div
      className="w-5 h-5 bg-black"
      style={{
        clipPath:
          "polygon(0% 0%, 100% 50%, 65% 60%, 80% 100%, 60% 100%, 50% 70%, 0% 100%)",
      }}
    />
  );
}

/* ✋ Pointer */
function PixelHand() {
  return <div className="w-4 h-4 bg-black rounded-sm scale-125" />;
}
