"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

// Get first 3 projects
const featuredProjects = projects.slice(0, 3);

export default function FeaturedWorks() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Plus Pattern Background */}
      <div className="absolute inset-0 plus-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutCubic }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-pastel-lavender tracking-wider uppercase mb-4">
            Featured Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Recent Projects
          </h2>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: easeOutCubic,
              }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-pastel-pink/30 via-pastel-lavender/30 to-pastel-blue/30 mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white/30">
                    {project.id.padStart(2, "0")}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-5 py-2 bg-white/95 text-text-primary text-sm font-medium rounded-full">
                    View
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-pastel-lavender font-medium"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-pastel-pink transition-colors">
                  {project.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: easeOutCubic }}
          className="text-center mt-12"
        >
          <Link
            href="/works"
            className="inline-flex items-center gap-2 px-8 py-4 text-text-primary font-medium border border-text-muted/30 rounded-full hover:bg-pastel-lavender/20 hover:border-pastel-lavender transition-all duration-300"
          >
            View All Works
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
