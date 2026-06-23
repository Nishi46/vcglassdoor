import { getPublishedPartners } from "@/lib/airtable";
import PartnerCard from "@/components/PartnerCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const partners = await getPublishedPartners();

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-gray-100 overflow-hidden">
        {/* Subtle blue gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white pointer-events-none" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-5 pt-20 pb-16 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Verified founder reviews only
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-5 leading-[1.1]">
            Know who you&apos;re{" "}
            <span className="text-blue-600">taking money from.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Anonymous, verified reviews of VC partners from the founders who&apos;ve
            pitched and raised from them. The open secret, finally on record.
          </p>

          <div className="flex justify-center mb-10">
            <SearchBar />
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span>All reviews manually verified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Reviewer identity never published</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <span>Always free for founders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Anonymity notice */}
        <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-0.5">Your anonymity is protected by design</p>
            <p className="text-sm text-blue-700">
              Reviews only publish when 3 or more exist for the same partner — making de-anonymization dramatically harder.{" "}
              <Link href="/about" className="font-medium underline decoration-blue-300 underline-offset-2 hover:text-blue-900">
                How it works →
              </Link>
            </p>
          </div>
        </div>

        {/* Partner grid */}
        {partners.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {partners.length} {partners.length === 1 ? "partner" : "partners"} reviewed
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Sorted by overall rating</p>
              </div>
              <Link
                href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 transition-colors"
              >
                + Add a review
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews published yet</h3>
      <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
        Reviews go live once 3+ verified submissions exist for the same partner.
        Be one of the first.
      </p>
      <Link
        href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
      >
        Leave the first review
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
