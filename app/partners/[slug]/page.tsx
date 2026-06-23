import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPartnerBySlug,
  getReviewsForPartner,
  getAllPublishedPartnerSlugs,
} from "@/lib/airtable";
import RatingDisplay from "@/components/RatingDisplay";
import ReviewCard from "@/components/ReviewCard";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPublishedPartnerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) return {};
  return {
    title: `${partner.name} at ${partner.firm} — VC Reviews | VCGlassdoor`,
    description: `${partner.review_count} verified founder ${partner.review_count === 1 ? "review" : "reviews"} of ${partner.name}. Responsiveness, behavior, and founder-friendliness scores.`,
  };
}

function InitialsAvatar({ name, firm }: { name: string; firm: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-semibold">
      {initials || firm[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) notFound();

  const reviews = await getReviewsForPartner(partner.id);

  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL;
  const reviewUrl = tallyUrl
    ? `${tallyUrl}?partner=${encodeURIComponent(partner.name)}`
    : "/submit";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        All partners
      </Link>

      {/* Partner header */}
      <div className="flex items-start gap-6 mb-10">
        {partner.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.photo_url}
            alt={partner.name}
            className="w-20 h-20 rounded-full object-cover shrink-0"
          />
        ) : (
          <InitialsAvatar name={partner.name} firm={partner.firm} />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
          <p className="text-gray-500 mt-1">
            {partner.title}
            {partner.title && partner.firm ? " · " : ""}
            {partner.firm}
          </p>
          {partner.linkedin_url && (
            <a
              href={partner.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              LinkedIn →
            </a>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {partner.avg_overall > 0 ? partner.avg_overall.toFixed(1) : "—"}
            </span>
            <span className="text-gray-400 text-sm">/ 5 overall</span>
            <span className="text-gray-400 text-sm">
              · {partner.review_count}{" "}
              {partner.review_count === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>

      {/* Rating breakdown */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-10 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Rating breakdown</h2>
          <RatingDisplay
            label="Overall"
            value={
              reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length
            }
          />
          <RatingDisplay
            label="Responsiveness"
            value={
              reviews.reduce((s, r) => s + r.rating_responsiveness, 0) /
              reviews.length
            }
          />
          <RatingDisplay
            label="Behavior in the room"
            value={
              reviews.reduce((s, r) => s + r.rating_behavior, 0) / reviews.length
            }
          />
          <RatingDisplay
            label="Founder-friendliness"
            value={
              reviews.reduce((s, r) => s + r.rating_founder_friendly, 0) /
              reviews.length
            }
          />
          <RatingDisplay
            label="Term sheet matched handshake"
            value={
              reviews.reduce((s, r) => s + r.rating_term_sheet_match, 0) /
              reviews.length
            }
          />
        </div>
      )}

      {/* Reviews */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-900">
          {reviews.length > 0
            ? `${reviews.length} verified ${reviews.length === 1 ? "review" : "reviews"}`
            : "No reviews yet"}
        </h2>
        <Link
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Add your experience
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-gray-400">
          <p className="mb-2">Reviews publish once 3+ verified submissions exist.</p>
          <Link
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline text-sm"
          >
            Submit yours →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
