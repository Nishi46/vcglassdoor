"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WatchlistButtonProps {
  partnerSlug: string;
  partnerName: string;
  userTier?: "free" | "pro";
  /** compact = icon-only (for PartnerCard), full = icon + label (for profile header) */
  variant?: "compact" | "full";
}

function ProGatePopover({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-4 z-50"
      style={{
        background: "rgba(6,16,26,0.98)",
        border: "1px solid rgba(117,159,188,0.22)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 shrink-0" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <p className="text-sm font-semibold text-white">Founder Pro</p>
      </div>
      <p className="text-xs mb-3" style={{ color: "rgba(185,184,211,0.7)" }}>
        Save partners to your watchlist and get notified when new reviews appear.
      </p>
      <a
        href="/pro"
        className="block text-center text-xs font-semibold py-2 rounded-xl transition-all"
        style={{
          background: "linear-gradient(135deg, #1f5673, #759fbc)",
          color: "white",
        }}
      >
        Join Founder Pro — $29/mo
      </a>
      <p className="text-xs text-center mt-2" style={{ color: "rgba(117,159,188,0.35)" }}>Cancel anytime</p>
    </motion.div>
  );
}

export default function WatchlistButton({
  partnerSlug,
  partnerName,
  userTier = "free",
  variant = "compact",
}: WatchlistButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Fetch current save state on mount
  useEffect(() => {
    if (userTier !== "pro") { setLoading(false); return; }
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((data: { partners: Array<{ slug: string }> }) => {
        setSaved(data.partners.some((p) => p.slug === partnerSlug));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [partnerSlug, userTier]);

  async function toggle() {
    if (userTier !== "pro") {
      setShowGate((s) => !s);
      return;
    }
    if (loading || animating) return;
    setAnimating(true);
    const next = !saved;
    setSaved(next);
    try {
      await fetch(`/api/watchlist/${partnerSlug}`, {
        method: next ? "POST" : "DELETE",
      });
    } catch {
      setSaved(!next); // revert on error
    } finally {
      setAnimating(false);
    }
  }

  const isSaved = userTier === "pro" && saved;
  const label = isSaved ? "Saved" : "Watch";

  if (variant === "full") {
    return (
      <div className="relative">
        <motion.button
          onClick={toggle}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full cursor-pointer disabled:opacity-40 transition-all"
          style={{
            background: isSaved ? "rgba(52,211,153,0.1)" : "rgba(31,86,115,0.12)",
            border: `1px solid ${isSaved ? "rgba(52,211,153,0.3)" : "rgba(117,159,188,0.2)"}`,
            color: isSaved ? "#34d399" : "#90c3c8",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
        >
          <BookmarkIcon filled={isSaved} />
          {label}
        </motion.button>

        <AnimatePresence>
          {showGate && <ProGatePopover onClose={() => setShowGate(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  // compact (icon-only)
  return (
    <div className="relative">
      <motion.button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
        disabled={loading}
        title={isSaved ? `Remove ${partnerName} from watchlist` : `Save ${partnerName} to watchlist`}
        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-40 transition-all"
        style={{
          background: isSaved ? "rgba(52,211,153,0.12)" : "rgba(31,86,115,0.15)",
          border: `1px solid ${isSaved ? "rgba(52,211,153,0.25)" : "rgba(117,159,188,0.18)"}`,
          color: isSaved ? "#34d399" : "rgba(117,159,188,0.6)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.12 }}
      >
        <BookmarkIcon filled={isSaved} size={14} />
      </motion.button>

      <AnimatePresence>
        {showGate && <ProGatePopover onClose={() => setShowGate(false)} />}
      </AnimatePresence>
    </div>
  );
}

function BookmarkIcon({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return (
    <motion.svg
      key={filled ? "filled" : "outline"}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </motion.svg>
  );
}
