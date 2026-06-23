/**
 * Test: fetch-all-signals combiner
 * Run: npx tsx scripts/seed/test-fetch-all.ts (no env needed)
 * Pass criteria: exits 0 even if one source fails, sources labeled correctly.
 */
import { fetchAllSignals } from "./fetch-all-signals";

async function main() {
  console.log("--- fetch-all-signals test ---\n");

  // Test 1: real partner — at least HN should return snippets
  console.log("[1] Fetching Marc Andreessen @ Andreessen Horowitz...");
  const s1 = await fetchAllSignals("Marc Andreessen", "Andreessen Horowitz");
  console.log(`   Total snippets: ${s1.length}`);
  const sources = [...new Set(s1.map((s) => s.source))];
  console.log(`   Sources represented: ${sources.join(", ") || "none"}`);
  s1.slice(0, 2).forEach((s, i) => console.log(`   [${i}] (${s.source}) ${s.text.slice(0, 100)}`));

  // Test 2: unknown partner — should exit 0 with 0 snippets, no crash
  console.log("\n[2] Unknown partner...");
  const s2 = await fetchAllSignals("ZZZ Nonexistent Person", "Fake Fund LLC");
  console.log(`   Snippets: ${s2.length} (expected 0 or few)`);

  // Test 3: all snippets have source label
  const unlabeled = s1.filter((s) => s.source !== "hn" && s.source !== "reddit");
  if (unlabeled.length > 0) throw new Error(`Test 3 FAIL: ${unlabeled.length} snippets have unknown source`);
  console.log("\n[3] All snippets labeled correctly — PASS");

  console.log("\nfetch-all-signals OK");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
