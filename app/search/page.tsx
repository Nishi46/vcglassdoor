import { searchPartners } from "@/lib/airtable";
import PartnerCard from "@/components/PartnerCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search VC Partners — VCGlassdoor",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const partners = query ? await searchPartners(query.toLowerCase()) : [];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="mb-8 max-w-lg">
        <SearchBar defaultValue={query} />
      </div>

      {!query ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">Search for a VC partner</p>
          <p className="text-sm text-gray-400">Enter a name or firm name above to find reviews.</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-1">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-gray-400 mb-6">
            This partner may not have reviews yet — be the first.
          </p>
          <Link
            href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
          >
            Leave a review for them
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-900">{partners.length}</span>{" "}
            {partners.length === 1 ? "result" : "results"} for{" "}
            <span className="font-medium text-gray-800">&ldquo;{query}&rdquo;</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
