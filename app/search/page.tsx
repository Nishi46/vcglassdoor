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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {!query ? (
        <p className="text-gray-400 text-sm">Enter a name or firm to search.</p>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-3">
            No results for <span className="font-medium text-gray-800">&ldquo;{query}&rdquo;</span>
          </p>
          <p className="text-sm text-gray-400 mb-5">
            This partner may not have reviews yet.
          </p>
          <Link
            href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Leave a review for them →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">
            {partners.length} {partners.length === 1 ? "result" : "results"} for{" "}
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
