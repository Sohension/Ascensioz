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
    <div className="relative overflow-x-hidden bg-white text-gray-900 min-h-screen selection:bg-gray-100 antialiased">
      <Navbar />

      <AnimatedGridPattern className="absolute inset-0 z-1 text-gray-200 fill-gray-100/30 opacity-70" />

      <div className="px-6 md:px-24 xl:px-25 max-w-7xl mx-auto pb-48 md:pb-96">
        {/* ================= SECTION 1 — HERO ================= */}

        <section className="relative min-h-screen flex items-center justify-start pt-24 sm:pt-32 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none opacity-40"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 max-w-5xl space-y-12 md:space-y-24"
          >
            <h1
              className={`${montserrat.className} text-5xl sm:text-6xl md:text-8xl xl:text-[115px] tracking-tight text-gray-950 leading-[1.1] md:leading-[1.02]`}
            >
              Learn Python <br className="hidden md:inline" />
              by playing.
            </h1>

            <p
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-400 font-medium leading-normal md:leading-[1.6] max-w-4xl tracking-wide`}
            >
              Discover a growing collection of educational games where every
              challenge teaches a real programming skill. Start your journey
              with Ascension, and explore many more adventures to come.
            </p>

            {/* FIRST USER / PROTOTYPE MESSAGE */}

            <div
              className={`${rajdhani.className} max-w-3xl rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md px-6 py-5 shadow-sm`}
            >
              <p className="text-lg md:text-xl font-bold text-gray-950 mb-2">
                🚀 Welcome to Ascensions first chapter.
              </p>

              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                You are one of the first people to experience Ascension. This is
                a very early prototype, so you may come across a few bugs or
                unfinished features. Dont worry — were improving the game with
                every update, and your feedback will help shape its future.
              </p>
            </div>

            <div className="flex gap-4 pt-4 md:pt-6 flex-wrap items-center">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg px-8 md:px-6 py-6 md:py-3 shadow-xl text-black transition-all rounded-xl tracking-wide hover:cursor-pointer`}
                >
                  🚀 Start Learning
                </Button>
              </Link>

              <Link href="/pyron" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-lg px-8 md:px-6 py-6 md:py-3 border-gray-200 text-gray-500 hover:text-gray-950 hover:border-gray-400 transition-all bg-white/40 backdrop-blur-sm rounded-xl tracking-wide hover:cursor-pointer`}
                >
                  🎮 Play Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ================= SECTION 2 — WHY WE EXIST ================= */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-24 md:mt-72 lg:mt-87.5">
          <div className="flex flex-col gap-12 md:gap-24 max-w-5xl">
            <h2
              className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-950 tracking-tight leading-[1.1] max-w-4xl`}
            >
              Education deserves better games.
            </h2>
            <div
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 space-y-6 md:space-y-10 font-medium tracking-wide max-w-4xl leading-relaxed`}
            >
              <p>
                Learning programming should not mean watching hours of videos or
                memorizing syntax.
              </p>
              <p>
                We believe the best way to learn is by playing, experimenting,
                and solving problems.
              </p>
              <p className="text-gray-950 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl pt-4 md:pt-6 leading-tight">
                That is why we are building a platform where every game teaches
                real-world skills while still being genuinely fun.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3 — LEARN THROUGH ADVENTURES ================= */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-24 md:mt-72 lg:mt-87.5">
          <div className="space-y-12 md:space-y-24 max-w-5xl">
            <h2
              className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-950 tracking-tight leading-[1.1]`}
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

            <div className="pt-6 md:pt-12">
              <h3
                className={`${rajdhani.className} text-sm md:text-base uppercase tracking-[0.2em] text-gray-400 mb-6 md:mb-10 font-bold`}
              >
                Our library will continue growing with games that teach:
              </h3>
              <div className="flex flex-wrap gap-4 md:gap-6 max-w-5xl">
                {learningTopics.map((topic, index) => (
                  <span
                    key={index}
                    className={`${rajdhani.className} text-lg sm:text-xl md:text-2xl font-semibold px-6 md:px-8 py-3 md:py-4 rounded-full bg-gray-50 border border-gray-200 text-gray-700 shadow-sm`}
                  >
                    {topic}
                  </span>
                ))}
                <span
                  className={`${rajdhani.className} text-lg sm:text-xl md:text-2xl font-semibold px-6 md:px-8 py-3 md:py-4 text-gray-400 italic flex items-center`}
                >
                  And much more...
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4 — ONE ACCOUNT. ENDLESS LEARNING. ================= */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-24 md:mt-72 lg:mt-87.5">
          <div className="flex flex-col gap-12 md:gap-28 max-w-5xl">
            <div className="space-y-6 md:space-y-10">
              <h2
                className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-950 tracking-tight leading-[1.1]`}
              >
                Your progress follows you everywhere.
              </h2>
              <p
                className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 font-medium tracking-wide max-w-4xl leading-relaxed`}
              >
                Every game you play contributes to your overall learning
                journey, creating one connected experience across the entire
                platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-4 md:pt-8 max-w-5xl">
              {[
                { title: "Earn XP", icon: "✨" },
                { title: "Unlock achievements", icon: "🏆" },
                { title: "Complete quests", icon: "🗺️" },
                { title: "Climb global leaderboard", icon: "👑" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 md:p-10 rounded-3xl bg-white/60 border border-gray-200/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-40 md:min-h-45"
                >
                  <span className="text-4xl md:text-5xl block mb-4 md:mb-6">
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

        {/* ================= SECTION 5 — THE FUTURE ================= */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 mt-24 md:mt-72 lg:mt-87.5">
          <div className="space-y-12 md:space-y-24 max-w-5xl">
            <h2
              className={`${montserrat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-950 tracking-tight leading-[1.1]`}
            >
              We are just getting started.
            </h2>
            <div
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-500 space-y-6 md:space-y-10 font-medium tracking-wide leading-relaxed`}
            >
              <p>Ascension is only the first chapter.</p>
              <p>
                We are building a growing universe of educational games where
                every adventure teaches a valuable skill.
              </p>
              <p className="text-gray-950 font-bold">
                Whether you enjoy RPGs, strategy games, simulations, or puzzles,
                there will always be a new way to learn.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6 — FINAL CTA ================= */}
        <section className="relative min-h-screen flex flex-col justify-center pt-24 sm:pt-32 border-t border-gray-100 text-center mt-24 md:mt-72 lg:mt-87.5">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-24">
            <h2
              className={`${montserrat.className} text-4xl sm:text-6xl md:text-8xl xl:text-[100px] text-gray-950 tracking-tight leading-tight md:leading-none`}
            >
              Start your adventure today.
            </h2>

            <div
              className={`${rajdhani.className} flex justify-center gap-6 md:gap-12 text-lg sm:text-xl md:text-3xl font-bold text-gray-300 tracking-[0.2em] md:tracking-[0.3em]`}
            >
              <span className="text-gray-400">PLAY</span>
              <span>•</span>
              <span className="text-gray-400">LEARN</span>
              <span>•</span>
              <span className="text-gray-400">BUILD</span>
            </div>

            <p
              className={`${rajdhani.className} text-lg sm:text-xl md:text-3xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed`}
            >
              Master real programming skills through games designed to make
              learning exciting.
            </p>

            <div className="pt-4 md:pt-6">
              <Link
                href="/auth/register"
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  className={`${rajdhani.className} w-full sm:w-auto text-xl md:text-xl px-8 md:px-10 py-6 md:py-4 bg-gray-950 text-black hover:bg-gray-800 transition-all font-bold tracking-wide rounded-2xl shadow-2xl hover:cursor-pointer shadow-gray-950/10`}
                >
                  Start Learning Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
