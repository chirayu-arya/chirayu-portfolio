"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Twitter / X", href: "#" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="contact" className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Big CTA */}
        <div ref={ref} className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.25em] uppercase text-[--color-brand] mb-6 block"
          >
            Let's talk
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight mb-10"
          >
            Have a project
            <br />
            <span className="text-[--color-text-secondary]">in mind?</span>
          </motion.h2>

          <motion.a
            href="mailto:hello@chirayuarya.com"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 bg-[--color-brand] text-black font-semibold rounded-full text-lg cursor-pointer"
          >
            hello@chirayuarya.com
          </motion.a>
        </div>

        {/* Footer row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[--color-surface-2] pt-10"
        >
          <span className="text-sm text-[--color-text-muted]">
            © {new Date().getFullYear()} Chirayu Arya. All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors cursor-pointer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
