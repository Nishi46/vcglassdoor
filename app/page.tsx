import { getPublishedPartners } from "@/lib/airtable";
import PartnerCard from "@/components/PartnerCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const partners = await getPublishedPartners();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Know who you&apos;re taking money from.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Anonymous, verified reviews of VC partners from the founders who&apos;ve
          pitched and raised from them. The open secret, finally on record.
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* Anonymity notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-10 flex gap-3">
        <svg
          className="w-5 h-5 text-gray-400 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
        <p className="text-sm text-gray-600">
          Reviews only publish when 3 or more exist for the same partner —
          preventing de-anonymization.{" "}
          <Link href="/about" className="underline hover:text-gray-900">
            How verification works →
          </Link>
        </p>
      </div>

      {/* Partner grid */}
      {partners.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-4">No reviews published yet.</p>
          <Link
            href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline"
          >
            Be the first to leave a review →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {partners.length}{" "}
              {partners.length === 1 ? "partner" : "partners"} reviewed
            </h2>
          </div>
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
