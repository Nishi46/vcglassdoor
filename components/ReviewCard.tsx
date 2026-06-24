import type { Review } from "@/lib/airtable";

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

export default function ReviewCard({ review }: { review: Review }) {
  const relationshipColor = RELATIONSHIP_COLORS[review.relationship] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/50 transition-all duration-200 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${relationshipColor}`}>
            {review.relationship}
          </span>
          {review.year > 0 && (
            <span className="text-sm text-gray-400">{review.year}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-gray-800 tabular-nums">
              {review.rating_overall.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">/ 5</span>
          </div>
          {review.ai_generated ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
              style={{ color: "#90c3c8", background: "rgba(31,86,115,0.1)", border: "1px solid rgba(117,159,188,0.25)" }}>
              AI-generated · not verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Review text */}
      {review.review_text && (
        <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
      )}

      {/* Flags */}
      {(review.green_flags || review.red_flags) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {review.green_flags && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Green flags</p>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">{review.green_flags}</p>
            </div>
          )}
          {review.red_flags && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Red flags</p>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">{review.red_flags}</p>
            </div>
          )}
        </div>
      )}

      {/* Sub-ratings */}
      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RatingPill label="Responsiveness" value={review.rating_responsiveness} />
        <RatingPill label="Behavior" value={review.rating_behavior} />
        <RatingPill label="Founder-friendly" value={review.rating_founder_friendly} />
        <RatingPill label="Term sheet match" value={review.rating_term_sheet_match} />
      </div>
    </div>
  );
}
