import Link from "next/link";
import { getFirmDirectory } from "@/lib/airtable";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "VC Firms — VCGlassdoor",
  description: "Browse verified founder reviews by VC firm. See how partners at Sequoia, a16z, Benchmark, and hundreds more are rated.",
};

function ScoreDot({ value }: { value: number }) {
  const color =
    value >= 4 ? "#34d399" :
    value >= 3 ? "#60a5fa" :
    value > 0  ? "#fbbf24" : undefined;
  if (!color) return null;
  return (
    <span className="text-sm font-bold tabular-nums" style={{ color }}>
      {value.toFixed(1)}
    </span>
  );
}

export default async function FirmsPage() {
  const firms = await getFirmDirectory();

  return (
    <div style={{ background: "linear-gradient(180deg, #030818 0%, #060f24 100%)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#759fbc" }}>
            Browse by firm
          </p>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.025em" }}>
            VC Firms
          </h1>
          <p className="text-sm max-w-md" style={{ color: "rgba(185,184,211,0.7)" }}>
            {firms.length} firms with published partner profiles. Click a firm to see all partners and reviews.
          </p>
        </div>

        {firms.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-white font-semibold mb-1">No firms yet</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Reviews will appear here as partners are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {firms.map((f) => (
              <Link
                key={f.firm}
                href={`/firms/${f.firmSlug}`}
                className="group flex items-start gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                style={{
                  background: "rgba(10,22,33,0.95)",
                  border: "1px solid rgba(117,159,188,0.15)",
                }}
                onMouseEnter={undefined}
              >
                {/* Firm initial */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #1f5673, #759fbc)" }}
                >
                  {f.firm[0]?.toUpperCase() ?? "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white text-sm leading-snug truncate group-hover:text-[#90c3c8] transition-colors">
                      {f.firm}
                    </p>
                    <ScoreDot value={f.avgOverall} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "rgba(117,159,188,0.6)" }}>
                    {f.partnerCount} {f.partnerCount === 1 ? "partner" : "partners"}
                    {f.reviewedCount > 0 && (
                      <> · <span style={{ color: "#90c3c8" }}>{f.reviewedCount} reviewed</span></>
                    )}
                  </p>
                </div>

                <svg
                  className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#90c3c8" }}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
