"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/airtable";

const STORAGE_KEY = "vcgd_pending_reviews";

interface PendingEntry {
  recordId: string;
  partnerSlug: string;
}

function getPendingEntries(): PendingEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function savePendingReview(recordId: string, partnerSlug: string) {
  const entries = getPendingEntries();
  if (!entries.find((e) => e.recordId === recordId)) {
    entries.push({ recordId, partnerSlug });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  "Pitched (no deal)": "bg-gray-100 text-gray-600",
  "Received term sheet": "bg-blue-50 text-blue-700",
  "Portfolio founder": "bg-emerald-50 text-emerald-700",
  "LP": "bg-violet-50 text-violet-700",
};

function RatingPill({ label, value }: { label: string; value: number }) {
  const color =
    value >= 4 ? "bg-emerald-50 text-emerald-700" :
    value >= 3 ? "bg-blue-50 text-blue-700" :
    value >= 2 ? "bg-amber-50 text-amber-700" :
    value > 0 ? "bg-red-50 text-red-700" :
    "bg-gray-50 text-gray-400";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{label}</span>
      <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg w-fit ${color}`}>
        {value > 0 ? `${value}/5` : "—"}
      </span>
    </div>
  );
}

export default function PendingReviewBanner({ partnerSlug }: { partnerSlug: string }) {
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const entries = getPendingEntries();
    const entry = entries.find((e) => e.partnerSlug === partnerSlug);
    if (!entry) return;

    fetch(`/api/reviews/my-pending?id=${entry.recordId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.error) setReview(data);
      })
      .catch(() => {});
  }, [partnerSlug]);

  if (!review) return null;

  const relationshipColor = RELATIONSHIP_COLORS[review.relationship] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="mb-6 border border-amber-200 bg-amber-50/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-sm font-medium text-amber-700">
          Your review is pending — only visible to you until published
        </p>
      </div>

      <div className="bg-white border border-amber-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${relationshipColor}`}>
            {review.relationship}
          </span>
          {review.year > 0 && (
            <span className="text-xs text-gray-400">{review.year}</span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <RatingPill label="Overall" value={review.rating_overall} />
          {review.rating_responsiveness > 0 && <RatingPill label="Responsiveness" value={review.rating_responsiveness} />}
          {review.rating_behavior > 0 && <RatingPill label="Behavior" value={review.rating_behavior} />}
          {review.rating_founder_friendly > 0 && <RatingPill label="Founder-friendly" value={review.rating_founder_friendly} />}
          {review.rating_term_sheet_match > 0 && <RatingPill label="Term sheet match" value={review.rating_term_sheet_match} />}
        </div>

        {review.review_text && (
          <p className="text-sm text-gray-700 leading-relaxed">{review.review_text}</p>
        )}

        {(review.green_flags || review.red_flags) && (
          <div className="space-y-2">
            {review.green_flags && (
              <p className="text-sm text-emerald-700">
                <span className="font-medium">Green flags: </span>{review.green_flags}
              </p>
            )}
            {review.red_flags && (
              <p className="text-sm text-red-700">
                <span className="font-medium">Red flags: </span>{review.red_flags}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
