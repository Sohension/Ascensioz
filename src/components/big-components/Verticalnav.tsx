"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";
import { Home, BookOpen, PenTool, CreditCard } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Verticalnav() {
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Learn", href: "/learn", icon: BookOpen },
    { name: "Practice", href: "/practice", icon: PenTool },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
  ];

  return (
    <nav
      className={`h-[80vh] w-20 ${rajdhani.className} border-r border-t border-b border-border bg-background`}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-10">
        {navLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="relative group flex items-center justify-center"
            >
              {/* Icon */}
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
                {link.name}
              </span>
            </Link>
          );
        })}
        <AnimatedThemeToggler
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Switch between light and dark theme"
        />
      </div>
    </nav>
  );
}
