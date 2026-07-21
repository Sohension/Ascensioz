import { Montserrat, Rajdhani } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

import type { ReactNode } from "react";

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="bg-yellow-200 text-black px-1 rounded">{children}</span>
  );
}

export default function AscensionBlog() {
  return (
    <main
      className={`${montserrat.variable} ${rajdhani.variable} bg-[#e5e7eb] text-black min-h-screen px-6 py-16`}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <section className="space-y-4">
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ascension
          </h1>
          <p
            className="text-lg text-gray-700"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Highlight>Why I built this</Highlight> — and why it needs to exist.
          </p>
        </section>

        {/* Why I Built This */}
        <section className="space-y-4">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why I Built This
          </h2>
          <p
            className="text-gray-800 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Most platforms today are designed to <Highlight>teach</Highlight>.
            Very few are designed to <Highlight>transform</Highlight>. That gap
            is exactly why <Highlight>Ascension</Highlight> exists. I didn’t
            want to build another app where you passively consume content and
            feel productive for a few hours. I wanted something that actually{" "}
            <Highlight>pushes you</Highlight>.
          </p>
          <p
            className="text-gray-800 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Growth should feel like a{" "}
            <Highlight>game you want to play</Highlight>, not a task you have to
            complete.
          </p>
        </section>

        {/* Problems */}
        <section className="space-y-4">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Problems in Existing Platforms
          </h2>

          <ul
            className="space-y-3 text-gray-800"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <li>
              • <Highlight>Feels empty</Highlight> after progress
            </li>
            <li>
              • No sense of <Highlight>identity</Highlight>
            </li>
            <li>
              • <Highlight>Weak feedback loops</Highlight>
            </li>
            <li>
              • <Highlight>Gamification without depth</Highlight>
            </li>
          </ul>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Core Features
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Progression System</h3>
            <p
              className="text-gray-800"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Your growth is tracked like a{" "}
              <Highlight>game character</Highlight>. Skills evolve, capabilities
              improve, and your profile reflects who you are becoming.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Deep Tracking</h3>
            <p
              className="text-gray-800"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ascension builds a <Highlight>model of you</Highlight> —
              strengths, weaknesses, and patterns over time.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Game-Like Experience</h3>
            <p
              className="text-gray-800"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Instead of static dashboards, you experience{" "}
              <Highlight>progression</Highlight> and{" "}
              <Highlight>momentum</Highlight> like a real system.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="space-y-4">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Vision
          </h2>
          <p
            className="text-gray-800 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Ascension is not just a learning app, productivity tool, or game. It
            is a <Highlight>system</Highlight> where you continuously evolve
            with <Highlight>clarity</Highlight>, <Highlight>feedback</Highlight>
            , and <Highlight>challenge</Highlight>.
          </p>
          <p
            className="text-gray-800 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            The long-term goal is to create a fully{" "}
            <Highlight>immersive growth environment</Highlight> with
            personalized progression, competitive ecosystems, and deep
            integration of skill and identity.
          </p>
        </section>

        {/* Closing */}
        <section className="pt-10 border-t border-gray-400">
          <p
            className="text-gray-600 italic"
            style={{ fontFamily: "var(--font-body)" }}
          >
            This is not about doing more. It’s about{" "}
            <Highlight>becoming more</Highlight>.
          </p>
        </section>
      </div>
    </main>
  );
}
