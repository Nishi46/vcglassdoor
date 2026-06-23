"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function SearchBar({ defaultValue = "", dark = false }: { defaultValue?: string; dark?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {/* Glow on focus */}
      {dark && focused && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 0 30px rgba(37,99,235,0.35)", borderRadius: "16px" }} />
      )}

      <div
        className="flex items-center transition-all duration-200"
        style={{
          background: dark
            ? focused
              ? "rgba(15,25,55,0.95)"
              : "rgba(10,18,40,0.8)"
            : "white",
          border: dark
            ? `1px solid ${focused ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}`
            : `1px solid ${focused ? "#3b82f6" : "#e5e7eb"}`,
          borderRadius: "16px",
          boxShadow: focused && !dark ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
        }}
      >
        <svg
          className="w-4 h-4 ml-4 shrink-0 transition-colors"
          style={{ color: focused ? (dark ? "#60a5fa" : "#3b82f6") : (dark ? "rgba(255,255,255,0.3)" : "#9ca3af") }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by partner name or firm…"
          className="flex-1 py-3.5 px-3 text-sm bg-transparent outline-none placeholder-current"
          style={{ color: dark ? "rgba(255,255,255,0.85)" : "#111827" }}
        />

        <motion.button
          type="submit"
          className="m-1.5 text-sm font-semibold px-4 py-2 rounded-xl shrink-0"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "white",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Search
        </motion.button>
      </div>
    </form>
  );
}
