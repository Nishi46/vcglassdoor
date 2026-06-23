"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className={`w-4 h-4 transition-colors duration-150 ${focused ? "text-blue-500" : "text-gray-400"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by partner name or firm…"
        className={`w-full bg-white rounded-xl border py-3.5 pl-11 pr-24 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200
          ${focused
            ? "border-blue-400 ring-3 ring-blue-50 shadow-md"
            : "border-gray-200 hover:border-gray-300"
          }`}
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-blue-700 transition-all active:scale-[0.97] shadow-sm"
      >
        Search
      </button>
    </form>
  );
}
