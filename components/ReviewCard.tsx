import type { Review } from "@/lib/airtable";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
            {review.relationship}
          </span>
          {review.year > 0 && (
            <span className="text-sm text-gray-400">{review.year}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-900">
            {review.rating_overall.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">/ 5</span>
          <span className="ml-1 inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        </div>
      </div>

      {review.review_text && (
        <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
      )}

      {(review.green_flags || review.red_flags) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {review.green_flags && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 mb-1">Green flags</p>
              <p className="text-sm text-green-800">{review.green_flags}</p>
            </div>
          )}
          {review.red_flags && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Red flags</p>
              <p className="text-sm text-red-800">{review.red_flags}</p>
            </div>
          )}
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Responsiveness", value: review.rating_responsiveness },
          { label: "Behavior", value: review.rating_behavior },
          { label: "Founder-friendly", value: review.rating_founder_friendly },
          { label: "Term sheet match", value: review.rating_term_sheet_match },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800">
              {value > 0 ? `${value}/5` : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
