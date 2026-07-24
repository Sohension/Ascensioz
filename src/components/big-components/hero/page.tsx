"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Rajdhani, Montserrat } from "next/font/google";
import Navbar from "@/components/big-components/Navbar";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["800"],
  subsets: ["latin"],
});

// Reusable scroll animation wrapper for sections
const FadeInSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.9, ease: "easeOut", staggerChildren: 0.1 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Floating orb component for depth
const FloatingOrb = ({ 
  size, 
  color, 
  delay, 
  top, 
  left, 
  right 
}: { 
  size: number; 
  color: string; 
  delay: number; 
  top?: string; 
  left?: string; 
  right?: string;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      top,
      left,
      right,
    }}
    animate={{
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 6 + delay,
      ease: "easeInOut",
      repeat: Infinity,
      delay: delay,
    }}
  />
);

export default function Hero() {
  const learningTopics = [
    "Python",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Algorithms",
    "Problem Solving",
  ];

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative overflow-x-hidden min-h-screen antialiased ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"
    }`}>
      <Navbar />

      {/* Background Layers for Depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial Gradient Overlay */}
        <div className={`absolute inset-0 ${
          isDark 
            ? "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(250,204,21,0.1),transparent_50%)]" 
            : "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(250,204,21,0.06),transparent_50%)]"
        }`} />
        
        {/* Floating Orbs */}
        <FloatingOrb size={300} color={isDark ? "#3b82f6" : "#2563eb"} delay={0} top="10%" left="5%" />
        <FloatingOrb size={250} color={isDark ? "#facc15" : "#eab308"} delay={2} top="60%" right="10%" />
        <FloatingOrb size={200} color={isDark ? "#10b981" : "#059669"} delay={4} top="80%" left="30%" />
        
        {/* Animated Grid Pattern */}
        <AnimatedGridPattern className={`absolute inset-0 ${
          isDark ? "text-slate-700/40" : "text-gray-200/65"
        } opacity-70 pointer-events-none`} />
      </div>

      <div className="px-6 md:px-24 xl:px-28 max-w-7xl mx-auto pb-20 relative z-10">
        {/* ================= SECTION 1 — HERO ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-start pt-28 sm:pt-36 overflow-hidden">
          {/* Background Image with Subtle Edge Blur/Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            {/* Solid Gray-900 Background for Dark Mode */}
            <div className={`absolute inset-0 ${isDark ? "bg-slate-900" : ""}`} />
            
            {/* Image Background (with lower opacity in dark mode) */}
            <img
              src="/citybg.gif" // You can change this to /rainbg.gif if you prefer!
              alt="Hero Background"
              className={`w-full h-full object-cover ${isDark ? "opacity-20" : ""}`}
            />
            
            {/* Subtle Edge Gradient Overlay for Blur/Depth Effect */}
            <div className={`absolute inset-0 ${
              isDark 
                ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(30,41,59,0.7)_60%,rgba(30,41,59,0.95)_100%)]" 
                : "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.5)_60%,rgba(255,255,255,0.9)_100%)]"
            }`} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20 max-w-5xl space-y-10 md:space-y-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className={`${montserrat.className} text-5xl sm:text-6xl md:text-8xl xl:text-[110px] tracking-tight leading-[1.05] drop-shadow-lg ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Learn Python <br className="hidden md:inline" />
              by playing.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed max-w-4xl tracking-wide ${
                isDark ? "text-slate-200 drop-shadow-md" : "text-slate-700 drop-shadow-sm"
              }`}
            >
              Discover a growing collection of educational games where every
              challenge teaches a real programming skill. Start your journey
              with Ascension, and explore many more adventures to come.
            </motion.p>

            {/* PROTOTYPE NOTICE BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              className={`${rajdhani.className} max-w-3xl rounded-3xl px-6 py-6 ${
                isDark 
                  ? "bg-slate-950/85 border border-slate-700/70 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl" 
                  : "bg-white/90 border border-slate-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl"
              } transition-all hover:border-yellow-400/80 hover:shadow-[0_35px_90px_rgba(250,204,21,0.2)]`}
            >
              <p className={`text-lg md:text-xl font-bold mb-2 flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-950"
              }`}>
                🚀 <span>Welcome to Ascension 2026's first chapter.</span>
              </p>

              <p className={`text-base md:text-lg leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}>
                You are one of the first people to experience Ascension. This is
                a very early prototype, so you may come across a few bugs or
                unfinished features. Don't worry — we're improving the game with
                every update, and your feedback will help shape its future.
              </p>
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
              className="flex gap-4 pt-2 md:pt-4 flex-wrap items-center"
            >
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg font-bold px-8 py-6 bg-yellow-400 text-black transition-all duration-300 rounded-2xl tracking-wide hover:bg-yellow-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-[0_20px_50px_rgba(250,204,21,0.5)] hover:shadow-[0_30px_70px_rgba(250,204,21,0.7)]`}
                >
                  🚀 Start Learning
                </Button>
              </Link>

              <Link href="/pyron" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg font-semibold px-8 py-6 transition-all duration-300 rounded-2xl tracking-wide hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
                    isDark 
                      ? "border-slate-600 bg-slate-950/70 text-slate-100 hover:border-yellow-400 hover:text-yellow-300 shadow-[0_15px_40px_rgba(0,0,0,0.4)]" 
                      : "border-slate-300 bg-white/80 text-slate-700 hover:text-slate-950 hover:border-slate-500 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                  } backdrop-blur-xl`}
                >
                  🎮 Play Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= SECTION 2 — WHY WE EXIST ================= */}
        <FadeInSection>
          <section className={`relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t ${
            isDark ? "border-slate-800" : "border-slate-100"
          } mt-20 md:mt-48`}>
            <div className="flex flex-col gap-10 md:gap-16 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                Education deserves better games.
              </h2>
              <div
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl space-y-6 md:space-y-8 font-medium tracking-wide max-w-4xl leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <p>
                  Learning programming should not mean watching hours of videos
                  or memorizing syntax.
                </p>
                <p>
                  We believe the best way to learn is by playing, experimenting,
                  and solving problems.
                </p>
                <p className={`font-bold text-2xl sm:text-3xl md:text-4xl pt-2 leading-tight ${
                  isDark ? "text-slate-100" : "text-slate-950"
                }`}>
                  That is why we are building a platform where every game
                  teaches real-world skills while still being genuinely fun.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 3 — LEARN THROUGH ADVENTURES ================= */}
        <FadeInSection>
          <section className={`relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t ${
            isDark ? "border-slate-800 bg-slate-950/70" : "border-slate-100 bg-white/70"
          } mt-20 md:mt-48`}>
            <div className="space-y-10 md:space-y-16 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                Every game teaches something new.
              </h2>
              <p
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-5xl font-medium tracking-wide leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Today, your journey begins in Ascension, an action RPG where
                coding powers your progress. Tomorrow, you will explore entirely
                new worlds, genres, and challenges.
              </p>

              <div className="pt-4 md:pt-8">
                <h3
                  className={`${rajdhani.className} text-sm md:text-base uppercase tracking-[0.2em] mb-6 font-bold ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Our library will continue growing with games that teach:
                </h3>
                <div className="flex flex-wrap gap-3 md:gap-4 max-w-5xl">
                  {learningTopics.map((topic, index) => (
                    <span
                      key={index}
                      className={`${rajdhani.className} text-lg sm:text-xl font-semibold px-6 py-3 rounded-full shadow-sm transition-all hover:scale-105 cursor-default ${
                        isDark 
                          ? "bg-slate-900 border border-slate-700 text-slate-200 hover:border-yellow-400 hover:bg-yellow-900/20" 
                          : "bg-slate-50 border border-slate-200 text-slate-800 hover:border-yellow-400 hover:bg-yellow-50/50"
                      }`}
                    >
                      {topic}
                    </span>
                  ))}
                  <span
                    className={`${rajdhani.className} text-lg sm:text-xl font-semibold px-6 py-3 italic flex items-center ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    And much more...
                  </span>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 4 — ONE ACCOUNT. ENDLESS LEARNING. ================= */}
        <FadeInSection>
          <section className={`relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t ${
            isDark ? "border-slate-800 bg-slate-950/70" : "border-slate-100 bg-white/70"
          } mt-20 md:mt-48`}>
            <div className="flex flex-col gap-10 md:gap-16 max-w-5xl">
              <div className="space-y-6">
                <h2
                  className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] ${
                    isDark ? "text-white" : "text-slate-950"
                  }`}
                >
                  Your progress follows you everywhere.
                </h2>
                <p
                  className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-medium tracking-wide max-w-4xl leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Every game you play contributes to your overall learning
                  journey, creating one connected experience across the entire
                  platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 max-w-5xl">
                {[
                  { title: "Earn XP", icon: "✨" },
                  { title: "Unlock achievements", icon: "🏆" },
                  { title: "Complete quests", icon: "🗺️" },
                  { title: "Climb global leaderboard", icon: "👑" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-8 rounded-3xl backdrop-blur-sm shadow-md hover:shadow-2xl transition-all flex flex-col justify-between min-h-36 group ${
                      isDark 
                        ? "bg-slate-900/80 border border-slate-700/70 hover:border-yellow-400/60" 
                        : "bg-white/90 border border-slate-200/80 hover:border-yellow-400/50"
                    }`}
                  >
                    <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform origin-left">
                      {item.icon}
                    </span>
                    <span
                      className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-bold ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 5 — THE FUTURE ================= */}
        <FadeInSection>
          <section className={`relative min-h-[60vh] flex flex-col justify-center pt-24 sm:pt-32 border-t ${
            isDark ? "border-slate-800 bg-slate-950/70" : "border-slate-100 bg-white/70"
          } mt-20 md:mt-48`}>
            <div className="space-y-10 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                We are just getting started.
              </h2>
              <div
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl space-y-6 font-medium tracking-wide leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <p>Ascension is only the first chapter.</p>
                <p>
                  We are building a growing universe of educational games where
                  every adventure teaches a valuable skill.
                </p>
                <p className={`font-bold ${
                  isDark ? "text-slate-100" : "text-slate-950"
                }`}>
                  Whether you enjoy RPGs, strategy games, simulations, or
                  puzzles, there will always be a new way to learn.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 6 — FINAL CTA ================= */}
        <FadeInSection>
          <section className={`relative min-h-[60vh] flex flex-col justify-center pt-24 sm:pt-32 border-t ${
            isDark ? "border-slate-800 bg-slate-950/70" : "border-slate-100 bg-white/70"
          } text-center mt-20 md:mt-48`}>
            <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
              <h2
                className={`${montserrat.className} text-4xl sm:text-6xl md:text-8xl tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                Start your adventure today.
              </h2>

              <div
                className={`${rajdhani.className} flex justify-center gap-6 md:gap-12 text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <span>PLAY</span>
                <span>•</span>
                <span>LEARN</span>
                <span>•</span>
                <span>BUILD</span>
              </div>

              <p
                className={`${rajdhani.className} text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Master real programming skills through games designed to make
                learning exciting.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="inline-block w-full sm:w-auto"
                >
                  <Button
                    className={`${rajdhani.className} w-full sm:w-auto text-xl font-bold px-10 py-6 bg-yellow-400 text-black hover:bg-yellow-300 transition-all rounded-2xl shadow-[0_20px_60px_rgba(250,204,21,0.4)] hover:shadow-[0_30px_80px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95 cursor-pointer`}
                  >
                    Start Learning Free
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>

      {/* ================= ASCENSION 2026 FOOTER LAYER ================= */}
      <footer className={`w-full border-t ${
        isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-950"
      } text-zinc-400 py-10 px-6 md:px-12 text-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding & Copyright */}
          <div className="flex items-center gap-3">
            <span
              className={`${montserrat.className} font-bold text-white tracking-wider`}
            >
              ASCENSION 2026
            </span>
            <span className="text-zinc-700">|</span>
            <span className={rajdhani.className}>All rights reserved.</span>
          </div>

          {/* Quick Navigation Links */}
          <div
            className={`${rajdhani.className} flex items-center gap-8 font-medium text-base`}
          >
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="#schedule"
              className="hover:text-white transition-colors"
            >
              Schedule
            </Link>
            <Link
              href="#projects"
              className="hover:text-white transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Status / Info Badge */}
          <div
            className={`${rajdhani.className} flex items-center gap-2 text-xs bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-300 tracking-wide font-medium">
              Chapter 1 Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
