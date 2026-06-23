"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import PartnerCard from "@/components/PartnerCard";
import SearchBar from "@/components/SearchBar";
import type { Partner } from "@/lib/airtable";

const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });

const TICKER_ITEMS = [
  "Always free for founders",
  "Manually verified",
  "Anonymous by design",
  "3+ reviews before publishing",
  "Ghosting documented",
  "Re-trades exposed",
  "No VC access",
];

function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-3 bg-white/[0.02]">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-xs font-medium tracking-widest uppercase text-white/30 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-blue-500/60 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

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
            transition={{
              duration: 0.7,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const TESTIMONIALS = [
  { quote: "I wish this existed when I signed my first term sheet. Would have saved 3 years of misery.", role: "Seed-stage founder" },
  { quote: "The ghosting after a warm intro is real. Finally somewhere to document it.", role: "YC W23" },
  { quote: "Checked this before my Series A. The pattern on the firm was exactly what I'd heard privately.", role: "B2B SaaS founder" },
];

function TestimonialCard({ quote, role, index }: { quote: string; role: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -1 : 1 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-6 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(15,25,50,0.9), rgba(10,18,40,0.8))",
        border: "1px solid rgba(96,165,250,0.12)",
      }}
    >
      <svg className="w-6 h-6 text-blue-500/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-white/80 text-sm leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
        <span className="text-xs text-white/40">{role}</span>
      </div>
    </motion.div>
  );
}

export default function HomeClient({ partners, tallyUrl }: { partners: Partner[]; tallyUrl: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  return (
    <div style={{ background: "linear-gradient(180deg, #030818 0%, #060f24 40%, #080d1e 100%)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col"
        style={{ opacity: heroOpacity }}
      >
        <ParticleField />

        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #2563eb, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-24 pb-16 text-center"
          style={{ y: heroY, scale: heroScale }}
        >
          {/* Pill */}
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(96,165,250,0.25)",
              color: "#93c5fd",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Verified founder reviews only
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white mb-6 max-w-4xl">
            <RevealWord text="Know who" delay={0.3} />
            <br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <RevealWord text="you're funding." delay={0.5} />
            </span>
          </h1>

          <motion.p
            className="text-lg sm:text-xl text-white/50 max-w-xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Anonymous, verified reviews of VC partners — from the founders who&apos;ve
            pitched and raised from them. The open secret, finally on record.
          </motion.p>

          <motion.div
            className="w-full max-w-md mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
          >
            <SearchBar dark />
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {[
              { n: "100%", label: "Manually verified" },
              { n: "0", label: "Reviewer names published" },
              { n: "3+", label: "Reviews before publishing" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white mb-0.5">{n}</div>
                <div className="text-xs text-white/30 tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <span className="text-xs text-white/20 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── PROBLEM SECTION ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: big editorial statement */}
            <ScrollReveal>
              <div className="space-y-6">
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400/60 mb-6">The problem</div>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
                  VC runs on{" "}
                  <span className="relative">
                    <span className="relative z-10" style={{ color: "#f87171" }}>open secrets</span>
                    <motion.span
                      className="absolute bottom-1 left-0 h-0.5 w-full"
                      style={{ background: "linear-gradient(90deg, #ef4444, transparent)" }}
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </span>
                </h2>
                <p className="text-white/50 leading-relaxed text-lg">
                  Everyone privately knows which partners ghost, which firms re-trade term
                  sheets, and which &ldquo;founder-friendly&rdquo; funds disappear when things get hard.
                </p>
                <p className="text-white/35 leading-relaxed">
                  Nobody says it out loud — because the person you&apos;d be calling out is
                  the same person you&apos;ll be pitching again in 18 months.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: dysfunction cards */}
            <div className="space-y-3">
              {[
                { title: "The curated reference", desc: "Firms hand you their happiest founders. The ones who got pushed out are never on the list.", icon: "📋", color: "from-blue-900/40 to-indigo-900/20" },
                { title: "Signalling risk", desc: "A marquee fund writes a small seed cheque, then passes on your A. Every other investor reads that pass as an insider verdict.", icon: "⚡", color: "from-violet-900/40 to-purple-900/20" },
                { title: "The re-trade", desc: "A handshake — or signed term sheet — gets worse during 'confirmatory diligence.'", icon: "🔄", color: "from-red-900/30 to-rose-900/20" },
                { title: "The orphaned founder", desc: "Your champion leaves the firm. Overnight you're reassigned to someone who has never met you.", icon: "👻", color: "from-gray-800/40 to-gray-900/20" },
              ].map(({ title, desc, icon, color }, i) => (
                <ScrollReveal key={title} delay={i * 0.08}>
                  <motion.div
                    className={`flex gap-4 p-4 rounded-2xl bg-gradient-to-r ${color} border border-white/5`}
                    whileHover={{ x: 4, borderColor: "rgba(96,165,250,0.2)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-white/90 text-sm mb-1">{title}</p>
                      <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400/60 mb-4">Founders say</div>
              <h2 className="text-3xl font-black text-white">The backchannel, now structured.</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS DIRECTORY ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400/60 mb-3">Directory</div>
                <h2 className="text-3xl font-black text-white">
                  {partners.length > 0
                    ? <>{partners.length} {partners.length === 1 ? "partner" : "partners"} reviewed</>
                    : "Be the first to submit"}
                </h2>
                <p className="text-white/40 mt-2 text-sm">Sorted by overall rating · All reviews verified</p>
              </div>
              <motion.a
                href={tallyUrl || "/submit"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                whileHover={{ x: 3 }}
                data-cursor="Review"
              >
                + Add a review
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </motion.a>
            </div>
          </ScrollReveal>

          {partners.length === 0 ? (
            <ScrollReveal delay={0.1}>
              <EmptyDirectoryState tallyUrl={tallyUrl} />
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partners.map((partner, i) => (
                <ScrollReveal key={partner.id} delay={i * 0.06}>
                  <PartnerCard partner={partner} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)"
          }} />
        </div>
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-[1.1]">
              The open secret,<br />
              <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                finally on record.
              </span>
            </h2>
            <p className="text-white/50 mb-8 text-lg">
              Your review protects the next founder who Googles this person at midnight before signing.
            </p>
            <motion.a
              href={tallyUrl || "/submit"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold text-base px-8 py-4 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)",
                color: "white",
                boxShadow: "0 0 40px rgba(37,99,235,0.4), 0 0 80px rgba(37,99,235,0.15)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(37,99,235,0.6), 0 0 100px rgba(37,99,235,0.2)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              data-cursor="Submit"
            >
              <motion.span
                className="absolute inset-0 bg-white/15"
                initial={{ x: "-100%", skewX: -15 }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.5 }}
              />
              Leave a verified review
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </motion.a>
            <p className="text-white/25 text-xs mt-5">
              Always free · Anonymous · Published only when 3+ reviews exist
            </p>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}

function EmptyDirectoryState({ tallyUrl }: { tallyUrl: string }) {
  return (
    <div className="text-center py-24 rounded-3xl border border-dashed border-white/10">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
        style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(96,165,250,0.2)" }}>
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
      </div>
      <p className="text-white/50 font-medium mb-2">No reviews published yet.</p>
      <p className="text-white/25 text-sm mb-6 max-w-xs mx-auto">
        Reviews go live once 3+ verified submissions exist for the same partner.
      </p>
      <motion.a
        href={tallyUrl || "/submit"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
          color: "white",
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Leave the first review
      </motion.a>
    </div>
  );
}
