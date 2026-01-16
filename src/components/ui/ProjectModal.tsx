"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, MediaItem } from "@/lib/supabase/types";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/utils";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

interface MediaGalleryProps {
  media: MediaItem[];
}

function MediaGallery({ media }: MediaGalleryProps) {
  if (media.length === 0) return null;

  return (
    <div className="flex flex-col">
      {media.map((item, index) => (
        <div key={index} className="relative w-full">
          {item.type === "image" ? (
            <Image
              src={item.src}
              alt={item.alt || `Project image ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              sizes="100vw"
              priority={index === 0}
            />
          ) : (
            <div className="relative w-full aspect-video">
              <iframe
                src={getVideoEmbedUrl(item.src)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={item.alt || `Video ${index + 1}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: ProjectModalProps) {
  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowLeft" && hasPrev && onPrev) {
        onPrev();
      }
      if (e.key === "ArrowRight" && hasNext && onNext) {
        onNext();
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
  }, [project, onClose, onPrev, onNext, hasPrev, hasNext]);

  // 카테고리 라벨 변환
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      web: "WEB",
      "ai-video": "AI VIDEO",
      etc: "ETC",
    };
    return labels[category] || category.toUpperCase();
  };

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
          {/* Backdrop - 블러 배경 */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="h-full max-h-[90vh] overflow-y-auto pb-16">
              {/* Header - 프로젝트 정보 */}
              <div className="sticky top-0 z-10 bg-background px-6 md:px-12 py-6 border-b border-pastel-lavender/30">
                {/* 카테고리 */}
                <span className="text-sm font-semibold bg text-pastel-lavender uppercase tracking-wide">
                  {getCategoryLabel(project.category[0])}
                </span>

                {/* 제목 */}
                <h2 className="text-2xl md:text-4xl font-bold text-text-primary mt-2">
                  {project.title}
                </h2>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-pastel-pink/30 text-text-primary rounded-full uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 날짜 */}
                <span className="text-sm text-text-muted font-mono mt-2 block">
                  {project.date}
                </span>

                {/* 닫기 버튼 */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-text-primary/10 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-text-primary" />
                </button>
              </div>

              {/* Media Gallery - 전체 너비 이미지 */}
              <MediaGallery key={project.id} media={project.media} />

              {/* Description - 작업 노트 */}
              <div className="px-6 md:px-12 py-8 border-t border-pastel-lavender/30">
                <p className="text-text-muted text-sm mb-2">[작업 노트]</p>
                <p className="text-text-secondary leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Bottom Navigation - 모달 내부 고정 */}
            <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-pastel-lavender/30 px-6 md:px-12 py-4 flex justify-between z-20">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-pastel-lavender disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full border border-pastel-lavender/50 hover:border-pastel-lavender"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">PREV</span>
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-pastel-lavender disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full border border-pastel-lavender/50 hover:border-pastel-lavender"
              >
                <span className="text-sm font-medium">NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
