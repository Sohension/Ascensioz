"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Rajdhani, Montserrat } from "next/font/google";
import Navbar from "@/components/big-components/Navbar";
import { motion } from "framer-motion";

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
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
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

  return (
    <div className="relative overflow-x-hidden bg-white text-gray-900 min-h-screen selection:bg-yellow-200 antialiased">
      <Navbar />

      <AnimatedGridPattern className="absolute inset-0 z-1 text-gray-200/65 fill-gray-100/50 opacity-70 pointer-events-none" />

      <div className="px-6 md:px-24 xl:px-28 max-w-7xl mx-auto pb-20">
        {/* ================= SECTION 1 — HERO ================= */}
        <section className="relative min-h-[90vh] flex items-center justify-start pt-28 sm:pt-36 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none opacity-25 blur-[1px]"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-5xl space-y-10 md:space-y-16"
          >
            <h1
              className={`${montserrat.className} text-5xl sm:text-6xl md:text-8xl xl:text-[110px] tracking-tight text-gray-950 leading-[1.05]`}
            >
              Learn Python <br className="hidden md:inline" />
              by playing.
            </h1>

            <p
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-medium leading-relaxed max-w-4xl tracking-wide`}
            >
              Discover a growing collection of educational games where every
              challenge teaches a real programming skill. Start your journey
              with Ascension, and explore many more adventures to come.
            </p>

            {/* PROTOTYPE NOTICE BADGE */}
            <div
              className={`${rajdhani.className} max-w-3xl rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-md px-6 py-5 shadow-sm transition-all hover:border-yellow-400/60 hover:shadow-md`}
            >
              <p className="text-lg md:text-xl font-bold text-gray-950 mb-1 flex items-center gap-2">
                🚀 <span>Welcome to Ascension 2026's first chapter.</span>
              </p>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                You are one of the first people to experience Ascension. This is
                a very early prototype, so you may come across a few bugs or
                unfinished features. Don't worry — we're improving the game with
                every update, and your feedback will help shape its future.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-2 md:pt-4 flex-wrap items-center">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg font-bold px-8 py-6 bg-yellow-400 text-black transition-all duration-200 rounded-xl tracking-wide hover:bg-yellow-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] cursor-pointer`}
                >
                  🚀 Start Learning
                </Button>
              </Link>

              <Link href="/pyron" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg font-semibold px-8 py-6 border-gray-300 text-gray-700 hover:text-gray-950 hover:border-gray-500 transition-all duration-200 bg-white/60 backdrop-blur-sm rounded-xl tracking-wide hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                >
                  🎮 Play Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ================= SECTION 2 — WHY WE EXIST ================= */}
        <FadeInSection>
          <section className="relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-20 md:mt-48">
            <div className="flex flex-col gap-10 md:gap-16 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-950 tracking-tight leading-[1.1] max-w-4xl`}
              >
                Education deserves better games.
              </h2>
              <div
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 space-y-6 md:space-y-8 font-medium tracking-wide max-w-4xl leading-relaxed`}
              >
                <p>
                  Learning programming should not mean watching hours of videos
                  or memorizing syntax.
                </p>
                <p>
                  We believe the best way to learn is by playing, experimenting,
                  and solving problems.
                </p>
                <p className="text-gray-950 font-bold text-2xl sm:text-3xl md:text-4xl pt-2 leading-tight">
                  That is why we are building a platform where every game
                  teaches real-world skills while still being genuinely fun.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 3 — LEARN THROUGH ADVENTURES ================= */}
        <FadeInSection>
          <section className="relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-20 md:mt-48">
            <div className="space-y-10 md:space-y-16 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-950 tracking-tight leading-[1.1]`}
              >
                Every game teaches something new.
              </h2>
              <p
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 max-w-5xl font-medium tracking-wide leading-relaxed`}
              >
                Today, your journey begins in Ascension, an action RPG where
                coding powers your progress. Tomorrow, you will explore entirely
                new worlds, genres, and challenges.
              </p>

              <div className="pt-4 md:pt-8">
                <h3
                  className={`${rajdhani.className} text-sm md:text-base uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold`}
                >
                  Our library will continue growing with games that teach:
                </h3>
                <div className="flex flex-wrap gap-3 md:gap-4 max-w-5xl">
                  {learningTopics.map((topic, index) => (
                    <span
                      key={index}
                      className={`${rajdhani.className} text-lg sm:text-xl font-semibold px-6 py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-800 shadow-sm transition-all hover:border-yellow-400 hover:bg-yellow-50/50 hover:scale-105 cursor-default`}
                    >
                      {topic}
                    </span>
                  ))}
                  <span
                    className={`${rajdhani.className} text-lg sm:text-xl font-semibold px-6 py-3 text-gray-400 italic flex items-center`}
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
          <section className="relative min-h-[75vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-20 md:mt-48">
            <div className="flex flex-col gap-10 md:gap-16 max-w-5xl">
              <div className="space-y-6">
                <h2
                  className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-950 tracking-tight leading-[1.1]`}
                >
                  Your progress follows you everywhere.
                </h2>
                <p
                  className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl text-gray-500 font-medium tracking-wide max-w-4xl leading-relaxed`}
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
                    className="p-8 rounded-3xl bg-white/90 border border-gray-200/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-yellow-400/50 transition-all flex flex-col justify-between min-h-36 group"
                  >
                    <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform origin-left">
                      {item.icon}
                    </span>
                    <span
                      className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-bold text-gray-900`}
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
          <section className="relative min-h-[60vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-20 md:mt-48">
            <div className="space-y-10 max-w-5xl">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gray-950 tracking-tight leading-[1.1]`}
              >
                We are just getting started.
              </h2>
              <div
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl text-gray-500 space-y-6 font-medium tracking-wide leading-relaxed`}
              >
                <p>Ascension is only the first chapter.</p>
                <p>
                  We are building a growing universe of educational games where
                  every adventure teaches a valuable skill.
                </p>
                <p className="text-gray-950 font-bold">
                  Whether you enjoy RPGs, strategy games, simulations, or
                  puzzles, there will always be a new way to learn.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 6 — FINAL CTA ================= */}
        <FadeInSection>
          <section className="relative min-h-[60vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 text-center mt-20 md:mt-48">
            <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
              <h2
                className={`${montserrat.className} text-4xl sm:text-6xl md:text-8xl text-gray-950 tracking-tight leading-tight`}
              >
                Start your adventure today.
              </h2>

              <div
                className={`${rajdhani.className} flex justify-center gap-6 md:gap-12 text-lg sm:text-xl md:text-2xl font-bold text-gray-400 tracking-[0.2em]`}
              >
                <span>PLAY</span>
                <span>•</span>
                <span>LEARN</span>
                <span>•</span>
                <span>BUILD</span>
              </div>

              <p
                className={`${rajdhani.className} text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed`}
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
                    className={`${rajdhani.className} w-full sm:w-auto text-xl font-bold px-10 py-6 bg-yellow-400 text-black hover:bg-yellow-300 transition-all rounded-xl shadow-xl hover:scale-105 active:scale-95 cursor-pointer`}
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
      <footer className="w-full border-t border-gray-200/80 bg-gray-950 text-zinc-400 py-10 px-6 md:px-12 text-sm">
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
            className={`${rajdhani.className} flex items-center gap-2 text-xs bg-gray-900 border border-white/10 px-3.5 py-1.5 rounded-full`}
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
