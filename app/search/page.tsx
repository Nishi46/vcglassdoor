import { searchPartners } from "@/lib/airtable";
import PartnerCard from "@/components/PartnerCard";
import StaticPartnerCard from "@/components/StaticPartnerCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search VC Partners — VCGlassdoor" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const partners = query ? await searchPartners(query.toLowerCase()) : [];
  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit";

  return (
    <div style={{ background: "linear-gradient(180deg, #030818 0%, #060f24 100%)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-8 max-w-lg">
          <SearchBar defaultValue={query} dark />
        </div>

        {!query ? (
          <EmptyState icon="search" title="Search for a VC partner" sub="Enter a name or firm name above." />
        ) : partners.length === 0 ? (
          <EmptyState
            icon="warning"
            title={`No results for "${query}"`}
            sub="This partner may not have reviews yet — be the first."
            cta
          />
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span className="text-white font-semibold">{partners.length}</span>{" "}
              {partners.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partners.map((p) =>
                p.id.startsWith("static:")
                  ? <StaticPartnerCard key={p.id} partner={p} submitUrl={tallyUrl} />
                  : <PartnerCard key={p.id} partner={p} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub, cta }: { icon: "search" | "warning"; title: string; sub: string; cta?: boolean }) {
  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit";
  return (
    <div className="text-center py-24 rounded-3xl border border-dashed" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
        style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(96,165,250,0.2)" }}>
        {icon === "search"
          ? <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          : <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
        }
      </div>
      <p className="text-white font-semibold mb-1">{title}</p>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
      {cta && (
        <a href={tallyUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "white" }}>
          Leave a review for them
        </a>
      )}
    </div>
  );
}
