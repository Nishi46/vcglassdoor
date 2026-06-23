import { getPublishedPartners } from "@/lib/airtable";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600;

export default async function HomePage() {
  const partners = await getPublishedPartners();
  return <HomeClient partners={partners} tallyUrl={process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? ""} />;
}
