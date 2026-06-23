import { getAllPartnersForSeeding } from "../../lib/airtable";
import Airtable from "airtable";

async function main() {
  const partners = await getAllPartnersForSeeding();
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
  await base(process.env.AIRTABLE_PARTNERS_TABLE!).update(partners[0].id, {
    ai_seeded: false, ai_overall: 0, ai_source_count: 0, ai_confidence: 0, ai_signals: "",
  });
  console.log("Reset", partners[0].id);
}
main().catch(e => { console.error(e); process.exit(1); });
