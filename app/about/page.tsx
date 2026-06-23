import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — VCGlassdoor",
  description: "How VCGlassdoor works: verified anonymous reviews of VC partners from founders who've pitched and raised from them.",
};

export default function AboutPage() {
  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit";

  return (
    <div style={{ background: "linear-gradient(180deg, #030818 0%, #060f24 100%)", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, #2563eb, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd" }}>
            About VCGlassdoor
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
            The open secret,<br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              finally on record.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            A verified reputation layer for the venture capital market — built
            by and for the founders who live with these decisions.
          </p>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase mb-10" style={{ color: "rgba(96,165,250,0.5)" }}>
            The process
          </div>
          <div className="space-y-1">
            {[
              {
                n: "01",
                title: "Submit a verified review",
                body: "You upload a screenshot or PDF of your email thread, calendar invite, or cap table doc as proof you actually interacted with the partner. We manually check it before anything publishes.",
                color: "#3b82f6",
              },
              {
                n: "02",
                title: "We verify your evidence",
                body: "Our team reviews the uploaded document. Your name and company are always redacted and never stored alongside your review.",
                color: "#8b5cf6",
              },
              {
                n: "03",
                title: "Reviews publish at 3+",
                body: "A review only goes live once 3 or more verified reviews exist for the same partner. This is the anonymity threshold — with fewer, a VC could trivially identify who wrote it.",
                color: "#10b981",
              },
            ].map(({ n, title, body, color }) => (
              <div key={n} className="group flex gap-8 items-start py-8 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="text-5xl font-black shrink-0 tabular-nums w-16 text-right"
                  style={{ color: "rgba(255,255,255,0.08)" }}>{n}</div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <h3 className="font-bold text-white text-lg">{title}</h3>
                  </div>
                  <p className="text-white/45 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anonymity callout */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.15))",
              border: "1px solid rgba(96,165,250,0.2)",
            }}>
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)" }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(37,99,235,0.3)", border: "1px solid rgba(96,165,250,0.3)" }}>
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Anonymity is non-negotiable</h2>
              <p className="text-white/60 leading-relaxed max-w-xl">
                Reviews only go live once 3 or more exist for the same partner. If only
                one review exists, a VC can trivially identify who wrote it. We will never
                publish a lone review — this is structural, not a promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we rate */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-semibold tracking-[0.25em] uppercase mb-10" style={{ color: "rgba(96,165,250,0.5)" }}>
            Dimensions rated
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Responsiveness", desc: "Did they reply? How fast? Did they ghost mid-process?", n: "01" },
              { label: "Behavior in the room", desc: "Present, respectful, engaged — or distracted?", n: "02" },
              { label: "Founder-friendliness", desc: "How did they behave when the company hit a rough patch?", n: "03" },
              { label: "Term sheet match", desc: "Did the final docs reflect what was discussed?", n: "04" },
            ].map(({ label, desc, n }) => (
              <div key={n} className="p-6 rounded-2xl group hover:border-blue-500/30 transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-mono text-white/20 mb-3">{n}</div>
                <p className="font-bold text-white mb-1.5">{label}</p>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business model */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-xl font-bold text-white mb-3">Always free for founders</h2>
            <p className="text-white/50 leading-relaxed mb-3">
              Founders are the supply that makes the data valuable. Charging them kills the product.
              Browsing and leaving reviews is always free.
            </p>
            <p className="text-white/35 leading-relaxed">
              Revenue comes from the institutional layer — LPs, funds of funds, and
              accelerators who pay for aggregated reputation data.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-white/35 text-sm mb-5">Have you pitched or raised from a VC partner?</p>
          <a
            href={tallyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: "white",
              boxShadow: "0 0 30px rgba(37,99,235,0.35)",
            }}
          >
            Leave a verified review
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}
