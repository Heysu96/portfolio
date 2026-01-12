"use client";

import { motion } from "framer-motion";
import GridBackground from "./GridBackground";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;
const easeInOutCubic = [0.42, 0, 0.58, 1] as const;

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: easeOutCubic,
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

export default function HeroSection() {
  const title = "HS Studio";
  const subtitle = "Creative Designer";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBackground />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        {/* Main Logo/Title */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary tracking-tight mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              custom={i}
              className="inline-block"
              style={{ marginRight: char === " " ? "0.3em" : "0" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-text-secondary font-light tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: easeOutCubic }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          className="mt-12 mx-auto w-24 h-1 bg-linear-to-r from-pastel-pink via-pastel-lavender to-pastel-blue rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: easeOutCubic }}
        />

        {/* Tagline */}
        <motion.p
          className="mt-8 text-base md:text-lg text-text-muted max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Crafting beautiful digital experiences through design
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-text-muted cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: easeInOutCubic }}
        >
          <span className="text-sm tracking-wider">scroll to explore</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
