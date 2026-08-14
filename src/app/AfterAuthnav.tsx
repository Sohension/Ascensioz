"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rajdhani } from "next/font/google";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/context/ThemeContext";
import { THEMES_CATALOG } from "@/config/themes";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Stats = {
  coins: number;
  ascenzy: number;
  xp: number;
  level?: number;
  rank?: string;
};

type NavChild = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href?: string;
  comingSoon?: boolean;
  children?: NavChild[];
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const router = useRouter();
  const { equippedThemeId, ownedThemeIds, equipTheme } = useTheme();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMounted, setToastMounted] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const unmountTimer = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (currentUser) {
        setUser(currentUser);

        const { data: statsData, error } = await supabase
          .from("user_stats")
          .select("coins, ascenzy, xp, level, rank")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.error("Stats fetch error:", error.message);
        } else if (statsData) {
          setStats(statsData);
        }
      }
    };

    loadData();

    // Close profile dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- TOAST ---------------- */
  const showComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();

    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (unmountTimer.current) clearTimeout(unmountTimer.current);

    setToastMounted(true);

    requestAnimationFrame(() => {
      setToastVisible(true);
    });

    hideTimer.current = setTimeout(() => {
      setToastVisible(false);
    }, 2000);

    unmountTimer.current = setTimeout(() => {
      setToastMounted(false);
    }, 2300);
  };

  /* ---------------- AVATAR RESOLVER ---------------- */
  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture ||
    null;

  const xp = stats?.xp ?? 0;
  const level = Math.max(1, stats?.level ?? Math.floor(xp / 250) + 1);
  const currentLevelXp = Math.max(0, (level - 1) * 250);
  const nextLevelXp = level * 250;
  const xpIntoLevel = Math.max(0, xp - currentLevelXp);
  const levelProgress = Math.min(
    Math.round((xpIntoLevel / Math.max(1, nextLevelXp - currentLevelXp)) * 100),
    100,
  );

  const navLinks: NavItem[] = [
    { name: "Home", href: "/dashboard" },
    {
      name: "Learn",
      children: [{ name: "Paths", href: "/learn/paths" }],
    },
    {
      name: "Practice",
      children: [{ name: "Problems", href: "/practice" }],
    },
    {
      name: "Community",
      children: [{ name: "Blog", href: "/community/blog" }],
    },
    { name: "Friends", href: "/friends" },
    { name: "IDE", href: "/ide" },
    { name: "Theme Shop", href: "/theme-shop" },
    { name: "Events", href: "/events", comingSoon: true },
  ];

  const availableThemes = THEMES_CATALOG.filter(
    (t) => ownedThemeIds.includes(t.id) || t.id === "default",
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    router.replace("/auth/login");
  };

  return (
    <nav
      className={`w-full ${rajdhani.className} z-50 relative bg-[var(--color-surface)]/80 backdrop-blur-3xl border-b border-[var(--color-border)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/icon.svg"
                alt="Ascension Icon"
                fill
                sizes="32px"
                className="object-contain"
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const hasDropdown = Boolean(link.children);

              return (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => hasDropdown && setActiveMenu(link.name)}
                  onMouseLeave={() => hasDropdown && setActiveMenu(null)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={link.comingSoon ? showComingSoon : undefined}
                      className={`relative group tracking-wide transition-colors duration-200 text-sm font-medium ${
                        link.comingSoon
                          ? "text-[var(--color-muted)] cursor-not-allowed"
                          : "text-[var(--color-text)] hover:opacity-80"
                      }`}
                    >
                      {link.name}
                      {!link.comingSoon && (
                        <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-[var(--color-primary)] scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 origin-left"></span>
                      )}
                    </Link>
                  ) : (
                    <span className="tracking-wide cursor-pointer transition-colors duration-200 text-sm font-medium text-[var(--color-text)] hover:opacity-80 flex items-center gap-1">
                      {link.name}
                    </span>
                  )}

                  {/* Dropdown Menu */}
                  {hasDropdown && (
                    <div
                      className={`absolute left-0 top-full pt-1 w-48 transition-all duration-200 ease-in-out z-50 ${
                        activeMenu === link.name
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                    >
                      <div className="rounded-xl shadow-xl bg-[var(--color-surface)] backdrop-blur-3xl border border-[var(--color-border)] flex flex-col p-2">
                        {link.children?.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-[var(--color-background)] text-[var(--color-text)] text-sm"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Dropdown */}
            <select
              value={equippedThemeId}
              onChange={(e) => equipTheme(e.target.value)}
              aria-label="Select theme"
              className="hidden lg:block bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              {availableThemes.map((theme) => (
                <option
                  key={theme.id}
                  value={theme.id}
                  className="bg-[var(--color-surface)] text-[var(--color-text)]"
                >
                  🎨 {theme.name}
                </option>
              ))}
            </select>

            {/* Dark/Light Mode Toggler */}
            <AnimatedThemeToggler
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:opacity-80 focus-visible:outline-none"
              aria-label="Toggle theme mode"
            />

            {/* Level / XP Progress Widget */}
            {stats && (
              <div className="hidden xl:flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]">
                <div className="w-36">
                  <div className="mb-1 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    <span>Lv {level}</span>
                    <span>
                      {xpIntoLevel}/{nextLevelXp - currentLevelXp} XP
                    </span>
                  </div>
                  <Progress
                    value={levelProgress}
                    max={100}
                    className="h-1.5 rounded-full bg-[var(--color-background)] [&>div]:bg-[var(--color-primary)]"
                  />
                </div>
              </div>
            )}

            {/* Currencies (Coins & Ascenzy) */}
            {stats && (
              <div className="flex items-center gap-2 font-bold text-sm">
                <span
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  title="Coins"
                >
                  🪙 {stats.coins}
                </span>
                <span
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  title="Ascenzy"
                >
                  ✨ {stats.ascenzy}
                </span>
              </div>
            )}

            {/* Profile Avatar & Dropdown */}
            <div
              ref={profileRef}
              className="relative py-2"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all duration-200 focus:outline-none flex items-center justify-center bg-[var(--color-background)]"
                aria-label="User Profile Menu"
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    fill
                    sizes="36px"
                    className="object-cover transition-transform duration-200 hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <span className="font-bold text-[var(--color-text)] text-sm">
                    {user?.email ? user.email.charAt(0).toUpperCase() : "👤"}
                  </span>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl bg-[var(--color-surface)] backdrop-blur-3xl border border-[var(--color-border)] transition-all duration-200 ease-in-out z-50 ${
                  isProfileOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <div className="flex flex-col p-2 text-sm font-medium">
                  {user ? (
                    <>
                      <div className="px-3 py-1.5 text-xs text-[var(--color-muted)] border-b border-[var(--color-border)] mb-1 truncate">
                        {user.email}
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--color-background)] text-[var(--color-text)]"
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="text-left w-full px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-red-500/10 text-red-500 font-semibold"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--color-background)] text-[var(--color-text)]"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="md:hidden text-xl p-1 transition-transform duration-200 hover:scale-110 active:scale-95 text-[var(--color-text)]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-3xl px-4 pt-2 pb-6 space-y-2">
          {/* Mobile Theme Switcher Select */}
          <div className="py-2">
            <label className="block text-xs font-bold text-[var(--color-muted)] mb-1 uppercase tracking-wider">
              Active Theme
            </label>
            <select
              value={equippedThemeId}
              onChange={(e) => equipTheme(e.target.value)}
              aria-label="Select theme mobile"
              className="w-full bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer outline-none"
            >
              {availableThemes.map((theme) => (
                <option
                  key={theme.id}
                  value={theme.id}
                  className="bg-[var(--color-surface)] text-[var(--color-text)]"
                >
                  🎨 {theme.name}
                </option>
              ))}
            </select>
          </div>

          {navLinks.map((link) => {
            const hasChildren = Boolean(link.children);
            const isExpanded = expandedMobileMenu === link.name;

            return (
              <div
                key={link.name}
                className="border-b border-[var(--color-border)] last:border-none pb-2 pt-1"
              >
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() =>
                        setExpandedMobileMenu(isExpanded ? null : link.name)
                      }
                      className="w-full flex justify-between items-center py-2 text-base font-medium text-[var(--color-text)]"
                    >
                      <span>{link.name}</span>
                      <span
                        className="text-xs transition-transform duration-200"
                        style={{
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▼
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="pl-4 py-1 space-y-1 flex flex-col">
                        {link.children?.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="py-2 text-sm font-medium transition-colors duration-200 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href || "#"}
                    onClick={(e) => {
                      if (link.comingSoon) {
                        showComingSoon(e);
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className={`block py-2 text-base font-medium transition-colors duration-200 ${
                      link.comingSoon
                        ? "text-[var(--color-muted)]"
                        : "text-[var(--color-text)] hover:opacity-80"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Notification */}
      {toastMounted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className={`bg-[var(--color-surface)] backdrop-blur-2xl border border-[var(--color-border)] text-[var(--color-text)] px-5 py-2 rounded-xl shadow-xl text-sm transition-all duration-300 ease-in-out ${
              toastVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-95"
            }`}
          >
            Events Coming Soon 🚀
          </div>
        </div>
      )}
    </nav>
  );
}
