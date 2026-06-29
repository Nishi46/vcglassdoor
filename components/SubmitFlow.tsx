"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { savePendingReview } from "@/components/PendingReviewBanner";

// ── Shared types ─────────────────────────────────────────────────────────────

interface SelectedPartner {
  id: string;
  name: string;
  firm: string;
  title?: string;
  slug: string;
  photo_url?: string;
  review_count?: number;
  isManual?: boolean;
}

// ── Avatar helpers (mirrors PartnerCard) ─────────────────────────────────────

const AVATAR_COLORS = [
  "from-[#1f5673] to-[#759fbc]",
  "from-[#2a4a6b] to-[#b9b8d3]",
  "from-[#1f5673] to-[#90c3c8]",
  "from-[#463730] to-[#759fbc]",
  "from-[#2a3a5c] to-[#b9b8d3]",
  "from-[#1a4a5a] to-[#90c3c8]",
];

function avatarColor(name: string, firm: string) {
  const idx =
    (name + firm).split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 6,
            height: 6,
            background:
              i < step
                ? "#90c3c8"
                : i === step
                ? "linear-gradient(90deg,#1f5673,#90c3c8)"
                : "rgba(117,159,188,0.2)",
          }}
        />
      ))}
    </div>
  );
}

// ── Star rating input ─────────────────────────────────────────────────────────

