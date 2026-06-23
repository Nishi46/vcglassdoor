import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — VCGlassdoor",
  description:
    "How VCGlassdoor works: verified anonymous reviews of VC partners from founders who've pitched and raised from them.",
};

const ratings = [
  {
    label: "Responsiveness",
    desc: "Did they reply? How fast? Did they ghost mid-process?",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Behavior in the room",
    desc: "Were they present, respectful, and engaged during the meeting?",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    color: "text-violet-600 bg-violet-50",
  },
  {
    label: "Founder-friendliness",
    desc: "How did they behave when the company hit a rough patch?",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Term sheet match",
    desc: "Did the final docs reflect what was discussed and agreed on?",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "text-amber-600 bg-amber-50",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          About VCGlassdoor
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          The open secret,<br />finally on record.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
          A verified reputation layer for the venture capital market — built
          by and for the founders who live with these decisions.
        </p>
      </div>

      {/* Problem */}
      <section className="mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">The problem</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Everyone in the startup ecosystem privately knows which partners ghost,
            which firms re-trade signed term sheets, and which &ldquo;founder-friendly&rdquo;
            funds disappear the moment a company wobbles.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nobody says it out loud — because the person you&apos;d be calling out is the
            same person you&apos;ll be pitching again in 18 months. Getting the wrong name on
            your cap table is an existential risk, and yet there is still no system of
            record warning you who&apos;s a nightmare before you sign.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">How it works</h2>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Submit a verified review",
              body: "You upload a screenshot or PDF of your email thread, calendar invite, or cap table doc as proof you actually interacted with the partner. We manually check it before anything publishes.",
              color: "bg-blue-600",
            },
            {
              step: "02",
              title: "We verify your evidence",
              body: "Our team reviews the uploaded document. Your name and company are always redacted and never stored alongside your review. If your evidence checks out, we mark the review as verified.",
              color: "bg-blue-600",
            },
            {
              step: "03",
              title: "Reviews publish at 3+",
              body: "A review only goes live once 3 or more verified reviews exist for the same partner. This is the anonymity threshold — with fewer, a VC could trivially identify who wrote it.",
              color: "bg-blue-600",
            },
          ].map(({ step, title, body, color }) => (
            <div key={step} className="flex gap-5 bg-white border border-gray-200 rounded-2xl p-6">
              <div className={`w-8 h-8 rounded-lg ${color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anonymity callout */}
      <section className="mb-12">
        <div className="bg-blue-600 rounded-2xl p-7 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-2">Anonymity is non-negotiable</h2>
              <p className="text-blue-100 leading-relaxed text-sm mb-3">
                Reviews only go live once 3 or more exist for the same partner. If only
                one review exists, a VC can trivially identify who wrote it. We will never
                publish a lone review, no matter how credible.
              </p>
              <p className="text-blue-100 leading-relaxed text-sm">
                This is stated publicly so founders know the protection is structural,
                not a promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we rate */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">What we rate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ratings.map(({ label, desc, icon, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business model */}
      <section className="mb-12 bg-gray-50 border border-gray-200 rounded-2xl p-7">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Always free for founders</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Founders are the supply that makes the data valuable. Charging them kills the
          product. Browsing and leaving reviews is always free.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Revenue comes from the institutional layer — LPs, funds of funds, and
          accelerators who pay for aggregated reputation data. The founders are the
          product. The data product sells to the people who profit from the venture machine.
        </p>
      </section>

      {/* CTA */}
      <div className="text-center py-10 border-t border-gray-100">
        <p className="text-gray-500 mb-5 text-sm">
          Have you pitched or raised from a VC partner?
        </p>
        <Link
          href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          Leave a verified review
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
