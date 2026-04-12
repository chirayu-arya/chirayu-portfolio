"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Medium", href: "#" },
  { label: "X", href: "#" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="contact" className="pt-36 pb-24 px-8" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto">

        {/* Big CTA */}
        <div ref={ref} className="text-center mb-28">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.22em] uppercase font-medium mb-8"
            style={{ color: "#86868b" }}
          >
            Let's talk
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-bold tracking-tight leading-[0.9] mb-12"
            style={{ fontSize: "clamp(3rem, 9vw, 8.5rem)", color: "#f5f5f7" }}
          >
            Have a project
            <br />
            <span style={{ color: "#f5f5f7" }}>in mind?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
          >
            <motion.a
              href="mailto:hello@chirayuarya.com"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="inline-block px-10 py-4 rounded-full text-base font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-85"
              style={{ background: "#f5f5f7", color: "#000" }}
            >
              hello@chirayuarya.com
            </motion.a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-sm" style={{ color: "#f5f5f7" }}>
            © {new Date().getFullYear()} Chirayu Arya
          </span>
          <div className="flex items-center gap-7">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm transition-colors duration-200 cursor-pointer"
                style={{ color: "#f5f5f7" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f5f5f7")}
                onMouseLeave={e => (e.currentTarget.style.color = "#f5f5f7")}
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
