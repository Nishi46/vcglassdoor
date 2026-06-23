import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "VCGlassdoor — Verified VC Partner Reviews",
  description:
    "Anonymous, verified reviews of VC partners from the founders who've pitched and raised from them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 tracking-tight">
              VCGlassdoor
            </Link>
            <nav className="flex items-center gap-5 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "/submit"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Leave a review
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} VCGlassdoor</p>
            <p className="text-center">
              Reviews publish only when 3+ exist for a partner — protecting your anonymity.
            </p>
            <Link href="/about" className="hover:text-gray-600 transition-colors">
              How it works
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