function StarInput({
  value,
  onChange,
  label,
  required,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  required?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(117,159,188,0.1)" }}>
      <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
        {label}
        {!required && (
          <span className="ml-1.5 text-xs" style={{ color: "rgba(117,159,188,0.5)" }}>
            optional
          </span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => {
            const active = i <= (hovered || value);
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                whileTap={{ scale: 0.85 }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: active
                    ? "rgba(144,195,200,0.15)"
                    : "rgba(117,159,188,0.06)",
                  border: `1px solid ${active ? "rgba(144,195,200,0.4)" : "rgba(117,159,188,0.15)"}`,
                }}
                aria-label={`Rate ${i} out of 5`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  style={{ color: active ? "#90c3c8" : "rgba(117,159,188,0.3)" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </motion.button>
            );
          })}
        </div>
        {value > 0 && (
          <span className="text-sm font-bold tabular-nums w-6 text-right" style={{ color: "#90c3c8" }}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Partner picker ────────────────────────────────────────────────────

function PartnerPicker({
  initial,
  onSelect,
}: {
  initial: SelectedPartner | null;
  onSelect: (p: SelectedPartner | { name: string; firm: string; id: string; slug: string; isManual: true }) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SelectedPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualFirm, setManualFirm] = useState("");
  const [open, setOpen] = useState(false);
  const [overrideInitial, setOverrideInitial] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.partners ?? []);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  }

  if (initial && !overrideInitial) {
    return (
      <div className="space-y-4">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: "rgba(31,86,115,0.12)",
            border: "1px solid rgba(117,159,188,0.25)",
          }}
        >
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColor(initial.name, initial.firm)} flex items-center justify-center shrink-0`}
          >
            {initial.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={initial.photo_url} alt={initial.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{initials(initial.name)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-[15px]">{initial.name}</p>
            <p className="text-sm mt-0.5" style={{ color: "#759fbc" }}>
              {[initial.title, initial.firm].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOverrideInitial(true)}
            className="text-xs px-3 py-1.5 rounded-xl transition-all"
            style={{ color: "#90c3c8", border: "1px solid rgba(144,195,200,0.25)", background: "rgba(144,195,200,0.08)" }}
          >
            Change
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSelect(initial)}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #1f5673, #759fbc)",
            color: "white",
            boxShadow: "0 4px 20px rgba(31,86,115,0.4)",
          }}
        >
          Continue with {initial.name} →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          className="flex items-center transition-all duration-200"
          style={{
            background: "rgba(5,15,25,0.85)",
            border: "1px solid rgba(117,159,188,0.2)",
            borderRadius: "16px",
          }}
        >
          <svg
            className="w-4 h-4 ml-4 shrink-0"
            style={{ color: "#759fbc" }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => query.length >= 2 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search by partner name or firm…"
            className="flex-1 py-3.5 px-3 text-sm bg-transparent outline-none"
            style={{ color: "rgba(255,255,255,0.85)" }}
            autoFocus
          />
          {loading && (
            <div className="mr-4 w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(144,195,200,0.3)", borderTopColor: "#90c3c8" }} />
          )}
        </div>

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-2 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(6,16,26,0.98)",
                border: "1px solid rgba(117,159,188,0.2)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onMouseDown={() => onSelect(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5"
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(p.name, p.firm)} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-xs font-bold text-white">{initials(p.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#759fbc" }}>
                      {[p.title, p.firm].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {(p.review_count ?? 0) > 0 && (
                    <span className="text-xs shrink-0" style={{ color: "rgba(144,195,200,0.6)" }}>
                      {p.review_count} reviews
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showManual ? (
        <button
          type="button"
          onClick={() => setShowManual(true)}
          className="text-sm transition-colors"
          style={{ color: "rgba(117,159,188,0.6)" }}
        >
          Don&apos;t see them? Add manually →
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          <p className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
            Enter their details and we&apos;ll add them to our directory.
          </p>
          <input
            type="text"
            placeholder="Partner name *"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(5,15,25,0.85)",
              border: "1px solid rgba(117,159,188,0.2)",
              color: "rgba(255,255,255,0.85)",
            }}
          />
          <input
            type="text"
            placeholder="Firm name"
            value={manualFirm}
            onChange={(e) => setManualFirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(5,15,25,0.85)",
              border: "1px solid rgba(117,159,188,0.2)",
              color: "rgba(255,255,255,0.85)",
            }}
          />
          <motion.button
            type="button"
            disabled={!manualName.trim()}
            onClick={() =>
              onSelect({
                id: `manual:${manualName}`,
                name: manualName.trim(),
                firm: manualFirm.trim(),
                slug: "",
                isManual: true,
              })
            }
            className="w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-40 transition-all"
            style={{
              background: "linear-gradient(135deg, #1f5673, #759fbc)",
              color: "white",
            }}
            whileHover={{ boxShadow: "0 4px 20px rgba(31,86,115,0.5)" }}
          >
            Continue →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ── Step 2: Ratings ───────────────────────────────────────────────────────────

interface RatingsData {
  relationship: string;
  year: number;
  rating_overall: number;
  rating_responsiveness: number;
  rating_behavior: number;
  rating_founder_friendly: number;
  rating_term_sheet_match: number;
  review_text: string;
  green_flags: string;
  red_flags: string;
}

function RatingsStep({
  partnerName,
  partnerFirm,
  onBack,
  onNext,
}: {
  partnerName: string;
  partnerFirm: string;
  onBack: () => void;
  onNext: (data: RatingsData) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - 1 - i);

  const [relationship, setRelationship] = useState("");
  const [year, setYear] = useState(currentYear - 1);
  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingResponsiveness, setRatingResponsiveness] = useState(0);
  const [ratingBehavior, setRatingBehavior] = useState(0);
  const [ratingFounderFriendly, setRatingFounderFriendly] = useState(0);
  const [ratingTermSheet, setRatingTermSheet] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [greenFlags, setGreenFlags] = useState("");
  const [redFlags, setRedFlags] = useState("");

  const canContinue = relationship && ratingOverall > 0;

  function handleSubmit() {
    if (!canContinue) return;
    onNext({
      relationship,
      year,
      rating_overall: ratingOverall,
      rating_responsiveness: ratingResponsiveness,
      rating_behavior: ratingBehavior,
      rating_founder_friendly: ratingFounderFriendly,
      rating_term_sheet_match: ratingTermSheet,
      review_text: reviewText,
      green_flags: greenFlags,
      red_flags: redFlags,
    });
  }

  const selectStyle = {
    background: "rgba(5,15,25,0.85)",
    border: "1px solid rgba(117,159,188,0.2)",
    color: "rgba(255,255,255,0.85)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    appearance: "none" as const,
  };

  const textareaStyle = {
    background: "rgba(5,15,25,0.85)",
    border: "1px solid rgba(117,159,188,0.15)",
    color: "rgba(255,255,255,0.85)",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    resize: "none" as const,
  };

  return (
    <div className="space-y-5">
      {/* Partner strip */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "rgba(31,86,115,0.1)", border: "1px solid rgba(117,159,188,0.15)" }}
      >
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(partnerName, partnerFirm)} flex items-center justify-center shrink-0`}
        >
          <span className="text-xs font-bold text-white">{initials(partnerName)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">Reviewing {partnerName}</p>
          {partnerFirm && <p className="text-xs truncate mt-0.5" style={{ color: "#759fbc" }}>{partnerFirm}</p>}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs px-2.5 py-1.5 rounded-lg"
          style={{ color: "#90c3c8", border: "1px solid rgba(144,195,200,0.2)", background: "rgba(144,195,200,0.06)" }}
        >
          Change
        </button>
      </div>

      {/* Relationship + year */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(117,159,188,0.8)" }}>
            Your relationship *
          </label>
          <div className="relative">
            <select value={relationship} onChange={(e) => setRelationship(e.target.value)} style={selectStyle}>
              <option value="">Select…</option>
              <option>Pitched (no deal)</option>
              <option>Received term sheet</option>
              <option>Portfolio founder</option>
              <option>LP</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#759fbc" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(117,159,188,0.8)" }}>
            Year
          </label>
          <div className="relative">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#759fbc" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(5,15,25,0.6)", border: "1px solid rgba(117,159,188,0.12)" }}
      >
        <StarInput value={ratingOverall} onChange={setRatingOverall} label="Overall" required />
        <StarInput value={ratingResponsiveness} onChange={setRatingResponsiveness} label="Responsiveness" />
        <StarInput value={ratingBehavior} onChange={setRatingBehavior} label="Behavior in the room" />
        <StarInput value={ratingFounderFriendly} onChange={setRatingFounderFriendly} label="Founder-friendliness" />
        <StarInput value={ratingTermSheet} onChange={setRatingTermSheet} label="Term sheet matched handshake" />
      </div>

      {/* Written review */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(117,159,188,0.8)" }}>
          Describe your experience
          <span className="ml-1.5 opacity-60">optional</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value.slice(0, 600))}
          placeholder="What was your experience like? Be specific — this is the most useful thing you can write."
          rows={4}
          style={textareaStyle}
        />
        <p className="text-xs mt-1 text-right" style={{ color: "rgba(117,159,188,0.4)" }}>
          {reviewText.length}/600
        </p>
      </div>

      {/* Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "rgba(117,159,188,0.8)" }}>
            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>✓</span>
            Green flags
            <span className="opacity-60">optional</span>
          </label>
          <textarea
            value={greenFlags}
            onChange={(e) => setGreenFlags(e.target.value.slice(0, 400))}
            placeholder="e.g. Fast email replies, honest about portfolio"
            rows={2}
            style={{ ...textareaStyle, borderColor: "rgba(16,185,129,0.2)" }}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "rgba(117,159,188,0.8)" }}>
            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>✗</span>
            Red flags
            <span className="opacity-60">optional</span>
          </label>
          <textarea
            value={redFlags}
            onChange={(e) => setRedFlags(e.target.value.slice(0, 400))}
            placeholder="e.g. Re-traded terms, went dark after passing"
            rows={2}
            style={{ ...textareaStyle, borderColor: "rgba(239,68,68,0.15)" }}
          />
        </div>
      </div>

      <motion.button
        type="button"
        disabled={!canContinue}
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-40 transition-all"
        style={{
          background: canContinue ? "linear-gradient(135deg, #1f5673, #759fbc)" : "rgba(31,86,115,0.3)",
          color: "white",
          boxShadow: canContinue ? "0 4px 20px rgba(31,86,115,0.4)" : "none",
        }}
        whileHover={canContinue ? { boxShadow: "0 6px 28px rgba(31,86,115,0.55)", y: -1 } : {}}
        whileTap={canContinue ? { scale: 0.98 } : {}}
      >
        Continue to verification →
      </motion.button>

      {!canContinue && (
        <p className="text-xs text-center" style={{ color: "rgba(117,159,188,0.5)" }}>
          Select your relationship and an overall rating to continue
        </p>
      )}
    </div>
  );
}

// ── Step 3: Verification ──────────────────────────────────────────────────────

function VerificationStep({
  partnerName,
  onSubmit,
  submitting,
}: {
  partnerName: string;
  onSubmit: (file: File | null) => void;
  submitting: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
    if (!allowed.includes(f.type)) return;
    if (f.size > 10 * 1024 * 1024) return;
    setFile(f);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-white mb-1">Verify your interaction</h3>
        <p className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
          Upload proof you met or raised from {partnerName}. This is reviewed manually before your review publishes.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="cursor-pointer rounded-2xl p-8 flex flex-col items-center gap-3 transition-all"
        style={{
          border: `2px dashed ${dragOver ? "rgba(144,195,200,0.5)" : file ? "rgba(144,195,200,0.35)" : "rgba(117,159,188,0.2)"}`,
          background: dragOver
            ? "rgba(31,86,115,0.12)"
            : file
            ? "rgba(31,86,115,0.08)"
            : "rgba(5,15,25,0.5)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {file ? (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(31,86,115,0.2)", border: "1px solid rgba(117,159,188,0.3)" }}>
              <svg className="w-6 h-6" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#759fbc" }}>
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-xs px-3 py-1.5 rounded-xl transition-all"
              style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.06)" }}
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(31,86,115,0.15)", border: "1px solid rgba(117,159,188,0.2)" }}>
              <svg className="w-6 h-6" style={{ color: "#759fbc" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Drop a file or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(117,159,188,0.5)" }}>
                Images or PDF · max 10 MB
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {["Meeting invite", "Email thread", "Cap table"].map((label) => (
                <span
                  key={label}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ color: "#90c3c8", background: "rgba(31,86,115,0.15)", border: "1px solid rgba(117,159,188,0.2)" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Privacy notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: "rgba(31,86,115,0.08)", border: "1px solid rgba(117,159,188,0.15)" }}
      >
        <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(117,159,188,0.7)" }}>
          Your name and company are never stored. Files are stored securely and reviewed by our moderation team to verify that an interaction occurred.
        </p>
      </div>

      {/* Submit buttons */}
      <div className="space-y-3">
        <motion.button
          type="button"
          onClick={() => onSubmit(file)}
          disabled={submitting}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-60 transition-all"
          style={{
            background: "linear-gradient(135deg, #1f5673, #759fbc)",
            color: "white",
            boxShadow: "0 4px 20px rgba(31,86,115,0.4)",
          }}
          whileHover={!submitting ? { boxShadow: "0 6px 28px rgba(31,86,115,0.55)", y: -1 } : {}}
          whileTap={!submitting ? { scale: 0.98 } : {}}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
              Submitting…
            </span>
          ) : file ? (
            "Submit review with proof"
          ) : (
            "Submit review"
          )}
        </motion.button>

        {!file && (
          <p className="text-xs text-center" style={{ color: "rgba(117,159,188,0.5)" }}>
            Submitting without a file places your review in a longer verification queue.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 4: Confirmation ──────────────────────────────────────────────────────

function ConfirmationStep({
  partnerName,
  partnerSlug,
  onReset,
}: {
  partnerName: string;
  partnerSlug: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 space-y-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(31,86,115,0.3), rgba(144,195,200,0.2))", border: "2px solid rgba(144,195,200,0.4)" }}
      >
        <svg className="w-8 h-8" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.div>

      <div>
        <h3 className="text-xl font-bold text-white">Review submitted</h3>
        <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: "rgba(117,159,188,0.7)" }}>
          It will publish once 3+ verified reviews exist for {partnerName}. You helped make the VC market more transparent.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="text-sm px-5 py-2.5 rounded-xl transition-all"
          style={{
            color: "#90c3c8",
            border: "1px solid rgba(144,195,200,0.25)",
            background: "rgba(144,195,200,0.06)",
          }}
        >
          Review another partner
        </button>
        {partnerSlug && (
          <Link
            href={`/partners/${partnerSlug}`}
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, #1f5673, #759fbc)",
              color: "white",
              boxShadow: "0 4px 16px rgba(31,86,115,0.35)",
            }}
          >
            View {partnerName}&apos;s profile →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ── Root SubmitFlow ───────────────────────────────────────────────────────────

interface SubmitFlowProps {
  prefillPartner?: SelectedPartner | null;
}

export default function SubmitFlow({ prefillPartner }: SubmitFlowProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(prefillPartner ? 1 : 0);
  const [partner, setPartner] = useState<SelectedPartner | null>(prefillPartner ?? null);
  const [ratingsData, setRatingsData] = useState<RatingsData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If prefill changes (e.g. URL param loads async), sync
  useEffect(() => {
    if (prefillPartner) {
      setPartner(prefillPartner);
      setStep(1);
    }
  }, [prefillPartner]);

  function handlePartnerSelect(p: SelectedPartner | { name: string; firm: string; id: string; slug: string; isManual: true }) {
    setPartner(p as SelectedPartner);
    setStep(1);
  }

  function handleRatingsNext(data: RatingsData) {
    setRatingsData(data);
    setStep(2);
  }

  async function handleSubmit(file: File | null) {
    if (!partner || !ratingsData) return;
    setSubmitting(true);
    setError(null);

    try {
      let fileName: string | undefined;
      let fileSize: number | undefined;
      let verificationUrl: string | undefined;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/reviews/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          fileName = uploadData.file_name;
          fileSize = uploadData.file_size;
          verificationUrl = uploadData.verification_url;
        }
      }

      const body = {
        partner_airtable_id: !partner.isManual && !partner.id.startsWith("static:") ? partner.id : undefined,
        partner_name_manual: partner.isManual || partner.id.startsWith("static:") ? partner.name : undefined,
        partner_firm_manual: partner.isManual || partner.id.startsWith("static:") ? partner.firm : undefined,
        ...ratingsData,
        verification_file_name: fileName,
        verification_file_size: fileSize,
        verification_url: verificationUrl,
        verification_skipped: !file,
      };

      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Submit failed");
      }

      if (data.id && partner?.slug) {
        savePendingReview(data.id, partner.slug);
      }

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(0);
    setPartner(prefillPartner ?? null);
    setRatingsData(null);
    setError(null);
    if (prefillPartner) setStep(1);
  }

  const STEP_LABELS = ["Find partner", "Your rating", "Verify", "Done"];

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          Leave a review
        </h1>
        <p className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
          Anonymous · verified · published only once 3+ reviews exist for the same partner
        </p>
      </div>

      {/* Step indicator */}
      {step < 3 && (
        <div className="mb-8 flex items-center justify-between">
          <StepDots step={step} total={3} />
          <span className="text-xs" style={{ color: "rgba(117,159,188,0.5)" }}>
            Step {step + 1} of 3 — {STEP_LABELS[step]}
          </span>
        </div>
      )}

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PartnerPicker initial={prefillPartner ?? null} onSelect={handlePartnerSelect} />
          </motion.div>
        )}

        {step === 1 && partner && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RatingsStep
              partnerName={partner.name}
              partnerFirm={partner.firm ?? ""}
              onBack={() => setStep(0)}
              onNext={handleRatingsNext}
            />
          </motion.div>
        )}

        {step === 2 && partner && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VerificationStep
              partnerName={partner.name}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </motion.div>
        )}

        {step === 3 && partner && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ConfirmationStep
              partnerName={partner.name}
              partnerSlug={partner.slug ?? ""}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
