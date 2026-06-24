import type { Metadata } from "next";
import { getPartnerBySlug } from "@/lib/airtable";
import SubmitFlow from "@/components/SubmitFlow";

export const metadata: Metadata = {
  title: "Leave a Review — VCGlassdoor",
  description: "Anonymously review a VC partner you pitched or raised from.",
};

interface Props {
  searchParams: Promise<{ partner?: string }>;
}

export default async function SubmitPage({ searchParams }: Props) {
  const { partner: partnerSlug } = await searchParams;

  let prefillPartner = null;
  if (partnerSlug) {
    const found = await getPartnerBySlug(partnerSlug);
    if (found) {
      prefillPartner = {
        id: found.id,
        name: found.name,
        firm: found.firm,
        title: found.title,
        slug: found.slug,
        photo_url: found.photo_url,
      };
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#030818" }}>
      <SubmitFlow prefillPartner={prefillPartner} />
    </main>
  );
}
