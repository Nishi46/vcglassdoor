"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { Partner } from "@/lib/airtable";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(value);
        return (
          <svg key={i} className={`w-3 h-3 ${filled ? "text-amber-400" : "text-white/15"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

const AVATAR_COLORS = [
  { bg: "from-blue-500 to-indigo-600", text: "text-white" },
  { bg: "from-violet-500 to-purple-600", text: "text-white" },
  { bg: "from-emerald-500 to-teal-600", text: "text-white" },
  { bg: "from-amber-500 to-orange-500", text: "text-white" },
  { bg: "from-rose-500 to-pink-600", text: "text-white" },
  { bg: "from-cyan-500 to-sky-600", text: "text-white" },
];

function getColor(name: string, firm: string) {
  const idx = (name + firm).split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function PartnerCard({ partner }: { partner: Partner }) {
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
  const initials = partner.name
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Link
          href={`/partners/${partner.slug || "#"}`}
          className="block relative overflow-hidden cursor-pointer"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(15,25,50,0.9), rgba(10,18,40,0.95))",
            border: "1px solid rgba(96,165,250,0.22)",
            boxShadow: hovered
              ? "0 20px 60px rgba(37,99,235,0.25), 0 0 0 1px rgba(96,165,250,0.25)"
              : "0 4px 20px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.3s ease",
          }}
          data-cursor="View"
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
              {/* Avatar */}
              <motion.div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center shrink-0 shadow-lg`}
                style={{ transform: "translateZ(20px)" }}
              >
                {partner.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.photo_url} alt={partner.name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <span className="text-sm font-bold text-white">{initials}</span>
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white truncate text-[15px]">
                      {partner.name || "Unknown Partner"}
                    </p>
                    <p className="text-sm text-white/60 truncate mt-0.5">
                      {[partner.title, partner.firm].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: hovered ? 0 : 4, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4 text-blue-400 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.div>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  {partner.avg_overall > 0 ? (
                    <>
                      <StarRating value={partner.avg_overall} />
                      <span className="text-sm font-bold text-white/80 tabular-nums">
                        {partner.avg_overall.toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-white/30 italic">No ratings yet</span>
                  )}
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/55 bg-white/5 px-2 py-0.5 rounded-full border border-white/15">
                    {partner.review_count} {partner.review_count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
