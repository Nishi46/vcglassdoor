import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — VCGlassdoor",
  description:
    "How VCGlassdoor works: verified anonymous reviews of VC partners from founders who've pitched and raised from them.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">How it works</h1>
      <p className="text-gray-500 mb-10">
        A verified reputation layer for the VC market.
      </p>

      <div className="space-y-10 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">The problem</h2>
          <p className="leading-relaxed">
            Everyone in the startup ecosystem privately knows which partners ghost,
            which firms re-trade signed term sheets, and which
            &ldquo;founder-friendly&rdquo; funds disappear the moment a company wobbles.
            Nobody says it out loud — because the person you&apos;d be calling out is the
            same person you&apos;ll be pitching again in 18 months.
          </p>
          <p className="leading-relaxed mt-3">
            Getting the wrong name on your cap table is an existential risk, and yet
            there is still no system of record warning you who&apos;s a nightmare before
            you sign.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What we built</h2>
          <p className="leading-relaxed">
            VCGlassdoor is a platform where founders anonymously review and rate the
            firms and individual partners they&apos;ve pitched or raised from — verified,
            aggregated, and always free for founders to use.
          </p>
          <p className="leading-relaxed mt-3">
            We rate partners on: responsiveness, behaviour in the room,
            founder-friendliness when things go sideways, and whether the final term
            sheet matched the handshake.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Verification</h2>
          <p className="leading-relaxed">
            Anyone can write anything. We verify that reviewers actually met or raised
            from the partner they&apos;re reviewing. When you submit a review, you upload a
            screenshot or PDF of your email thread, calendar invite, or cap table doc.
            We manually check it before publishing.
          </p>
          <p className="leading-relaxed mt-3">
            Your name and company are always redacted from verification materials. They
            are never stored alongside your review.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Anonymity — a non-negotiable rule
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <p className="font-medium text-gray-900 mb-1">
              Reviews only go live once 3 or more exist for the same partner.
            </p>
            <p className="text-sm text-gray-600">
              This is our single most important protection. If only one review exists,
              the VC can trivially identify who wrote it. By requiring at least 3, we
              make de-anonymization dramatically harder. We will never publish a
              lone review, no matter how credible.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What we rate</h2>
          <ul className="space-y-2 text-sm">
            {[
              ["Responsiveness", "Did they reply? How fast? Did they ghost mid-process?"],
              ["Behavior in the room", "Were they present, respectful, and engaged?"],
              ["Founder-friendliness", "How did they behave when things got hard?"],
              ["Term sheet match", "Did the final docs reflect what was discussed?"],
            ].map(([label, desc]) => (
              <li key={label} className="flex gap-3">
                <span className="font-medium text-gray-800 w-48 shrink-0">{label}</span>
                <span className="text-gray-500">{desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Business model</h2>
          <p className="leading-relaxed">
            Founders are the supply that makes the data valuable. We will never charge
            founders — browsing and leaving reviews is always free. Revenue comes from
            the institutional layer: LPs, funds of funds, and accelerators who pay for
            aggregated reputation data. Founders are the product. Charging them kills the
            product.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link
          href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
        >
          Leave a verified review →
        </Link>
      </div>
    </div>
  );
}
