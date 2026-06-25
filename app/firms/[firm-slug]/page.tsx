import { notFound } from "next/navigation";
import Link from "next/link";
import { getPartnersByFirm } from "@/lib/airtable";
import { getFirmMeta } from "@/lib/firm-metadata";
import PartnerCard from "@/components/PartnerCard";
import StaticPartnerCard from "@/components/StaticPartnerCard";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "firm-slug": string }>;
}): Promise<Metadata> {
  const { "firm-slug": firmSlug } = await params;
  const firmName = firmSlug.replace(/-/g, " ");
  return {
    title: `${toTitleCase(firmName)} — VC Partner Reviews | VCGlassdoor`,
    description: `Verified founder reviews of partners at ${toTitleCase(firmName)}. Responsiveness, behavior, and founder-friendliness scores from real founders.`,
  };
}

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function FirmPage({
  params,
}: {
  params: Promise<{ "firm-slug": string }>;
}) {
  const { "firm-slug": firmSlug } = await params;
  const partners = await getPartnersByFirm(firmSlug);

  if (partners.length === 0) notFound();

  const firmName = partners[0].firm;
  const firmMeta = getFirmMeta(firmName);

  const reviewedPartners = partners.filter((p) => p.review_count > 0);
  const avgOverall =
    reviewedPartners.length > 0
      ? reviewedPartners.reduce((s, p) => s + p.avg_overall, 0) / reviewedPartners.length
      : 0;
  const totalReviews = reviewedPartners.reduce((s, p) => s + p.review_count, 0);

  return (
    <div style={{ background: "linear-gradient(180deg, #030818 0%, #060f24 100%)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Breadcrumb */}
        <Link
          href="/firms"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors group"
          style={{ color: "rgba(117,159,188,0.6)" }}
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All firms
        </Link>

        {/* Firm header */}
        <div className="mb-10">
          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
            >
              {firmName[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.025em" }}>
                {firmName}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
                  {partners.length} {partners.length === 1 ? "partner" : "partners"}
                </span>
                {totalReviews > 0 && (
                  <>
                    <span style={{ color: "rgba(117,159,188,0.3)" }}>·</span>
                    <span className="text-sm" style={{ color: "rgba(117,159,188,0.7)" }}>
                      {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
                    </span>
                    <span style={{ color: "rgba(117,159,188,0.3)" }}>·</span>
                    <span className="text-sm font-bold" style={{
                      color: avgOverall >= 4 ? "#34d399" : avgOverall >= 3 ? "#60a5fa" : "#fbbf24"
                    }}>
                      {avgOverall.toFixed(1)} avg
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Firm meta chips */}
          {firmMeta && (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ color: "#90c3c8", background: "rgba(31,86,115,0.12)", border: "1px solid rgba(117,159,188,0.2)" }}>
                {firmMeta.stage}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ color: "#90c3c8", background: "rgba(31,86,115,0.12)", border: "1px solid rgba(117,159,188,0.2)" }}>
                {firmMeta.check}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ color: "#90c3c8", background: "rgba(31,86,115,0.12)", border: "1px solid rgba(117,159,188,0.2)" }}>
                {firmMeta.geo}
              </span>
            </div>
          )}
        </div>

        {/* Partners grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((p) =>
            p.review_count > 0
              ? <PartnerCard key={p.id} partner={p} />
              : <StaticPartnerCard key={p.id} partner={p} submitUrl={`/submit?partner=${p.slug}`} />
          )}
        </div>
      </div>
    </div>
  );
}
