/**
 * Exports all partners from Airtable to a CSV for the seeding pipeline.
 * Run: npx tsx --env-file=.env.local scripts/seed/build-partner-list.ts
 */
import { writeFileSync } from "fs";
import { getAllPartnersForSeeding } from "../../lib/airtable";

async function main() {
  const partners = await getAllPartnersForSeeding();
  const rows = partners.map(
    (p) => `${p.id},${JSON.stringify(p.name)},${JSON.stringify(p.firm)},${p.slug},${p.ai_seeded ? "true" : "false"}`
  );
  const csv = ["id,name,firm,slug,ai_seeded", ...rows].join("\n");
  writeFileSync("scripts/seed/partners.csv", csv, "utf-8");
  console.log(`Wrote ${partners.length} partners to scripts/seed/partners.csv`);
  const alreadySeeded = partners.filter((p) => p.ai_seeded).length;
  if (alreadySeeded > 0) {
    console.log(`Note: ${alreadySeeded} partners already have ai_seeded=true (seed-all.ts will skip them)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
