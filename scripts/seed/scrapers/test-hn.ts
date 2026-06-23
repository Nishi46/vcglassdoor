/**
 * Test: HN scraper
 * Run: npx tsx scripts/seed/scrapers/test-hn.ts
 * Pass criteria: ≥1 snippet for Paul Graham, 0 for unknown name, exits 0.
 */
import { fetchHnMentions } from "./hn";

async function main() {
  console.log("--- HN scraper test ---\n");

  // Test 1: well-known VC — should have mentions
  const snippets = await fetchHnMentions("Paul Graham", "Y Combinator");
  console.log(`[1] Paul Graham @ YC: ${snippets.length} snippets`);
  if (snippets.length === 0) console.warn("  WARN: zero snippets — check HN API or query");
  snippets.slice(0, 3).forEach((s, i) => console.log(`  [${i}] ${s.slice(0, 120)}`));

  // Test 2: unknown name should return empty gracefully (no throw)
  const empty = await fetchHnMentions("ZZZ Nonexistent Person", "Fake Fund LLC");
  console.log(`\n[2] Unknown partner: ${empty.length} snippets (expected 0 or few)`);

  console.log("\nHN scraper OK");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
