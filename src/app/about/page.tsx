"use client";

import { motion, type Variants } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutCubic },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 relative">
      {/* Plus Pattern Background */}
      <div className="absolute inset-0 plus-pattern opacity-40" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background-secondary/30" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Main Title */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary tracking-tight mb-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: easeOutCubic }}
        >
          About
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column - Vision */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <span className="text-sm font-medium text-pastel-lavender tracking-wider uppercase">
                About Me
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary leading-tight"
            >
              디자인과 AI로<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue">
                새로운 가치를 만듭니다
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-text-secondary leading-relaxed"
            >
              8년 이상의 경력을 바탕으로 UI/UX 디자인부터 AI 영상 제작까지,
              다양한 디지털 콘텐츠를 기획하고 제작합니다.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-6 pt-4">
              <p className="text-text-secondary leading-relaxed">
                웹/앱 랜딩페이지, 상세페이지 제작부터 프로모션 콘텐츠, 배너 디자인까지
                전반적인 웹 디자인 업무를 담당하고 있습니다. Figma, Photoshop, Illustrator 등
                다양한 툴을 활용하여 효율적인 디자인 워크플로우를 구축합니다.
              </p>
              <p className="text-text-secondary leading-relaxed">
                최근에는 AI 기술을 활용한 이미지 생성 및 영상 제작에 집중하고 있습니다.
                Sora, Kling AI, Hailuo AI 등을 활용한 FOOH 스타일 콘텐츠 제작과
                프롬프트 엔지니어링을 통해 창의적인 AI 콘텐츠를 만들어내고 있습니다.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Skills & Experience */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Skills */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "AI 영상제작",
                  "영상편집",
                  "웹디자인",
                  "UI/UX",
                  "Photoshop",
                  "Illustrator",
                  "Figma",
                  "브랜딩",
                  "배너디자인",
                  "CapCut",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-medium text-text-secondary bg-pastel-blue/20 rounded-full border border-pastel-blue/30 hover:bg-pastel-blue/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                Experience
              </h3>
              <div className="space-y-4">
                {[
                  { year: "2024.08 - 현재", role: "BX팀 대리", company: "㈜삼육오엠씨" },
                  { year: "2021.05 - 2024.07", role: "온라인마케팅팀 대리", company: "휴그린" },
                  { year: "2020.01 - 2021.04", role: "온라인팀 주임", company: "휴빛조명" },
                  { year: "2017.02 - 2019.07", role: "디자인개발팀 대리", company: "㈜예도전기조명" },
                ].map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-pastel-lavender/20 hover:border-pastel-lavender/40 transition-colors"
                  >
                    <span className="text-sm text-text-muted font-mono whitespace-nowrap">
                      {exp.year}
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">{exp.role}</p>
                      <p className="text-sm text-text-secondary">{exp.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="mt-32 pt-16 border-t border-pastel-lavender/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-medium text-pastel-pink tracking-wider uppercase">
              Contact
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-text-primary">
              함께 작업해요
            </h2>
            <p className="mt-4 text-text-secondary">
              프로젝트에 대한 문의나 협업 제안이 있으시다면 언제든지 연락해 주세요.
            </p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText("hs961102@gmail.com");
                  toast.success("복사가 완료되었습니다.");
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pastel-pink to-pastel-lavender text-text-primary font-medium rounded-full hover:shadow-lg hover:shadow-pastel-pink/30 transition-all duration-300 cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                hs961102@gmail.com
              </button>
            </motion.div>

            {/* Education */}
            <motion.div
              className="mt-10 text-text-secondary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-sm">
                ⓒ 2026. 저작권자 All Rights Reserved.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
