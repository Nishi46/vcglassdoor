"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  id: string;
  name: string;
  firm: string;
  title: string;
  slug: string;
  review_count?: number;
}

// Shared input chrome used by both modes
function InputChrome({
  dark,
  focused,
  value,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  inputRef,
  loading,
  placeholder,
}: {
  dark: boolean;
  focused: boolean;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  loading?: boolean;
  placeholder?: string;
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="relative w-full"
    >
      {dark && focused && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 0 28px rgba(31,86,115,0.45)", borderRadius: "16px" }} />
      )}
      <div
        className="flex items-center transition-all duration-200"
        style={{
          background: dark
            ? focused ? "rgba(8,22,35,0.97)" : "rgba(5,15,25,0.85)"
            : "white",
          border: dark
            ? `1px solid ${focused ? "#759fbc" : "rgba(117,159,188,0.2)"}`
            : `1px solid ${focused ? "#1f5673" : "#e5e7eb"}`,
          borderRadius: "16px",
          boxShadow: focused && !dark ? "0 0 0 3px rgba(31,86,115,0.15)" : "none",
        }}
      >
        <svg
          className="w-4 h-4 ml-4 shrink-0 transition-colors"
          style={{ color: focused ? (dark ? "#90c3c8" : "#1f5673") : (dark ? "#759fbc" : "#9ca3af") }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder ?? "Search by partner name or firm…"}
          className="flex-1 py-3.5 px-3 text-sm bg-transparent outline-none placeholder-current"
          style={{ color: dark ? "rgba(255,255,255,0.85)" : "#111827" }}
        />

        {loading ? (
          <div className="mr-4 w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(144,195,200,0.3)", borderTopColor: dark ? "#90c3c8" : "#1f5673" }} />
        ) : (
          <motion.button
            type="submit"
            className="m-1.5 text-sm font-semibold px-5 py-2 rounded-full shrink-0 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1f5673, #759fbc)",
              color: "white",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 12px rgba(31,86,115,0.4)",
            }}
            whileHover={{ boxShadow: "0 4px 20px rgba(31,86,115,0.6)", y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            Search
          </motion.button>
        )}
      </div>
    </form>
  );
}

// Autocomplete dropdown (used in hero mode)
function SuggestionDropdown({
  suggestions,
  onSelect,
  dark,
}: {
  suggestions: Suggestion[];
  onSelect: (s: Suggestion) => void;
  dark: boolean;
}) {
  if (suggestions.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50"
      style={{
        background: dark ? "rgba(6,16,26,0.98)" : "white",
        border: `1px solid ${dark ? "rgba(117,159,188,0.2)" : "#e5e7eb"}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {suggestions.map((s) => {
        const hasReviews = (s.review_count ?? 0) > 0;
        return (
          <button
            key={s.id}
            type="button"
            onMouseDown={() => onSelect(s)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
            style={{ borderBottom: "1px solid rgba(117,159,188,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
            >
              {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: dark ? "white" : "#111827" }}>
                {s.name}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: dark ? "#759fbc" : "#6b7280" }}>
                {[s.title, s.firm].filter(Boolean).join(" · ")}
              </p>
            </div>
            {hasReviews ? (
              <span className="text-xs shrink-0 tabular-nums" style={{ color: dark ? "#90c3c8" : "#1f5673" }}>
                {s.review_count} {s.review_count === 1 ? "review" : "reviews"}
              </span>
            ) : (
              <span className="text-xs shrink-0" style={{ color: "rgba(117,159,188,0.45)" }}>
                No reviews yet
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

interface SearchBarProps {
  defaultValue?: string;
  dark?: boolean;
  /** When true, shows autocomplete suggestions and navigates directly to profile on select */
  autocomplete?: boolean;
}

export default function SearchBar({ defaultValue = "", dark = false, autocomplete = false }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.partners ?? []);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(v: string) {
    setValue(v);
    if (!autocomplete) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 300);
  }

  function handleSubmit() {
    const q = value.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleSelect(s: Suggestion) {
    setValue(s.name);
    setOpen(false);
    router.push(`/partners/${s.slug}`);
  }

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.closest("div")?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="relative w-full">
      <InputChrome
        dark={dark}
        focused={focused}
        value={value}
        onChange={handleChange}
        onFocus={() => {
          setFocused(true);
          if (autocomplete && suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => {
          setFocused(false);
          // Delay so onMouseDown on suggestion fires first
          setTimeout(() => setOpen(false), 150);
        }}
        onSubmit={handleSubmit}
        inputRef={inputRef}
        loading={autocomplete ? loading : false}
      />

      {autocomplete && (
        <AnimatePresence>
          {open && (
            <SuggestionDropdown suggestions={suggestions} onSelect={handleSelect} dark={dark} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
