/**
 * Generates and writes synthetic AI reviews for all partners.
 * Run: npx tsx --env-file=.env.local scripts/seed/seed-reviews.ts [--dry-run]
 *
 * - Partners with ai_confidence >= 0.5 get 2 reviews (different relationship types)
 * - Partners with ai_confidence < 0.5 get 1 review (conservative flat ratings)
 * - Skips partners that already have ai_generated reviews in the Reviews table
 * - Writes review-seed-log.jsonl with per-partner status
 */
import { appendFileSync, existsSync, writeFileSync } from "fs";
import {
  getAllPartnersForSeeding,
  getAiReviewsForPartner,
  createSyntheticReview,
} from "../../lib/airtable";
import { generateReview } from "./generate-reviews";
import type { Signal } from "./generate-reviews";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 1500;
const LOG_PATH = "scripts/seed/review-seed-log.jsonl";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (existsSync(LOG_PATH)) writeFileSync(LOG_PATH, "");

  console.log(`Fetching partners... DRY_RUN=${DRY_RUN}\n`);
  const partners = await getAllPartnersForSeeding();

  // Only process partners that have been AI-seeded with signals
  const seeded = partners.filter((p) => p.ai_seeded && (p.ai_overall ?? 0) > 0 || (p.ai_confidence ?? 0) >= 0);
  console.log(`${seeded.length} partners to process\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < partners.length; i++) {
    const p = partners[i];
    if (!p.name) {
      console.log(`[${i + 1}/${partners.length}] SKIP (no name): ${p.id}`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${partners.length}] ${p.name} @ ${p.firm}`);

    try {
      // Check if already has AI reviews
      const existing = await getAiReviewsForPartner(p.id);
      if (existing.length > 0) {
        console.log(`  SKIP (already has ${existing.length} AI review(s))`);
        skipped++;
        continue;
      }

      const confidence = p.ai_confidence ?? 0;
      const signals: Signal[] = p.ai_signals ? (JSON.parse(p.ai_signals) as Signal[]) : [];
      const reviewCount = confidence >= 0.5 ? 2 : 1;

      console.log(`  confidence=${confidence} signals=${signals.length} → generating ${reviewCount} review(s)`);

      for (let j = 0; j < reviewCount; j++) {
        const review = await generateReview(p.name, p.firm, signals, confidence, j);

        if (DRY_RUN) {
          console.log(`  [DRY RUN] Would write:`, JSON.stringify({
            partner: p.id,
            relationship: review.relationship,
            year: review.year,
            rating_overall: review.rating_overall,
            review_text: review.review_text.slice(0, 80) + "...",
          }));
        } else {
          const newId = await createSyntheticReview(p.id, review);
          console.log(`  Created review ${j + 1}/${reviewCount}: ${newId}`);
        }

        created++;
        if (j < reviewCount - 1) await sleep(500);
      }

      appendFileSync(
        LOG_PATH,
        JSON.stringify({
          id: p.id,
          name: p.name,
          firm: p.firm,
          status: "ok",
          reviews_created: reviewCount,
          dry_run: DRY_RUN,
          ts: new Date().toISOString(),
        }) + "\n"
      );
    } catch (err) {
      console.error(`  FAILED: ${err}`);
      appendFileSync(
        LOG_PATH,
        JSON.stringify({
          id: p.id,
          name: p.name,
          firm: p.firm,
          status: "error",
          error: String(err),
          dry_run: DRY_RUN,
          ts: new Date().toISOString(),
        }) + "\n"
      );
      failed++;
    }

    if (i < partners.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. reviews_created=${created} skipped=${skipped} failed=${failed}`);
  console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
