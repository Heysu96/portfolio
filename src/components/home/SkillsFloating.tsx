"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "UI/UX Design", color: "bg-pastel-pink/40 border-pastel-pink/60" },
  { name: "Web Design", color: "bg-pastel-blue/40 border-pastel-blue/60" },
  { name: "App Design", color: "bg-pastel-mint/40 border-pastel-mint/60" },
  { name: "AI Video", color: "bg-pastel-lavender/40 border-pastel-lavender/60" },
  { name: "Branding", color: "bg-pastel-peach/40 border-pastel-peach/60" },
  { name: "Motion Graphics", color: "bg-pastel-pink/40 border-pastel-pink/60" },
  { name: "Figma", color: "bg-pastel-blue/40 border-pastel-blue/60" },
  { name: "Illustration", color: "bg-pastel-lavender/40 border-pastel-lavender/60" },
];

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

export default function SkillsFloating() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Plus Pattern Background */}
      <div className="absolute inset-0 plus-pattern opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutCubic }}
          className="text-center text-sm font-medium text-pastel-lavender tracking-wider uppercase mb-12"
        >
          What I Do
        </motion.p>

        {/* Skills Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: easeOutCubic,
              }}
              whileHover={{
                scale: 1.08,
                y: -5,
                transition: { duration: 0.2 },
              }}
              className={`px-6 py-3 md:px-8 md:py-4 rounded-full border backdrop-blur-sm cursor-default ${skill.color}`}
            >
              <span className="text-sm md:text-base font-medium text-text-primary">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
