/**
 * Seeds a single partner by Airtable record ID.
 * Run: npx tsx --env-file=.env.local scripts/seed/seed-one.ts <recordId> "<name>" "<firm>"
 */
import { fetchAllSignals } from "./fetch-all-signals";
import { extractSignals } from "./extract-signals";
import { updatePartnerAiSeed } from "../../lib/airtable";

async function main() {
  const [, , recordId, name, firm] = process.argv;
  if (!recordId || !name || !firm) {
    throw new Error('Usage: seed-one.ts <recordId> "<name>" "<firm>"');
  }

  console.log(`Seeding: ${name} @ ${firm} (${recordId})`);

  const snippets = await fetchAllSignals(name, firm);
  console.log(`Fetched ${snippets.length} snippets`);

  const result = await extractSignals(name, firm, snippets);
  console.log(`Score: ${result.ai_overall} | Confidence: ${result.ai_confidence} | Signals: ${result.signals.length}`);

  await updatePartnerAiSeed(recordId, {
    ai_overall: result.ai_overall,
    ai_signals: JSON.stringify(result.signals),
    ai_source_count: snippets.length,
    ai_confidence: result.ai_confidence,
    ai_seeded: true,
  });

  console.log("Written to Airtable successfully.");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
