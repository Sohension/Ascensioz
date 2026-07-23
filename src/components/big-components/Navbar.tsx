"use client";

import { useState } from "react";
import Link from "next/link";
import { Rajdhani } from "next/font/google";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// ✅ font at module scope
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // important for styling
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Learn", href: "/dashboard" },
    { name: "Practice", href: "/dashboard" },
  ];

  return (
    <nav className={`w-full border-b ${rajdhani.className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Logo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative group tracking-wide"
              >
                {link.name}

                {/* underline hover */}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <AnimatedThemeToggler
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Switch between light and dark theme"
          />

          {/* Mobile Button */}
          <div className="flex items-center gap-2 md:hidden">
            <AnimatedThemeToggler
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Switch between light and dark theme"
            />
          <button
            className="text-xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden px-4 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-3 tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        n
      </div>
    </nav>
  );
}
