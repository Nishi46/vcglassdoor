"use client";

import { useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import type { Review } from "@/lib/airtable";

const FILTERS = ["All", "Pitched (no deal)", "Received term sheet", "Portfolio founder", "LP"] as const;
type Filter = (typeof FILTERS)[number];

function RatingHistogram({ reviews }: { reviews: Review[] }) {
  const counts = [1, 2, 3, 4, 5].map(
    (score) => reviews.filter((r) => Math.round(r.rating_overall) === score).length
  );
  const max = Math.max(...counts, 1);

  return (
    <div className="pt-4 mt-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Rating distribution
      </p>
      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((score) => {
          const count = counts[score - 1];
          const pct = (count / max) * 100;
          const color =
            score >= 4 ? "bg-emerald-400" :
            score === 3 ? "bg-blue-400" :
            score === 2 ? "bg-amber-400" :
            "bg-red-400";
          return (
            <div key={score} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-3 shrink-0 text-right tabular-nums">{score}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-4 shrink-0 tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ReviewListProps {
  reviews: Review[];
  showHistogram?: boolean;
}

export default function ReviewList({ reviews, showHistogram = false }: ReviewListProps) {
  const [active, setActive] = useState<Filter>("All");

  const available = FILTERS.filter(
    (f) => f === "All" || reviews.some((r) => r.relationship === f)
  );

  const filtered =
    active === "All" ? reviews : reviews.filter((r) => r.relationship === active);

  return (
    <div>
      {showHistogram && reviews.length > 0 && <RatingHistogram reviews={reviews} />}

      {available.length > 2 && (
        <div className="flex flex-wrap gap-2 mt-5 mb-5">
          {available.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: isActive ? "rgba(31,86,115,0.15)" : "rgba(31,86,115,0.05)",
                  border: `1px solid ${isActive ? "rgba(117,159,188,0.5)" : "rgba(117,159,188,0.15)"}`,
                  color: isActive ? "#90c3c8" : "#759fbc",
                }}
              >
                {f === "All" ? `All (${reviews.length})` : f}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
