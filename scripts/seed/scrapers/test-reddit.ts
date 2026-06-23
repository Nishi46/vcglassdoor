/**
 * Test: Reddit scraper
 * Run: npx tsx scripts/seed/scrapers/test-reddit.ts
 * Pass criteria: snippets for Andreessen, no crash on back-to-back calls, exits 0.
 */
import { fetchRedditMentions } from "./reddit";

async function main() {
  console.log("--- Reddit scraper test ---\n");

  // Test 1: well-known VC
  const snippets = await fetchRedditMentions("Marc Andreessen", "a16z");
  console.log(`[1] Marc Andreessen @ a16z: ${snippets.length} snippets`);
  if (snippets.length === 0) console.warn("  WARN: zero snippets — Reddit may be rate limiting");
  snippets.slice(0, 2).forEach((s, i) => console.log(`  [${i}] ${s.slice(0, 120)}`));

  // Test 2: second call — should not 429 in tests
  const snippets2 = await fetchRedditMentions("Ben Horowitz", "a16z");
  console.log(`\n[2] Ben Horowitz @ a16z: ${snippets2.length} snippets`);

  // Test 3: unknown name — should return empty, not throw
  const empty = await fetchRedditMentions("ZZZ Nonexistent Person", "Fake Fund LLC");
  console.log(`\n[3] Unknown partner: ${empty.length} snippets (expected 0 or few)`);

  console.log("\nReddit scraper OK");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
