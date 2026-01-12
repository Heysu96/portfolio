"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

const navItems = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOutCubic }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-6"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group" onClick={closeMenu}>
          <motion.span
            className="text-xl md:text-2xl font-bold text-text-primary tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            HS Studio
          </motion.span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>{item.label}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pastel-pink rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden relative">
          <button
            onClick={toggleMenu}
            className="relative w-8 h-8 flex flex-col items-center justify-center"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
              className="absolute w-6 h-0.5 bg-text-primary rounded-full"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="absolute w-6 h-0.5 bg-text-primary rounded-full"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
              className="absolute w-6 h-0.5 bg-text-primary rounded-full"
              transition={{ duration: 0.3 }}
            />
          </button>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: easeOutCubic }}
                className="absolute right-0 top-12 min-w-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-pastel-lavender/20 overflow-hidden"
              >
                <ul className="py-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`block px-5 py-3 text-base font-medium transition-colors ${
                          pathname === item.href
                            ? "text-pastel-pink bg-pastel-pink/10"
                            : "text-text-secondary hover:text-text-primary hover:bg-pastel-blue/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}
