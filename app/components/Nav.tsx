"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        style={{ borderBottomColor: `rgba(36,36,36,${borderOpacity.get()})` }}
        className="flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-transparent"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest uppercase text-[--color-text-primary]"
        >
          Chirayu Arya
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:hello@chirayuarya.com"
            className="text-sm px-4 py-2 border border-[--color-surface-3] rounded-full text-[--color-text-secondary] hover:text-[--color-text-primary] hover:border-[--color-surface-3] transition-colors cursor-pointer"
          >
            Say hello
          </a>
        </nav>
      </motion.div>
    </motion.header>
  );
}
