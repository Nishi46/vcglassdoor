"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import PartnerCard from "@/components/PartnerCard";
import SearchBar from "@/components/SearchBar";
import type { Partner } from "@/lib/airtable";

const SubtleField = dynamic(() => import("@/components/SubtleField"), { ssr: false });

function RevealWord({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomeClient({ partners, tallyUrl }: { partners: Partner[]; tallyUrl: string }) {
  return (
    <div style={{ background: "#030818", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Interactive dot grid — ultra-subtle */}
        <SubtleField />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <motion.p
            className="text-xs font-medium tracking-[0.2em] uppercase mb-8"
            style={{ color: "rgba(148,163,184,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Verified founder reviews of VC partners
          </motion.p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-white mb-6">
            <RevealWord text="Know who" delay={0.35} />
            <br />
            <span style={{ color: "rgba(255,255,255,0.65)" }}>
              <RevealWord text="you're funding." delay={0.55} />
            </span>
          </h1>

          {/* Subline */}
          <motion.p
            className="text-base text-white/60 max-w-sm mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
          >
            The open secret, finally on record.
          </motion.p>

          {/* Search */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SearchBar dark />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <motion.div
            className="w-px h-10"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "rgba(96,165,250,0.75)" }}>
                  The problem
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-5">
                  VC runs on{" "}
                  <span style={{ color: "rgba(248,113,113,0.9)" }}>open secrets.</span>
                </h2>
                <p className="text-white/65 leading-relaxed">
                  Everyone privately knows which partners ghost, which firms re-trade,
                  and which "founder-friendly" funds disappear when things get hard.
                  Nobody says it out loud — because you&apos;ll be pitching them again in 18 months.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-3">
              {[
                { title: "The curated reference", desc: "Firms hand you their happiest founders. The ones who got pushed out are never on the list." },
                { title: "The re-trade", desc: "A signed term sheet gets worse during 'confirmatory diligence.'" },
                { title: "Signalling risk", desc: "A marquee fund writes a seed cheque then passes on your A. Every investor reads that as an insider verdict." },
                { title: "The orphaned founder", desc: "Your champion leaves. Overnight you're reassigned to someone who has never met you." },
              ].map(({ title, desc }, i) => (
                <ScrollReveal key={title} delay={i * 0.07}>
                  <div className="px-5 py-4 rounded-xl border border-white/[0.1] hover:border-white/[0.18] transition-colors cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="font-semibold text-white/90 text-sm mb-1">{title}</p>
                    <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS DIRECTORY ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(96,165,250,0.75)" }}>
                  Directory
                </p>
                <h2 className="text-2xl font-black text-white">
                  {partners.length > 0
                    ? <>{partners.length} {partners.length === 1 ? "partner" : "partners"} reviewed</>
                    : "Be the first to submit"}
                </h2>
              </div>
              <a
                href={tallyUrl || "/submit"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              >
                + Add a review
              </a>
            </div>
          </ScrollReveal>

          {partners.length === 0 ? (
            <ScrollReveal delay={0.1}>
              <EmptyDirectoryState tallyUrl={tallyUrl} />
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partners.map((partner, i) => (
                <ScrollReveal key={partner.id} delay={i * 0.05}>
                  <PartnerCard partner={partner} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 text-center">
        <ScrollReveal>
          <div className="max-w-lg mx-auto">
            <p className="text-white/55 text-sm mb-5">
              Have you pitched or raised from a VC partner?
            </p>
            <motion.a
              href={tallyUrl || "/submit"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-2xl text-sm text-white"
              style={{
                background: "rgba(37,99,235,0.9)",
                border: "1px solid rgba(96,165,250,0.3)",
              }}
              whileHover={{ scale: 1.04, background: "rgba(37,99,235,1)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Leave a verified review
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </motion.a>
            <p className="text-white/40 text-xs mt-4">
              Always free · Anonymous · 3+ reviews before publishing
            </p>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}

function EmptyDirectoryState({ tallyUrl }: { tallyUrl: string }) {
  return (
    <div className="text-center py-20 rounded-2xl border border-dashed border-white/[0.12]">
      <p className="text-white/55 text-sm mb-4">No reviews published yet.</p>
      <p className="text-white/40 text-xs mb-6 max-w-xs mx-auto">
        Reviews go live once 3+ verified submissions exist for the same partner.
      </p>
      <a
        href={tallyUrl || "/submit"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg text-white/60 border border-white/10 hover:text-white/90 hover:border-white/20 transition-colors"
      >
        Leave the first review
      </a>
    </div>
  );
}
