import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ClientShell from "@/components/ClientShell";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "VCGlassdoor — Verified VC Partner Reviews",
  description:
    "Anonymous, verified reviews of VC partners from the founders who've pitched and raised from them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tallyUrl = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "";

  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          background: "#030818",
          color: "white",
          cursor: "none",
        }}
      >
        <ClientShell>
          <Nav tallyUrl={tallyUrl} />
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(3,8,24,0.98)",
            }}
          >
            <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">VCGlassdoor</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>The open secret, finally on record.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-5 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                <a href="/about" className="hover:text-white transition-colors">How it works</a>
                <a href={tallyUrl || "/submit"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Leave a review</a>
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </footer>
        </ClientShell>
      </body>
    </html>
  );
}
