"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav({ tallyUrl }: { tallyUrl: string }) {
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
          background: scrolled
            ? "rgba(4, 12, 30, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled
            ? "0 0 0 1px rgba(96,165,250,0.12), 0 8px 32px rgba(0,0,0,0.4)"
            : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" data-cursor="Home">
          <motion.div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </motion.div>
          <span className={`font-semibold tracking-tight text-[15px] transition-colors ${scrolled ? "text-white" : "text-white"}`}>
            VCGlassdoor
          </span>
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-1">
          <Link
            href="/about"
            className={`text-sm px-3 py-2 rounded-lg transition-all ${scrolled ? "text-white/60 hover:text-white hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10"}`}
          >
            How it works
          </Link>
          <motion.a
            href={tallyUrl || "/submit"}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm font-semibold px-4 py-2 rounded-xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "white",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            data-cursor="Review"
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%", skewX: -15 }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.5 }}
            />
            Leave a review
          </motion.a>
        </nav>
      </motion.div>
    </motion.header>
  );
}
