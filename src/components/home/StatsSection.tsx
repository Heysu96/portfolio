"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatsSectionProps {
  projectCount: number;
}

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection({ projectCount }: StatsSectionProps) {
  const stats = [
    { value: projectCount, suffix: "+", label: "Projects", icon: "📁" },
    { value: 8, suffix: "+", label: "Years Experience", icon: "⏳" },
    { value: 20, suffix: "+", label: "Available Tools", icon: "🛠️" },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/20 via-background to-background-secondary/20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: easeOutCubic,
              }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15 + 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-4xl mb-4"
              >
                {stat.icon}
              </motion.div>

              {/* Number */}
              <div className="text-5xl md:text-6xl font-bold text-text-primary mb-2">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p className="text-text-secondary font-medium">{stat.label}</p>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
                className="mt-4 mx-auto w-12 h-0.5 bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
