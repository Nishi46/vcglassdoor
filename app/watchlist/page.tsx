import { getSessionId } from "@/lib/session";
import { getWatchlist } from "@/lib/airtable";
import PartnerCard from "@/components/PartnerCard";
import WatchlistEmailForm from "./WatchlistEmailForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Watchlist — VCGlassdoor",
  description: "Partners you're tracking. Get notified when new reviews appear.",
};

export default async function WatchlistPage() {
  const sessionId = await getSessionId();
  const partners = sessionId ? await getWatchlist(sessionId) : [];

  return (
    <div style={{ background: "#030818", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#759fbc" }}>
              Founder Pro
            </p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.025em" }}>
              My Watchlist
            </h1>
          </div>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all"
            style={{ color: "#90c3c8", border: "1px solid rgba(144,195,200,0.2)", background: "rgba(31,86,115,0.08)" }}
          >
            + Add partners
          </Link>
        </div>

        {partners.length === 0 ? (
          <EmptyState hasSession={!!sessionId} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {partners.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>

            {/* Email notification opt-in */}
            {sessionId && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(10,22,36,0.8)",
                  border: "1px solid rgba(117,159,188,0.18)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(31,86,115,0.2)", border: "1px solid rgba(117,159,188,0.2)" }}
                  >
                    <svg className="w-4 h-4" style={{ color: "#90c3c8" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">Get notified about new reviews</p>
                    <p className="text-xs mb-4" style={{ color: "rgba(117,159,188,0.65)" }}>
                      We&apos;ll email you when any partner on your watchlist receives a new verified review.
                    </p>
                    <WatchlistEmailForm sessionId={sessionId} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasSession }: { hasSession: boolean }) {
  return (
    <div
      className="text-center py-24 rounded-3xl border border-dashed"
      style={{ borderColor: "rgba(117,159,188,0.15)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
        style={{ background: "rgba(31,86,115,0.12)", border: "1px solid rgba(117,159,188,0.2)" }}
      >
        <svg className="w-7 h-7" style={{ color: "#759fbc" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </div>
      <p className="text-white font-semibold mb-2">
        {hasSession ? "No partners saved yet" : "Your watchlist is empty"}
      </p>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "rgba(117,159,188,0.6)" }}>
        Click the bookmark icon on any partner card or profile to save them here.
      </p>
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all"
        style={{ color: "#90c3c8", border: "1px solid rgba(144,195,200,0.25)", background: "rgba(31,86,115,0.08)" }}
      >
        Browse partners
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
