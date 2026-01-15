"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { categories, projects, type Category, type Project } from "@/lib/data";
import ProjectModal from "@/components/ui/ProjectModal";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

export default function WorksPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category.includes(activeCategory));

  const selectedProject =
    selectedProjectIndex !== null ? filteredProjects[selectedProjectIndex] : null;

  const handlePrev = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex > 0) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex < filteredProjects.length - 1) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative">
      {/* Plus Pattern Background */}
      <div className="absolute inset-0 plus-pattern opacity-40" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background-secondary/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Main Title */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary tracking-tight mb-16"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: easeOutCubic }}
        >
          Works
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Sidebar - Filter */}
          <motion.aside
            className="lg:w-56 shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <nav className="lg:sticky lg:top-32 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                    activeCategory === category.key
                      ? "bg-pastel-lavender/30 text-text-primary font-medium"
                      : "text-text-secondary hover:text-text-primary hover:bg-pastel-blue/10"
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`text-sm font-mono ${
                      activeCategory === category.key
                        ? "text-pastel-pink"
                        : "text-text-muted"
                    }`}
                  >
                    [{category.count.toString().padStart(2, "0")}]
                  </span>
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Right Content - Project Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid md:grid-cols-2 gap-8"
              >
                {filteredProjects.map((project) => (
                  <motion.article
                    key={project.id}
                    variants={itemVariants}
                    layout
                    className="group cursor-pointer"
                    onClick={() => setSelectedProjectIndex(filteredProjects.indexOf(project))}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-pastel-pink/30 via-pastel-lavender/30 to-pastel-blue/30 mb-4">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* View button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-6 py-2 bg-white/90 text-text-primary text-sm font-medium rounded-full">
                          View Project
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-mono">
                          {project.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary group-hover:text-pastel-pink transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-text-secondary">
                  No projects found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProjectIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={selectedProjectIndex !== null && selectedProjectIndex > 0}
        hasNext={selectedProjectIndex !== null && selectedProjectIndex < filteredProjects.length - 1}
      />
    </div>
  );
}
