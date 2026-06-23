import Link from "next/link";
import type { Partner } from "@/lib/airtable";

function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2; // nearest 0.5
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rounded);
        const half = !filled && i - 0.5 === rounded;
        return (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${filled ? "text-amber-400" : half ? "text-amber-300" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

function InitialsAvatar({ name, firm }: { name: string; firm: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Deterministic color from name
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  const idx = (name + firm).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const color = colors[idx];

  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${color}`}>
      {initials || firm[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {partner.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.photo_url}
            alt={partner.name}
            className="w-11 h-11 rounded-xl object-cover shrink-0"
          />
        ) : (
          <InitialsAvatar name={partner.name} firm={partner.firm} />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate text-[15px] group-hover:text-blue-700 transition-colors">
                {partner.name || "Unknown Partner"}
              </p>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {partner.title && <span>{partner.title}</span>}
                {partner.title && partner.firm && <span className="text-gray-300 mx-1">·</span>}
                {partner.firm && <span className="font-medium text-gray-600">{partner.firm}</span>}
              </p>
            </div>
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            {partner.avg_overall > 0 ? (
              <>
                <StarRating value={partner.avg_overall} />
                <span className="text-sm font-semibold text-gray-800">
                  {partner.avg_overall.toFixed(1)}
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">No ratings yet</span>
            )}
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              {partner.review_count} {partner.review_count === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
