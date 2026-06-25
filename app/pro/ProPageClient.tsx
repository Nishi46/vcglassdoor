"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Backchannel Brief",
    sub: "Full access",
    desc: "AI-synthesized one-pagers before every VC meeting. Green themes, red themes, and tactical tips drawn from all verified reviews.",
    free: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    ),
    title: "Partner Watchlist",
    sub: "Coming soon",
    desc: "Save partners you're tracking. Get notified when new reviews appear for anyone on your list.",
    free: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Brief PDF Export",
    sub: "Coming soon",
    desc: "Download any Backchannel Brief as a clean PDF to share with co-founders before a partner call.",
    free: false,
  },
];

const ALWAYS_FREE = [
  "Browse the full partner directory",
  "Read all verified reviews",
  "View rating breakdowns and histograms",
  "Submit your own reviews",
  "Search by partner name or firm",
  "Backchannel Brief: quick verdict",
];

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/pro/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? "Something went wrong");
      }
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-4"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}
        >
          <svg className="w-5 h-5" style={{ color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">You&apos;re on the list</p>
        <p className="text-xs text-center max-w-xs" style={{ color: "rgba(117,159,188,0.7)" }}>
          We&apos;ll email you when Founder Pro launches. Thanks for the support.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
        style={{
          background: "rgba(5,15,25,0.8)",
          border: `1px solid ${state === "error" ? "rgba(248,113,113,0.5)" : "rgba(117,159,188,0.25)"}`,
          color: "rgba(255,255,255,0.85)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#759fbc")}
        onBlur={(e) => (e.currentTarget.style.borderColor = state === "error" ? "rgba(248,113,113,0.5)" : "rgba(117,159,188,0.25)")}
      />
      <motion.button
        type="submit"
        disabled={state === "loading"}
        className="px-6 py-3 rounded-xl text-sm font-semibold text-white shrink-0 cursor-pointer disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #1f5673 0%, #2a6d8f 50%, #759fbc 100%)",
          boxShadow: "0 2px 16px rgba(31,86,115,0.4)",
        }}
        whileHover={{ boxShadow: "0 4px 24px rgba(31,86,115,0.6)", y: -1 }}
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {state === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin inline-block"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
            Joining…
          </span>
        ) : "Join waitlist"}
      </motion.button>

      <AnimatePresence>
        {state === "error" && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs w-full sm:col-span-2"
            style={{ color: "#f87171" }}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function ProPageClient() {
  return (
    <div style={{ background: "#030818", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">

        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(31,86,115,0.15)",
              border: "1px solid rgba(117,159,188,0.25)",
              color: "#90c3c8",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            Founder Pro — Early Access
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.08]"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Walk in with the<br />
            <span style={{ color: "#90c3c8" }}>backchannel edge.</span>
          </motion.h1>

          <motion.p
            className="text-base max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "#b9b8d3" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Founder Pro gives you AI-synthesized intelligence on every VC partner —
            so you show up to meetings knowing what founders really say behind closed doors.
          </motion.p>

          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <svg className="w-4 h-4" style={{ color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "#34d399" }}>$29 / month</span>
            <span className="text-sm" style={{ color: "rgba(52,211,153,0.6)" }}>· Cancel anytime</span>
          </motion.div>
        </div>

        {/* Feature grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(10,22,36,0.8)",
                  border: "1px solid rgba(117,159,188,0.18)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(31,86,115,0.3), rgba(117,159,188,0.15))",
                    border: "1px solid rgba(117,159,188,0.2)",
                    color: "#90c3c8",
                  }}
                >
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                <p className="text-xs mb-3" style={{ color: f.sub === "Full access" ? "#34d399" : "rgba(117,159,188,0.5)" }}>
                  {f.sub}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#b9b8d3" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Always free section */}
        <ScrollReveal delay={0.05}>
          <div
            className="rounded-2xl p-6 mb-12"
            style={{
              background: "rgba(5,12,22,0.6)",
              border: "1px solid rgba(117,159,188,0.12)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(117,159,188,0.6)" }}>
              Always free — no account needed
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALWAYS_FREE.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span style={{ color: "#b9b8d3" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Waitlist CTA */}
        <ScrollReveal delay={0.1}>
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(31,86,115,0.15) 0%, rgba(117,159,188,0.06) 100%)",
              border: "1px solid rgba(117,159,188,0.22)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Join the waitlist
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "rgba(185,184,211,0.7)" }}>
              We&apos;re onboarding founders in batches. Drop your email and we&apos;ll reach out when your spot opens.
            </p>

            <div className="max-w-sm mx-auto">
              <WaitlistForm />
            </div>

            <p className="text-xs mt-5" style={{ color: "rgba(117,159,188,0.35)" }}>
              No spam. No sharing. Just a heads-up when you&apos;re in.
            </p>
          </div>
        </ScrollReveal>

        {/* Back link */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "rgba(117,159,188,0.45)" }}
          >
            ← Back to directory
          </Link>
        </div>

      </div>
    </div>
  );
}
