/**
 * Creates Airtable records for the 300 popular VC partners static list.
 * Skips any partner whose name already exists in Airtable.
 * Run: npx tsx --env-file=.env.local scripts/seed/populate-popular-partners.ts
 */
import Airtable from "airtable";
import { POPULAR_PARTNERS } from "../../lib/popular-partners";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);
const TABLE = process.env.AIRTABLE_PARTNERS_TABLE ?? "Partners";

async function getExistingNames(): Promise<Set<string>> {
  const records = await base(TABLE).select({ fields: ["name"] }).all();
  return new Set(
    records.map((r) => ((r.fields["name"] as string) ?? "").toLowerCase()).filter(Boolean)
  );
}

async function main() {
  console.log("Fetching existing partner names...");
  const existing = await getExistingNames();
  console.log(`Found ${existing.size} existing partners\n`);

  const toCreate = POPULAR_PARTNERS.filter((p) => !existing.has(p.name.toLowerCase()));
  console.log(`Will create ${toCreate.length} new partners (skipping ${POPULAR_PARTNERS.length - toCreate.length} already present)\n`);

  let created = 0;
  let failed = 0;

  for (const p of toCreate) {
    try {
      await base(TABLE).create({
        name: p.name,
        firm: p.firm,
        title: p.title,
        published: true,
      } as Airtable.FieldSet);
      console.log(`  ✓ ${p.name} @ ${p.firm}`);
      created++;
    } catch (err) {
      console.error(`  ✗ ${p.name}: ${err}`);
      failed++;
    }
    // Respect Airtable rate limit (~5 req/s)
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nDone. Created=${created} Skipped=${POPULAR_PARTNERS.length - toCreate.length} Failed=${failed}`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
