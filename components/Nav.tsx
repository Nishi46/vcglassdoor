"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="mx-auto px-6 flex items-center justify-between transition-all duration-500"
        style={{
          maxWidth: scrolled ? "900px" : "100%",
          marginTop: scrolled ? "12px" : "0",
          height: scrolled ? "52px" : "68px",
          borderRadius: scrolled ? "16px" : "0",
          background: scrolled ? "rgba(3, 14, 22, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled
            ? "0 0 0 1px rgba(117,159,188,0.15), 0 8px 32px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-[15px] text-white" style={{ fontFamily: "var(--font-heading)" }}>
            VCGlassdoor
          </span>
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-1">
          <Link
            href="/firms"
            className="hidden sm:block text-sm px-3 py-2 rounded-lg transition-all duration-150"
            style={{ color: "#b9b8d3" }}
          >
            Firms
          </Link>
          <Link
            href="/about"
            className="hidden sm:block text-sm px-3 py-2 rounded-lg transition-all duration-150"
            style={{ color: "#b9b8d3" }}
          >
            How it works
          </Link>
          <Link
            href="/pro"
            className="hidden sm:block text-sm px-3 py-2 rounded-lg transition-all duration-150"
            style={{ color: "#90c3c8" }}
          >
            Founder Pro
          </Link>
          <motion.div className="ml-2">
            <Link
              href="/submit"
              className="inline-block text-sm font-semibold px-4 py-2 rounded-full cursor-pointer"
              style={{
                background: "rgba(31,86,115,0.2)",
                color: "#90c3c8",
                border: "1px solid rgba(117,159,188,0.35)",
              }}
            >
              Leave a review
            </Link>
          </motion.div>
        </nav>
      </motion.div>
    </motion.header>
  );
}
