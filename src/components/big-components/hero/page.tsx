"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Rajdhani, Montserrat } from "next/font/google";
import Navbar from "@/components/big-components/Navbar";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";


const rajdhani = Rajdhani({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: "800", subsets: ["latin"] });

export default function Hero() {
  const { scrollY } = useScroll();

  // 👇 Background moves slower
  const yImage = useTransform(scrollY, [0, 500], [0, 80]);

  // 👇 Text moves faster
  const yText = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-screen overflow-hidden flex items-center">
        {/* 🔵 TEXT CONTENT */}
        <motion.div
          style={{ y: yText }}
          className="relative z-10 px-6 md:px-16 max-w-3xl"
        >
          <h1 className={`${montserrat.className} text-4xl md:text-7xl`}>
            Learn ML For real.
          </h1>

          <h2 className={`${rajdhani.className} text-lg md:text-2xl mt-4`}>
            Built for beginners and devs who want to truly understand models —
            not just use them.
          </h2>

          <div className="flex gap-6 mt-8 flex-wrap">
            <Link href="/auth/login">
              <Button
                variant="secondary"
                className={`${rajdhani.className} text-lg md:text-2xl hover:cursor-pointer`}
              >
                Start now
              </Button>
            </Link>

            <Link href="/demo">
              <Button
                className={`${rajdhani.className} text-lg md:text-2xl hover:cursor-pointer text-gray-600`}
              >
                Play Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* FEATURES SECTION */}

      <div className="">
        <h1>Learn by playing. Master by doing.</h1>
        <h2>
          No lectures. No passive learning. Just real understanding through
          action.
        </h2>
      </div>

      {/* 🔵 GRID BACKGROUND */}
      <AnimatedGridPattern className="absolute inset-0 -z-20" />
    </div>
  );
}
