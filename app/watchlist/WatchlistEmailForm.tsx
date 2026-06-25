"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WatchlistEmailForm({ sessionId }: { sessionId: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/watchlist/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), sessionId }),
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm"
        style={{ color: "#34d399" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        Notifications enabled — we&apos;ll email you when new reviews appear.
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
        className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
        style={{
          background: "rgba(5,15,25,0.8)",
          border: `1px solid ${state === "error" ? "rgba(248,113,113,0.4)" : "rgba(117,159,188,0.2)"}`,
          color: "rgba(255,255,255,0.85)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#759fbc")}
        onBlur={(e) => (e.currentTarget.style.borderColor = state === "error" ? "rgba(248,113,113,0.4)" : "rgba(117,159,188,0.2)")}
      />
      <motion.button
        type="submit"
        disabled={state === "loading"}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 cursor-pointer disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12 }}
      >
        {state === "loading" ? "Saving…" : "Notify me"}
      </motion.button>

      <AnimatePresence>
        {state === "error" && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs w-full"
            style={{ color: "#f87171" }}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
