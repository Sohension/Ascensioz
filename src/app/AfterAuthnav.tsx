"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rajdhani } from "next/font/google";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Stats = {
  coins: number;
  ascenzy: number;
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
          .select("coins, ascenzy")
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
  // Checks user metadata for Google (picture/avatar_url) or GitHub (avatar_url)
  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture ||
    null;

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
    { name: "Events", href: "/events", comingSoon: true },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    router.replace("/auth/login");
  };

  return (
    <nav
      className={`w-full ${rajdhani.className} z-50 relative bg-white/70 dark:bg-black/70 backdrop-blur-3xl border-b border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-wide transition-all duration-200 hover:opacity-80"
          >
            Ascension
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
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
                      className={`relative group tracking-wide transition-colors duration-200 ${
                        link.comingSoon
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:text-black"
                      }`}
                    >
                      {link.name}
                      {!link.comingSoon && (
                        <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-black scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 origin-left"></span>
                      )}
                    </Link>
                  ) : (
                    <span className="tracking-wide cursor-pointer transition-colors duration-200 hover:text-gray-600 flex items-center gap-1">
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
                      <div className="rounded-xl shadow-xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-3xl border border-white/20 dark:border-white/10 flex flex-col p-2">
                        {link.children?.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10"
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
          <div className="flex items-center gap-4">
            <AnimatedThemeToggler
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-white/50 dark:bg-white/10 transition-colors hover:bg-black/5 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Switch between light and dark theme"
            />
            {/* Stats */}
            {stats && (
              <div className="flex items-center gap-3 font-semibold">
                <span className="hover:cursor-pointer text-lg transition-transform duration-200 hover:scale-105">
                  💰 {stats.coins}
                </span>
                <span className="hover:cursor-pointer text-lg transition-transform duration-200 hover:scale-105">
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
                className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-200 hover:ring-black transition-all duration-200 focus:outline-none flex items-center justify-center bg-gray-100"
                aria-label="User Profile Menu"
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Google or GitHub Avatar"
                    fill
                    sizes="36px"
                    className="object-cover transition-transform duration-200 hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <span className="font-bold text-gray-700 text-sm">
                    {user?.email ? user.email.charAt(0).toUpperCase() : "👤"}
                  </span>
                )}
              </button>

              {/* Profile Dropdown containing /profile and Logout */}
              <div
                className={`absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-3xl border border-white/20 dark:border-white/10 transition-all duration-200 ease-in-out z-50 ${
                  isProfileOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <div className="flex flex-col p-2 text-sm font-medium">
                  {user ? (
                    <>
                      <div className="px-3 py-1.5 text-xs text-gray-400 border-b border-gray-100 mb-1 truncate">
                        {user.email}
                      </div>

                      {/* Link 1: Profile page */}
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
                      >
                        Profile
                      </Link>

                      {/* Link 2: Logout Action */}
                      <button
                        onClick={handleSignOut}
                        className="text-left w-full px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="md:hidden text-xl p-1 transition-transform duration-200 hover:scale-110 active:scale-95"
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
        <div className="md:hidden border-t border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-3xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const hasChildren = Boolean(link.children);
            const isExpanded = expandedMobileMenu === link.name;

            return (
              <div
                key={link.name}
                className="border-b border-gray-100/50 last:border-none pb-2 pt-1"
              >
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() =>
                        setExpandedMobileMenu(isExpanded ? null : link.name)
                      }
                      className="w-full flex justify-between items-center py-2 text-base font-medium transition-colors duration-200"
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
                            className="py-2 text-sm font-medium transition-colors duration-200 hover:text-gray-600"
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
                      link.comingSoon ? "text-gray-400" : "hover:text-gray-600"
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
            className={`bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/30 dark:border-white/10 text-black dark:text-white px-5 py-2 rounded-xl shadow-xl text-sm transition-all duration-300 ease-in-out ${
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
