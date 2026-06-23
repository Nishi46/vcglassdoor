/**
 * Test: Airtable write round-trip
 * Run: npx tsx --env-file=.env.local scripts/seed/test-write.ts
 * Pass criteria: writes test values to first partner, exits 0.
 * NOTE: Requires the 5 AI fields to exist in Airtable (see Step 0 in the plan).
 * After this test, manually reset ai_seeded=false and clear other ai_ fields.
 */
import { getAllPartnersForSeeding, updatePartnerAiSeed } from "../../lib/airtable";

async function main() {
  const partners = await getAllPartnersForSeeding();
  console.log(`Found ${partners.length} total partners`);
  if (partners.length === 0) throw new Error("No partners found in Airtable");

  const first = partners[0];
  console.log(`Writing test seed to: "${first.name || "(unnamed)"}" (${first.id})`);

  await updatePartnerAiSeed(first.id, {
    ai_overall: 3.5,
    ai_signals: JSON.stringify([{ type: "neutral", text: "Test signal — safe to delete", source: "hn" }]),
    ai_source_count: 1,
    ai_confidence: 0.5,
    ai_seeded: true,
  });

  console.log("Write succeeded. Check Airtable to confirm fields updated.");
  console.log("IMPORTANT: After confirming, reset ai_seeded=false and clear ai_ fields on this record.");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
