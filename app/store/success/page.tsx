"use client";

import Nav from "../../components/Nav";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../CartContext";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SuccessPage() {
  const { clear } = useCart();

  // Payment succeeded — empty the cart so a refresh or back-nav starts clean.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#f5f5f7", position: "relative", overflow: "hidden" }}>
      <Nav />
      <section className="max-w-xl mx-auto px-6 pt-40 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mb-8 flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, background: "rgba(184,226,7,0.12)", border: "1px solid rgba(184,226,7,0.4)" }}
        >
          <span style={{ color: "#B8E207", fontSize: "2rem", lineHeight: 1 }}>✓</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="font-black tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f5f5f7" }}
        >
          Thank you for your purchase!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="text-base mt-5"
          style={{ color: "#86868b" }}
        >
          Your download link is on its way to your inbox. It stays valid for 7 days.
          If it does not arrive in a few minutes, check your spam folder or reply to the email.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <Link
            href="/store"
            className="inline-block mt-9 rounded-full px-7 py-3 text-sm font-semibold cursor-pointer"
            style={{ background: "#f5f5f7", color: "#000" }}
          >
            Back to the store
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
