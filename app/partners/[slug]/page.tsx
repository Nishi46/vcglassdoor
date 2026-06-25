import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPartnerBySlug,
  getReviewsForPartner,
  getAiReviewsForPartner,
  getAllPublishedPartnerSlugs,
} from "@/lib/airtable";
import { getFirmMeta } from "@/lib/firm-metadata";
import RatingDisplay from "@/components/RatingDisplay";
import ReviewCard from "@/components/ReviewCard";
import ReviewList from "@/components/ReviewList";
import StickyReviewCTA from "@/components/StickyReviewCTA";
import BriefCard from "@/components/BriefCard";
import WatchlistButton from "@/components/WatchlistButton";
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

  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  const idx = (name + firm).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  return (
    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold ${colors[idx]}`}>
      {initials || firm[0]?.toUpperCase() || "?"}
    </div>
  );
}

function ScoreBadge({ value }: { value: number }) {
  const color =
    value >= 4 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    value >= 3 ? "bg-blue-50 text-blue-700 border-blue-200" :
    value > 0  ? "bg-amber-50 text-amber-700 border-amber-200" :
    "bg-gray-50 text-gray-400 border-gray-200";

  return (
    <div className={`inline-flex items-baseline gap-1 border rounded-xl px-4 py-2 ${color}`}>
      <span className="text-3xl font-bold tabular-nums">
        {value > 0 ? value.toFixed(1) : "—"}
      </span>
      <span className="text-sm opacity-60">/ 5</span>
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
  const aiReviews = reviews.length === 0 ? await getAiReviewsForPartner(partner.id) : [];

  const reviewUrl = `/submit?partner=${partner.slug}`;
  const firmMeta = getFirmMeta(partner.firm);

  const avgResponsiveness = reviews.length
    ? reviews.reduce((s, r) => s + r.rating_responsiveness, 0) / reviews.length
    : 0;
  const avgBehavior = reviews.length
    ? reviews.reduce((s, r) => s + r.rating_behavior, 0) / reviews.length
    : 0;
  const avgFounderFriendly = reviews.length
    ? reviews.reduce((s, r) => s + r.rating_founder_friendly, 0) / reviews.length
    : 0;
  const avgTermSheet = reviews.length
    ? reviews.reduce((s, r) => s + r.rating_term_sheet_match, 0) / reviews.length
    : 0;
  const avgOverall = reviews.length
    ? reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length
    : 0;

  // JSON-LD structured data for Google rich results
  const jsonLd = reviews.length >= 3 ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": partner.name,
    "jobTitle": partner.title,
    "worksFor": { "@type": "Organization", "name": partner.firm },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgOverall.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": reviews.length,
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-3xl mx-auto px-5 py-10 pb-24 md:pb-10">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 mb-8 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All partners
        </Link>

        {/* Partner hero */}
        <div id="partner-hero" className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {partner.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partner.photo_url}
                alt={partner.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
              />
            ) : (
              <InitialsAvatar name={partner.name} firm={partner.firm} />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
                  <p className="text-gray-500 mt-1">
                    {partner.title && <span>{partner.title}</span>}
                    {partner.title && partner.firm && <span className="text-gray-300 mx-1.5">·</span>}
                    {partner.firm && <span className="font-medium text-gray-700">{partner.firm}</span>}
                  </p>
                  {partner.linkedin_url && (
                    <a
                      href={partner.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>

                {(() => {
                  const showVerified = (partner.review_count ?? 0) >= 3;
                  const showAi = !showVerified && partner.ai_seeded && (partner.ai_overall ?? 0) > 0;
                  const lowConfidence = (partner.ai_confidence ?? 0) < 0.3;
                  return showVerified ? (
                    <ScoreBadge value={partner.avg_overall} />
                  ) : showAi && !lowConfidence ? (
                    <div className="flex flex-col items-end gap-1">
                      <div className="inline-flex items-baseline gap-1 border rounded-xl px-4 py-2"
                        style={{ background: "rgba(31,86,115,0.08)", borderColor: "rgba(117,159,188,0.3)" }}>
                        <span className="text-3xl font-bold tabular-nums" style={{ color: "#90c3c8" }}>
                          {partner.ai_overall?.toFixed(1)}
                        </span>
                        <span className="text-sm" style={{ color: "#759fbc", opacity: 0.7 }}>/ 5</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(31,86,115,0.12)", color: "#90c3c8", border: "1px solid rgba(117,159,188,0.25)" }}>
                        AI est. · {partner.ai_source_count} sources
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                  {partner.review_count} verified {partner.review_count === 1 ? "review" : "reviews"}
                </span>
                <Link
                  href={reviewUrl}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  + Add your experience
                </Link>
                <WatchlistButton
                  partnerSlug={partner.slug}
                  partnerName={partner.name}
                  variant="full"
                />
              </div>

              {/* Firm context chips */}
              {firmMeta && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
                    </svg>
                    {firmMeta.stage}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {firmMeta.check}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
                    </svg>
                    {firmMeta.geo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating breakdown + histogram */}
        {reviews.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Rating breakdown</h2>
            <div className="space-y-1">
              <RatingDisplay label="Overall" value={avgOverall} highlight />
              <RatingDisplay label="Responsiveness" value={avgResponsiveness} />
              <RatingDisplay label="Behavior in the room" value={avgBehavior} />
              <RatingDisplay label="Founder-friendliness" value={avgFounderFriendly} />
              <RatingDisplay label="Term sheet matched handshake" value={avgTermSheet} />
            </div>
            {/* Histogram lives inside the rating card, passed via ReviewList */}
            <ReviewList reviews={reviews} showHistogram />
          </div>
        )}

        {/* Backchannel Brief */}
        <div className="mb-6">
          <BriefCard
            partnerSlug={partner.slug}
            partnerName={partner.name}
            reviewCount={reviews.length}
            userTier="free"
          />
        </div>

        {/* AI signals — only shown when no verified reviews yet */}
        {(() => {
          const showVerified = (partner.review_count ?? 0) >= 3;
          const showAi = !showVerified && partner.ai_seeded && (partner.ai_overall ?? 0) > 0;
          const lowConfidence = (partner.ai_confidence ?? 0) < 0.3;
          if (!showAi) return null;
          if (lowConfidence) {
            return (
              <div className="rounded-2xl p-5 mb-6 text-sm"
                style={{ background: "rgba(31,86,115,0.06)", border: "1px solid rgba(117,159,188,0.15)", color: "#759fbc" }}>
                Limited public data available for this partner.
              </div>
            );
          }
          let signals: Array<{ type: string; text: string; source: string }> = [];
          try { signals = JSON.parse(partner.ai_signals ?? "[]"); } catch { /* ignore */ }
          if (signals.length === 0) return null;
          return (
            <div className="rounded-2xl p-6 mb-6"
              style={{ background: "rgba(31,86,115,0.06)", border: "1px solid rgba(117,159,188,0.15)" }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#759fbc" }}>
                  Public signals
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(31,86,115,0.12)", color: "#90c3c8", border: "1px solid rgba(117,159,188,0.2)" }}>
                  AI-estimated · not verified
                </span>
              </div>
              <ul className="space-y-2">
                {signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0 text-base leading-none">
                      {s.type === "green" ? "✓" : s.type === "red" ? "✗" : "·"}
                    </span>
                    <span style={{ color: s.type === "green" ? "#90c3c8" : s.type === "red" ? "#f87171" : "#b9b8d3" }}>
                      {s.text}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-4" style={{ color: "#759fbc", opacity: 0.6 }}>
                Sourced from {partner.ai_source_count} public mentions · Confidence {((partner.ai_confidence ?? 0) * 100).toFixed(0)}%
              </p>
            </div>
          );
        })()}

        {/* Reviews section header */}
        {reviews.length === 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-lg">
                {aiReviews.length > 0 ? "Verified reviews" : "No reviews yet"}
              </h2>
              <Link
                href={reviewUrl}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Add your experience
              </Link>
            </div>

            {/* AI-generated reviews fallback */}
            {aiReviews.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <h2 className="font-semibold text-lg" style={{ color: "#b9b8d3" }}>
                    From public sources
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{ color: "#90c3c8", background: "rgba(31,86,115,0.1)", border: "1px solid rgba(117,159,188,0.2)" }}>
                    AI-generated · not verified
                  </span>
                </div>
                <p className="text-sm mb-5" style={{ color: "#759fbc", opacity: 0.7 }}>
                  These reviews are synthesized from public internet sources by AI. They are estimates only and will be replaced by real founder reviews as they are submitted.
                </p>
                <div className="space-y-4">
                  {aiReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {aiReviews.length === 0 && (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-1">No reviews published yet</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mb-5">
                  Reviews publish once 3+ verified submissions exist — protecting anonymity.
                </p>
                <Link
                  href={reviewUrl}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-all"
                >
                  Submit yours
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Verified reviews — shown via ReviewList which handles filtering */}
        {reviews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-lg">
                {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
              </h2>
              <Link
                href={reviewUrl}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Add your experience
              </Link>
            </div>
            <ReviewList reviews={reviews} />
          </div>
        )}
      </div>

      {/* Sticky mobile CTA — only visible on mobile, appears after scrolling past hero */}
      <StickyReviewCTA reviewUrl={reviewUrl} partnerName={partner.name} />
    </>
  );
}
