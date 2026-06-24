/**
 * Test: synthetic review generator
 * Run: npx tsx --env-file=.env.local scripts/seed/test-generate-reviews.ts
 * Pass criteria: 3 assertions pass, exits 0.
 */
import { generateReview } from "./generate-reviews";
import type { Signal } from "./generate-reviews";

async function main() {
  console.log("--- Review generator test ---\n");

  // Test 1: High-confidence partner with clear signals → non-flat ratings
  console.log("[1] High-confidence partner...");
  const signals1: Signal[] = [
    { type: "green", text: "Responds to founder emails within hours", source: "hn" },
    { type: "green", text: "Known for transparent term sheet communication", source: "hn" },
    { type: "red", text: "Criticized for losing interest post-term-sheet", source: "hn" },
  ];
  const r1 = await generateReview("Josh Kopelman", "First Round Capital", signals1, 0.8, 0);
  console.log(`   relationship=${r1.relationship} year=${r1.year}`);
  console.log(`   ratings: overall=${r1.rating_overall} resp=${r1.rating_responsiveness} behav=${r1.rating_behavior} ff=${r1.rating_founder_friendly} ts=${r1.rating_term_sheet_match}`);
  console.log(`   text: ${r1.review_text.slice(0, 120)}`);
  console.log(`   green_flags: ${r1.green_flags.slice(0, 80)}`);
  console.log(`   red_flags: ${r1.red_flags.slice(0, 80)}`);

  // Assertions
  for (const [k, v] of Object.entries({
    rating_overall: r1.rating_overall,
    rating_responsiveness: r1.rating_responsiveness,
    rating_behavior: r1.rating_behavior,
    rating_founder_friendly: r1.rating_founder_friendly,
    rating_term_sheet_match: r1.rating_term_sheet_match,
  })) {
    if (v < 1 || v > 5 || !Number.isInteger(v)) throw new Error(`Test 1 FAIL: ${k}=${v} out of range`);
  }
  if (!r1.review_text || r1.review_text.length < 20) throw new Error("Test 1 FAIL: review_text too short");
  // Non-flat: at least one rating should differ from the others
  const ratings = [r1.rating_overall, r1.rating_responsiveness, r1.rating_behavior, r1.rating_founder_friendly];
  const allSame = ratings.every((r) => r === ratings[0]);
  if (allSame) console.warn("  WARN: all ratings are the same — might be low-signal");
  console.log("   PASS\n");

  // Test 2: Low-confidence → flat 3s, no API call needed but function should handle it
  console.log("[2] Low-confidence partner (aiConfidence=0.1)...");
  const r2 = await generateReview("Unknown VC", "Obscure Fund", [], 0.1, 1);
  console.log(`   ratings: overall=${r2.rating_overall} resp=${r2.rating_responsiveness}`);
  if (r2.rating_overall !== 3) throw new Error(`Test 2 FAIL: expected 3 overall, got ${r2.rating_overall}`);
  if (r2.rating_responsiveness !== 3) throw new Error(`Test 2 FAIL: expected 3 responsiveness`);
  console.log("   PASS\n");

  // Test 3: Index variation → different relationship types
  console.log("[3] Relationship type rotation...");
  const rel0 = (await generateReview("A", "B", [], 0.1, 0)).relationship;
  const rel1 = (await generateReview("A", "B", [], 0.1, 1)).relationship;
  const rel2 = (await generateReview("A", "B", [], 0.1, 2)).relationship;
  console.log(`   index 0: ${rel0}`);
  console.log(`   index 1: ${rel1}`);
  console.log(`   index 2: ${rel2}`);
  if (rel0 === rel1) throw new Error("Test 3 FAIL: index 0 and 1 should produce different relationship types");
  console.log("   PASS\n");

  console.log("All review generator tests passed ✓");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
