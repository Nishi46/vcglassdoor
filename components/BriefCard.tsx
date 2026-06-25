"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BackchannelBrief } from "@/lib/brief";

interface BriefCardProps {
  partnerSlug: string;
  partnerName: string;
  reviewCount: number;
  userTier?: "free" | "pro";
  initialBrief?: BackchannelBrief | null;
}

function Shimmer() {
  return (
    <div className="space-y-3 animate-pulse">
      {[100, 80, 95, 70, 85].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded-full"
          style={{
            width: `${w}%`,
            background: "rgba(117,159,188,0.12)",
          }}
        />
      ))}
    </div>
  );
}

function ProGate({ label }: { label: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ minHeight: 96 }}>
      {/* Blurred content placeholder */}
      <div className="space-y-2 p-4" style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>
        {[90, 75, 85].map((w, i) => (
          <div key={i} className="h-3 rounded-full" style={{ width: `${w}%`, background: "rgba(117,159,188,0.2)" }} />
        ))}
      </div>
      {/* Frosted overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          backdropFilter: "blur(8px)",
          background: "rgba(3,8,24,0.72)",
          borderTop: "1px solid rgba(117,159,188,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: "#90c3c8" }}>Founder Pro</span>
        </div>
        <p className="text-xs text-center max-w-[220px]" style={{ color: "rgba(185,184,211,0.7)" }}>
          {label}
        </p>
        <a
          href="/pro"
          className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
          style={{
            background: "linear-gradient(135deg, #1f5673, #759fbc)",
            color: "white",
          }}
        >
          Join Founder Pro — $29/mo
        </a>
        <p className="text-xs" style={{ color: "rgba(117,159,188,0.4)" }}>Cancel anytime</p>
      </div>
    </div>
  );
}

function BriefContent({ brief, userTier }: { brief: BackchannelBrief; userTier: "free" | "pro" }) {
  const isPro = userTier === "pro";

  return (
    <div className="space-y-6">
      {/* Quick verdict — always visible */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#759fbc" }}>
          Quick verdict
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#e8e8f0" }}>
          {brief.quick_verdict}
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(117,159,188,0.45)" }}>
          Based on {brief.data_basis.review_count} verified {brief.data_basis.review_count === 1 ? "review" : "reviews"}
          {brief.data_basis.source_count > 0 ? ` · ${brief.data_basis.source_count} public signals` : ""}
        </p>
      </div>

      {/* Green themes */}
      {brief.green_themes.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#759fbc" }}>
            Green themes
          </p>
          {isPro ? (
            <ul className="space-y-2">
              {brief.green_themes.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 text-xs font-bold shrink-0" style={{ color: "#34d399" }}>✓</span>
                  <span style={{ color: "#b9b8d3" }}>{t.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ProGate label="See synthesized green flags across all reviews." />
          )}
        </div>
      )}

      {/* Red themes */}
      {brief.red_themes.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#759fbc" }}>
            Red themes
          </p>
          {isPro ? (
            <ul className="space-y-2">
              {brief.red_themes.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 text-xs font-bold shrink-0" style={{ color: "#f87171" }}>✗</span>
                  <span style={{ color: "#b9b8d3" }}>{t.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ProGate label="See synthesized concerns and cautions from founder reviews." />
          )}
        </div>
      )}

      {/* Tactical tips */}
      {brief.tactical_tips.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#759fbc" }}>
            How to work with them
          </p>
          {isPro ? (
            <ul className="space-y-2">
              {brief.tactical_tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "rgba(31,86,115,0.25)", color: "#90c3c8", border: "1px solid rgba(117,159,188,0.25)" }}>
                    {i + 1}
                  </span>
                  <span style={{ color: "#b9b8d3" }}>{t.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ProGate label="Get 2–4 tactical tips tailored to this partner's patterns." />
          )}
        </div>
      )}

      <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: "rgba(117,159,188,0.1)" }}>
        <p className="text-xs" style={{ color: "rgba(117,159,188,0.35)" }}>
          Generated {new Date(brief.generated_at).toLocaleDateString()} · Refreshes daily
        </p>
        <a
          href={`/brief/${brief.partner_slug}`}
          className="text-xs transition-colors"
          style={{ color: "rgba(117,159,188,0.45)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#90c3c8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(117,159,188,0.45)")}
        >
          Share brief ↗
        </a>
      </div>
    </div>
  );
}

export default function BriefCard({
  partnerSlug,
  partnerName,
  reviewCount,
  userTier = "free",
  initialBrief = null,
}: BriefCardProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    initialBrief ? "done" : "idle"
  );
  const [brief, setBrief] = useState<BackchannelBrief | null>(initialBrief);
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(!!initialBrief);

  async function generate() {
    setState("loading");
    setOpen(true);
    try {
      const res = await fetch(`/api/brief/${partnerSlug}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Failed to generate brief");
      }
      const data = await res.json() as { brief: BackchannelBrief };
      setBrief(data.brief);
      setState("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  }

  const canGenerate = reviewCount >= 3;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,22,36,0.8)",
        border: "1px solid rgba(117,159,188,0.2)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Backchannel Brief</p>
            <p className="text-xs" style={{ color: "rgba(117,159,188,0.6)" }}>
              {canGenerate
                ? "AI-synthesized one-pager before your meeting"
                : `Needs ${3 - reviewCount} more ${3 - reviewCount === 1 ? "review" : "reviews"} to unlock`}
            </p>
          </div>
        </div>

        {state === "idle" && canGenerate && (
          <motion.button
            onClick={generate}
            className="text-sm font-semibold px-4 py-2 rounded-full cursor-pointer shrink-0"
            style={{
              background: "rgba(31,86,115,0.2)",
              color: "#90c3c8",
              border: "1px solid rgba(117,159,188,0.3)",
            }}
            whileHover={{ background: "rgba(31,86,115,0.4)", borderColor: "rgba(144,195,200,0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Generate
          </motion.button>
        )}

        {state === "loading" && (
          <div className="flex items-center gap-2 text-xs" style={{ color: "#759fbc" }}>
            <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "rgba(117,159,188,0.3)", borderTopColor: "#90c3c8" }} />
            Generating…
          </div>
        )}

        {state === "done" && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs transition-colors"
            style={{ color: "rgba(117,159,188,0.5)" }}
          >
            {open ? "Collapse" : "Expand"}
          </button>
        )}

        {!canGenerate && (
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{ color: "rgba(117,159,188,0.5)", background: "rgba(31,86,115,0.08)", border: "1px solid rgba(117,159,188,0.12)" }}
          >
            Locked
          </span>
        )}
      </div>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-6 pb-6"
              style={{ borderTop: "1px solid rgba(117,159,188,0.1)" }}
            >
              <div className="pt-5">
                {state === "loading" && <Shimmer />}
                {state === "error" && (
                  <p className="text-sm" style={{ color: "#f87171" }}>{errorMsg}</p>
                )}
                {state === "done" && brief && (
                  <BriefContent brief={brief} userTier={userTier} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser when no reviews yet */}
      {!canGenerate && (
        <div className="px-6 pb-5">
          <p className="text-xs" style={{ color: "rgba(117,159,188,0.45)" }}>
            Help unlock{" "}
            <a href={`/submit?partner=${partnerSlug}`} className="underline" style={{ color: "rgba(144,195,200,0.6)" }}>
              {partnerName}&apos;s brief
            </a>
            {" "}by submitting a review.
          </p>
        </div>
      )}
    </div>
  );
}
