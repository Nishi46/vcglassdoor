import Link from "next/link";
import type { Partner } from "@/lib/airtable";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= Math.round(value) ? "text-gray-800" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
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
  return (
    <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold shrink-0">
      {initials || firm[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        {partner.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.photo_url}
            alt={partner.name}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <InitialsAvatar name={partner.name} firm={partner.firm} />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{partner.name}</p>
          <p className="text-sm text-gray-500 truncate">{partner.title} · {partner.firm}</p>
          <div className="mt-2 flex items-center gap-2">
            {partner.avg_overall > 0 ? (
              <>
                <StarRating value={partner.avg_overall} />
                <span className="text-sm text-gray-600">
                  {partner.avg_overall.toFixed(1)}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No ratings yet</span>
            )}
            <span className="text-sm text-gray-400">
              · {partner.review_count} {partner.review_count === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
