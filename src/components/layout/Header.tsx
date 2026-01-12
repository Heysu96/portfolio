"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const easeOutCubic = [0.25, 0.46, 0.45, 0.94] as const;

const navItems = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOutCubic }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-6"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <motion.span
            className="text-xl md:text-2xl font-bold text-text-primary tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            HK Studio
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 md:gap-12">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative text-sm md:text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
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

        {/* Contact Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/about#contact"
            className="hidden md:inline-flex px-5 py-2.5 text-sm font-medium text-text-primary border border-text-muted/30 rounded-full hover:bg-pastel-lavender/30 hover:border-pastel-lavender transition-all duration-300"
          >
            Contact
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
