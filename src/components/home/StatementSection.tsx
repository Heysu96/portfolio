"use client";

import { motion } from "framer-motion";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

const lines = [
  "Design is",
  "not just what it looks like,",
  "but how it feels.",
];

export default function StatementSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/30 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center">
          {lines.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: easeOutCubic,
              }}
              className={`text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight ${
                index === 2
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue"
                  : "text-text-primary"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Decorative element */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: easeOutCubic }}
          className="mt-12 mx-auto w-32 h-1 bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue rounded-full origin-center"
        />
      </div>
    </section>
  );
}
