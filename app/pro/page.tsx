import type { Metadata } from "next";
import ProPageClient from "./ProPageClient";

export const metadata: Metadata = {
  title: "Founder Pro — VCGlassdoor",
  description:
    "Unlock AI-synthesized Backchannel Briefs, partner watchlists, and more. Join the Founder Pro waitlist.",
};

export default function ProPage() {
  return <ProPageClient />;
}
