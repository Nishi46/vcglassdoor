import { notFound } from "next/navigation";
import Link from "next/link";
import { getPartnerBySlug, getReviewsForPartner } from "@/lib/airtable";
import { generateBackchannelBrief, gateBrief } from "@/lib/brief";
import BriefCard from "@/components/BriefCard";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) return {};
  return {
    title: `Backchannel Brief: ${partner.name} — VCGlassdoor`,
    description: `AI-synthesized reputation brief for ${partner.name} at ${partner.firm}, generated from verified founder reviews.`,
  };
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) notFound();

  const reviews = await getReviewsForPartner(partner.id);
  const hasBrief = reviews.length >= 3;

  let brief = null;
  if (hasBrief) {
    try {
      const full = await generateBackchannelBrief(partner, reviews);
      brief = gateBrief(full, "free");
    } catch {
      // If generation fails, show the card in idle state on the page
    }
  }

  return (
    <div style={{ background: "#030818", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-5 pt-28 pb-20">
        {/* Breadcrumb */}
        <Link
          href={`/partners/${partner.slug}`}
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "rgba(117,159,188,0.6)" }}
          onMouseEnter={undefined}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {partner.name}&apos;s profile
        </Link>

        {/* Partner identity strip */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
          >
            {partner.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              {partner.name}
            </h1>
            <p className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
              {[partner.title, partner.firm].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {/* Brief card — pre-loaded server-side; free tier gating */}
        <BriefCard
          partnerSlug={partner.slug}
          partnerName={partner.name}
          reviewCount={reviews.length}
          initialBrief={brief}
        />

        {/* CTA to full profile */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-4" style={{ color: "rgba(117,159,188,0.6)" }}>
            Read all {reviews.length} verified reviews on the full profile.
          </p>
          <Link
            href={`/partners/${partner.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full transition-all"
            style={{
              color: "#90c3c8",
              border: "1px solid rgba(144,195,200,0.25)",
              background: "rgba(31,86,115,0.08)",
            }}
          >
            View full profile
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
