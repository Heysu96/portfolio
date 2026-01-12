"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, MediaItem } from "@/lib/data";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getGoogleDriveEmbedUrl } from "@/lib/utils";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

interface MediaGalleryProps {
  media: MediaItem[];
  projectId: string;
}

function MediaGallery({ media, projectId }: MediaGalleryProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  }, [media.length]);

  const handleNext = useCallback(() => {
    setCurrentMediaIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  }, [media.length]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      }
      if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (media.length === 0) return null;

  const currentMedia = media[currentMediaIndex];

  return (
    <div className="relative aspect-video bg-linear-to-br from-pastel-pink/30 via-pastel-lavender/30 to-pastel-blue/30">
      {currentMedia.type === "image" ? (
        <div className="relative w-full h-full">
          <Image
            src={currentMedia.src}
            alt={currentMedia.alt || "Project image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 896px"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Placeholder for missing images */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/30">
              {projectId.padStart(2, "0")}
            </span>
          </div>
        </div>
      ) : (
        <iframe
          src={getGoogleDriveEmbedUrl(currentMedia.src)}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={currentMedia.alt || "Video"}
        />
      )}

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
            aria-label="Previous media"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
            aria-label="Next media"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </>
      )}

      {/* Media Indicators */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentMediaIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOutCubic }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop - 클릭 시 모달 닫기 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: easeOutCubic }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              {/* Media Gallery - key prop resets state when project changes */}
              <MediaGallery
                key={project.id}
                media={project.media}
                projectId={project.id}
              />

              {/* Project Info */}
              <div className="p-6 md:p-8">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tags and Date */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-pastel-lavender rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-text-muted font-mono">
                    {project.date}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
