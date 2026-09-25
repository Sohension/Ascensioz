"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Rajdhani, Bebas_Neue } from "next/font/google";
import Navbar from "@/components/big-components/Navbar";
import { motion } from "framer-motion";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
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
  right,
}: {
  size: number;
  color: string;
  delay: number;
  top?: string;
  left?: string;
  right?: string;
}) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
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

  const heroTypewriterPhrases = [
    "Level up your code. Leave the rest behind.",
    "Build skills that matter. Leave the rest behind.",
    "Master programming. Leave the rest behind.",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fullText = heroTypewriterPhrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex(
            (prev) => (prev + 1) % heroTypewriterPhrases.length,
          );
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  const handleStartNow = (): void => {
    window.location.hash = "start";
  };

  const handlePlayDemo = (): void => {
    window.location.hash = "demo";
  };

  return (
    <div
      className={`relative min-h-dvh overflow-x-hidden antialiased [background:radial-gradient(50%_50%_at_59%_55%,rgba(0,0,0,0.3)_36%,rgba(44,44,44,0.3)_100%),linear-gradient(0deg,rgba(11,15,20,1)_0%,rgba(11,15,20,1)_100%)] text-slate-100`}
    >
      {/* Original Navbar retained safely */}
      <Navbar />

      {/* Atmospheric Background Layers + Local Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* ================= LOCAL WEBM VIDEO BACKGROUND ================= */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-0 top-0 h-[min(100dvh,1024px)] w-full object-cover opacity-25"
        >
          <source src="/shopwebm.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        {/* =============================================================== */}

        <div className="absolute top-[476px] left-0 w-full h-[548px] bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_46%,rgba(255,187,0,0.08)_100%)]" />

        <FloatingOrb size={300} color="#3b82f6" delay={0} top="10%" left="5%" />
        <FloatingOrb
          size={250}
          color="#ffbb00"
          delay={2}
          top="60%"
          right="10%"
        />

        <AnimatedGridPattern className="absolute inset-0 text-slate-700/20 opacity-40 pointer-events-none" />
      </div>

      <div className="px-6 md:px-24 xl:px-28 max-w-7xl mx-auto pb-20 relative z-10">
        {/* ================= SECTION 1 — HERO (CENTER ALIGNED) ================= */}
        <section className="relative flex min-h-[78dvh] items-center justify-center overflow-hidden pt-24 text-center sm:min-h-[85dvh] sm:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20 max-w-5xl mx-auto flex flex-col items-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative flex min-h-[180px] w-full flex-col items-center justify-center sm:min-h-[200px]"
            >
              <p
                className={`${rajdhani.className} mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#ffbb00] sm:text-sm`}
              >
                Ascensioz Learning Platform
              </p>
              <h1
                className={`${bebasNeue.className} relative max-w-5xl text-5xl leading-[1.05] tracking-[-1px] text-white sm:text-7xl md:text-[clamp(4.5rem,8vw,6.1rem)] md:leading-[1.04]`}
              >
                <span>{currentText}</span>
                <span className="ml-1 inline-block h-[0.8em] w-2 bg-[#ffbb00] align-middle animate-pulse" />
              </h1>
            </motion.div>

            {/* ACTION BUTTONS (CENTER ALIGNED & SMALLER FOR SPACING) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="flex gap-4 pt-2 flex-wrap items-center justify-center w-full"
            >
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button
                  id="start"
                  type="button"
                  onClick={handleStartNow}
                  className={`${rajdhani.className} w-full sm:w-auto bg-[#ffbb00] shadow-[0px_0px_200px_#ffae0088] inline-flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-[10px] text-[#0b0f14] text-xl sm:text-2xl font-semibold text-center tracking-[0] leading-[normal] hover:scale-105 transition-transform cursor-pointer`}
                >
                  Start now
                </button>
              </Link>

              <Link href="/pyron" className="w-full sm:w-auto">
                <button
                  id="demo"
                  type="button"
                  onClick={handlePlayDemo}
                  className={`${rajdhani.className} w-full sm:w-auto bg-[#69696980] inline-flex items-center justify-center gap-2.5 px-8 py-2.5 rounded-[10px] text-white text-xl sm:text-2xl font-semibold text-center tracking-[0] leading-[normal] hover:bg-[#696969] transition-colors cursor-pointer`}
                >
                  Play demo
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= SECTION 2 — WHY WE EXIST ================= */}
        <FadeInSection>
          <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-24 text-center sm:pt-32 border-t border-slate-800 mt-20 md:mt-48">
            <div className="flex max-w-5xl flex-col items-center gap-10 md:gap-16">
              <h2
                className={`${bebasNeue.className} text-4xl sm:text-6xl md:text-7xl tracking-wide text-white`}
              >
                Education deserves better games.
              </h2>
              <div
                className={`${rajdhani.className} max-w-4xl space-y-6 text-xl font-medium leading-relaxed tracking-wide text-slate-400 sm:text-2xl md:text-3xl`}
              >
                <p>
                  Learning programming should not mean watching hours of videos
                  or memorizing syntax.
                </p>
                <p>
                  We believe the best way to learn is by playing, experimenting,
                  and solving problems.
                </p>
                <p className="font-bold text-2xl sm:text-3xl text-white pt-2">
                  That is why we are building a platform where every game
                  teaches real-world skills while still being genuinely fun.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 3 — LEARN THROUGH ADVENTURES ================= */}
        <FadeInSection>
          <section className="relative min-h-[75vh] flex flex-col items-center justify-center rounded-2xl border-t border-slate-800 bg-slate-950/70 px-4 pt-24 text-center sm:pt-32 mt-20 md:mt-48">
            <div className="max-w-5xl space-y-10 md:space-y-16">
              <h2
                className={`${bebasNeue.className} text-4xl sm:text-6xl md:text-7xl tracking-wide text-white`}
              >
                Every game teaches something new.
              </h2>
              <p
                className={`${rajdhani.className} mx-auto max-w-5xl text-xl font-medium leading-relaxed tracking-wide text-slate-400 sm:text-2xl md:text-3xl`}
              >
                Today, your journey begins in Ascensioz, an action RPG where
                coding powers your progress. Tomorrow, you will explore entirely
                new worlds, genres, and challenges.
              </p>

              <div className="pt-4">
                <h3
                  className={`${rajdhani.className} text-sm uppercase tracking-[0.2em] mb-6 font-bold text-slate-500`}
                >
                  Our library will continue growing with games that teach:
                </h3>
                <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3 md:gap-4">
                  {learningTopics.map((topic, index) => (
                    <span
                      key={index}
                      className={`${rajdhani.className} text-lg sm:text-xl font-semibold px-6 py-3 rounded-full border border-slate-700 bg-slate-900 text-slate-200 hover:border-[#ffbb00] transition-all`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 4 — PROGRESSION ================= */}
        <FadeInSection>
          <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-24 text-center sm:pt-32 border-t border-slate-800 mt-20 md:mt-48">
            <div className="flex max-w-5xl flex-col items-center gap-10 md:gap-16">
              <div className="space-y-6">
                <h2
                  className={`${bebasNeue.className} text-4xl sm:text-6xl md:text-7xl tracking-wide text-white`}
                >
                  Your progress follows you everywhere.
                </h2>
                <p
                  className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-medium tracking-wide max-w-4xl text-slate-400`}
                >
                  Every game you play contributes to your overall learning
                  journey, creating one connected experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "Earn XP", icon: "✨" },
                  { title: "Unlock achievements", icon: "🏆" },
                  { title: "Complete quests", icon: "🗺️" },
                  { title: "Climb global leaderboard", icon: "👑" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-between rounded-3xl border border-slate-700/70 bg-slate-900/80 p-8 text-center transition-all hover:border-[#ffbb00]/60"
                  >
                    <span className="text-4xl block mb-4">{item.icon}</span>
                    <span
                      className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-bold text-slate-100`}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ================= SECTION 5 — FINAL CTA ================= */}
        <FadeInSection>
          <section className="relative min-h-[60vh] flex flex-col justify-center pt-24 sm:pt-32 border-t border-slate-800 text-center mt-20 md:mt-48">
            <div className="max-w-5xl mx-auto space-y-10">
              <h2
                className={`${bebasNeue.className} text-5xl sm:text-7xl md:text-8xl tracking-wide text-white`}
              >
                Start your adventure today.
              </h2>
              <p
                className={`${rajdhani.className} text-xl sm:text-2xl max-w-2xl mx-auto font-medium text-slate-400`}
              >
                Master real programming skills through games designed to make
                learning exciting.
              </p>
              <div className="pt-2">
                <Link href="/auth/login" className="inline-block">
                  <button
                    onClick={handleStartNow}
                    className={`${rajdhani.className} bg-[#ffbb00] shadow-[0px_0px_250px_#ffae0099] inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-[10px] text-[#0b0f14] text-3xl sm:text-4xl font-medium text-center hover:scale-105 transition-transform cursor-pointer`}
                  >
                    Start Learning Free
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800 bg-[#0b0f14] px-6 py-10 text-center text-sm text-zinc-400 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`${rajdhani.className} font-bold text-white tracking-wider text-lg`}
            >
              ASCENSIOZ 2026
            </span>
            <span className="text-zinc-700">|</span>
            <span className={rajdhani.className}>All rights reserved.</span>
          </div>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
