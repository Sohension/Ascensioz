"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rajdhani } from "next/font/google";
import { createClient } from "@/lib/client";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

 useEffect(() => {
   const getSession = async () => {
     const { data } = await supabase.auth.getSession();
     setUser(data.session?.user ?? null);
   };

   getSession();

   const { data: listener } = supabase.auth.onAuthStateChange(
     (_event, session) => {
       setUser(session?.user ?? null);
     },
   );

   return () => {
     listener.subscription.unsubscribe();
   };
 },);

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "/default-avatar.png";

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Learn",
      children: [
        { name: "Paths", href: "/learn/paths" },
        { name: "Tracks", href: "/learn/tracks" },
        { name: "Roadmap", href: "/learn/roadmap" },
      ],
    },
    {
      name: "Practice",
      children: [
        { name: "Problems", href: "/practice/problems" },
        { name: "Contests", href: "/practice/contests" },
      ],
    },
    { name: "Community", href: "/community" },
    { name: "Events", href: "/events" },
  ];

  return (
    <nav className={`w-full ${rajdhani.className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Ascension
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const hasDropdown = link.children;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setActiveMenu(link.name)}
                  onMouseLeave={() => hasDropdown && setActiveMenu(null)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="relative group tracking-wide"
                    >
                      {link.name}
                      <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  ) : (
                    <span className="cursor-pointer tracking-wide">
                      {link.name}
                    </span>
                  )}

                  {hasDropdown && (
                    <div
                      className={`absolute left-0 top-full mt-2 w-48 rounded-xl shadow-lg bg-white transition-all duration-200 ${
                        activeMenu === link.name
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                    >
                      <div className="flex flex-col p-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="px-3 py-2 rounded-md hover:bg-gray-100"
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

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Profile Avatar */}
            {user && (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <Image
                  src={avatar}
                  alt="profile"
                  width={36}
                  height={36}
                  className="rounded-full cursor-pointer"
                />

                {/* Flyover */}
                <div
                  className={`absolute right-0 top-full mt-2 w-44 rounded-xl shadow-lg bg-white transition-all duration-200 ${
                    isProfileOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  <div className="flex flex-col p-2 text-sm">
                    <Link
                      href="/dashboard"
                      className="px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                      }}
                      className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Button */}
            <button
              className="md:hidden text-xl"
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
          isOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-3 tracking-wide">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.href ? (
                <Link href={link.href} onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ) : (
                <div className="font-medium">{link.name}</div>
              )}

              {link.children && (
                <div className="ml-4 mt-2 flex flex-col space-y-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
