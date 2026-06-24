"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { Partner } from "@/lib/airtable";

const AVATAR_COLORS = [
  { bg: "from-[#1f5673] to-[#759fbc]" },
  { bg: "from-[#2a4a6b] to-[#b9b8d3]" },
  { bg: "from-[#1f5673] to-[#90c3c8]" },
  { bg: "from-[#463730] to-[#759fbc]" },
  { bg: "from-[#2a3a5c] to-[#b9b8d3]" },
  { bg: "from-[#1a4a5a] to-[#90c3c8]" },
];

function getColor(name: string, firm: string) {
  const idx = (name + firm).split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function StaticPartnerCard({ partner, submitUrl }: { partner: Partner; submitUrl: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useSpring(0, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  const color = getColor(partner.name, partner.firm);
  const initials = partner.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <a
          href={submitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative overflow-hidden cursor-pointer"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(10,22,33,0.95), rgba(6,16,26,0.98))",
            border: `1px solid ${hovered ? "rgba(144,195,200,0.3)" : "rgba(117,159,188,0.15)"}`,
            boxShadow: hovered
              ? "0 20px 60px rgba(31,86,115,0.2), 0 0 0 1px rgba(144,195,200,0.2)"
              : "0 4px 20px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.08) 0%, transparent 60%)`
              ),
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />

          <div className="p-5">
            <div className="flex items-start gap-4">
              <motion.div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center shrink-0 shadow-lg`}
                style={{ transform: "translateZ(20px)" }}
              >
                <span className="text-sm font-bold text-white">{initials}</span>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white truncate text-[15px]">{partner.name}</p>
                    <p className="text-sm truncate mt-0.5" style={{ color: "#759fbc" }}>
                      {[partner.title, partner.firm].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: hovered ? 0 : 4, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4 mt-1" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.div>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <span className="text-xs italic" style={{ color: "#759fbc" }}>No reviews yet</span>
                  <span style={{ color: "rgba(117,159,188,0.4)" }}>·</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "#759fbc", background: "rgba(31,86,115,0.12)", border: "1px solid rgba(117,159,188,0.2)" }}>
                    Be the first to review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
}
