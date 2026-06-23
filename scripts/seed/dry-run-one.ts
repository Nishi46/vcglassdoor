/**
 * End-to-end dry run for a single partner — no Airtable writes.
 * Run: npx tsx --env-file=.env.local scripts/seed/dry-run-one.ts "Marc Andreessen" "Andreessen Horowitz"
 */
import { fetchAllSignals } from "./fetch-all-signals";
import { extractSignals } from "./extract-signals";

async function main() {
  const name = process.argv[2] ?? "Paul Graham";
  const firm = process.argv[3] ?? "Y Combinator";

  console.log(`\nDry run: ${name} @ ${firm}\n`);

  console.log("Step 1: Fetching public signals...");
  const snippets = await fetchAllSignals(name, firm);
  const sources = [...new Set(snippets.map((s) => s.source))];
  console.log(`  ${snippets.length} snippets from: ${sources.join(", ") || "none"}`);

  console.log("\nStep 2: Extracting signals with Claude...");
  const result = await extractSignals(name, firm, snippets);
  console.log("  Result:", JSON.stringify(result, null, 2));

  console.log("\n--- Would write to Airtable ---");
  const payload = {
    ai_overall: result.ai_overall,
    ai_signals: JSON.stringify(result.signals),
    ai_source_count: snippets.length,
    ai_confidence: result.ai_confidence,
    ai_seeded: true,
  };
  console.log(JSON.stringify(payload, null, 2));
  console.log("\nDry run complete — no writes performed.");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
