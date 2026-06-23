/**
 * Test: Claude signal extractor
 * Run: npx tsx --env-file=.env.local scripts/seed/test-extract.ts
 * Pass criteria: 3 assertions pass, exits 0.
 */
import { extractSignals } from "./extract-signals";

async function main() {
  console.log("--- Claude signal extractor test ---\n");

  // Test 1: clear positive signals — expect non-zero score
  console.log("[1] Real signal (positive)...");
  const r1 = await extractSignals("Paul Graham", "Y Combinator", [
    { text: "Paul Graham was incredibly responsive during the YC process. Replied within hours every time.", source: "hn" },
    { text: "PG is known for being direct and honest, even when the feedback is hard to hear as a founder.", source: "reddit" },
    { text: "One of the most founder-friendly investors I've encountered. Genuinely cares about the company.", source: "hn" },
  ]);
  console.log(`   ai_overall=${r1.ai_overall} ai_confidence=${r1.ai_confidence} signals=${r1.signals.length}`);
  if (r1.ai_overall === 0) throw new Error("Test 1 FAIL: expected non-zero score for clear positive signal");
  if (!Array.isArray(r1.signals)) throw new Error("Test 1 FAIL: signals must be array");
  if (r1.signals.length === 0) throw new Error("Test 1 FAIL: expected at least 1 signal");
  console.log("   PASS");

  // Test 2: empty snippets → zeros, no API call
  console.log("\n[2] Empty snippets...");
  const r2 = await extractSignals("Nobody Nonexistent", "Fake Fund", []);
  console.log(`   ai_overall=${r2.ai_overall} ai_confidence=${r2.ai_confidence}`);
  if (r2.ai_overall !== 0) throw new Error("Test 2 FAIL: expected 0 for empty snippets");
  if (r2.signals.length !== 0) throw new Error("Test 2 FAIL: expected empty signals array");
  console.log("   PASS");

  // Test 3: off-topic snippets → low confidence
  console.log("\n[3] Off-topic snippets...");
  const r3 = await extractSignals("John Smith", "Obscure Ventures", [
    { text: "I went to the farmers market and bought some really nice tomatoes today.", source: "reddit" },
    { text: "The weather in San Francisco was unusually warm this morning.", source: "hn" },
  ]);
  console.log(`   ai_overall=${r3.ai_overall} ai_confidence=${r3.ai_confidence}`);
  if (r3.ai_confidence > 0.4) throw new Error(`Test 3 FAIL: expected low confidence for off-topic snippets, got ${r3.ai_confidence}`);
  console.log("   PASS");

  console.log("\nAll extract-signals tests passed ✓");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
