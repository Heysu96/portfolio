"use client";

import { motion, type Variants } from "framer-motion";

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
                Vision
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-text-primary leading-tight"
            >
              Create designs that<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-blue">
                inspire and connect
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-text-secondary leading-relaxed"
            >
              Design is more than aesthetics—it&apos;s about creating meaningful
              connections between people and products.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-6 pt-4">
              <p className="text-text-secondary leading-relaxed">
                I specialize in crafting digital experiences that are both beautiful
                and functional. From web applications to AI-powered video content,
                I bring a unique blend of creativity and technical expertise to every
                project.
              </p>
              <p className="text-text-secondary leading-relaxed">
                With a keen eye for detail and a passion for innovation, I help brands
                tell their stories through thoughtful design that resonates with their
                audience.
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
                Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "UI/UX Design",
                  "Web Design",
                  "App Design",
                  "AI Video",
                  "Motion Graphics",
                  "Branding",
                  "Figma",
                  "Adobe Suite",
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
                  { year: "2023 - Present", role: "Senior Designer", company: "HK Studio" },
                  { year: "2021 - 2023", role: "UI/UX Designer", company: "Creative Agency" },
                  { year: "2019 - 2021", role: "Junior Designer", company: "Design Lab" },
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
              Let&apos;s work together
            </h2>
            <p className="mt-4 text-text-secondary">
              Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something amazing together.
            </p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <a
                href="mailto:hello@hkstudio.design"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pastel-pink to-pastel-lavender text-text-primary font-medium rounded-full hover:shadow-lg hover:shadow-pastel-pink/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@hkstudio.design
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="mt-10 flex items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {[
                { name: "Instagram", href: "#" },
                { name: "Dribbble", href: "#" },
                { name: "Behance", href: "#" },
                { name: "LinkedIn", href: "#" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
