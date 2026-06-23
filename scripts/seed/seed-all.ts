/**
 * Bulk seeder — reads partners.csv, seeds each partner with rate limiting.
 * Run: npx tsx --env-file=.env.local scripts/seed/seed-all.ts [--dry-run]
 *
 * Skips partners that already have ai_seeded=true in partners.csv.
 * Writes seed-log.jsonl with per-partner status for resume support.
 */
import { readFileSync, appendFileSync, existsSync, writeFileSync } from "fs";
import { fetchAllSignals } from "./fetch-all-signals";
import { extractSignals } from "./extract-signals";
import { updatePartnerAiSeed } from "../../lib/airtable";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 2000;
const CSV_PATH = "scripts/seed/partners.csv";
const LOG_PATH = "scripts/seed/seed-log.jsonl";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`${CSV_PATH} not found — run build-partner-list.ts first`);
  }

  const csv = readFileSync(CSV_PATH, "utf-8");
  const rows = csv.split("\n").slice(1).filter(Boolean);

  if (existsSync(LOG_PATH)) {
    writeFileSync(LOG_PATH, ""); // reset log on each run
  }

  console.log(`Seeding ${rows.length} partners. DRY_RUN=${DRY_RUN}\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    // CSV: id,name,firm,slug,ai_seeded
    const parts = rows[i].split(",");
    const id = parts[0].trim();
    const name = JSON.parse(parts[1]);
    const firm = JSON.parse(parts[2]);
    const alreadySeeded = parts[4]?.trim() === "true";

    if (alreadySeeded) {
      console.log(`[${i + 1}/${rows.length}] SKIP (already seeded): ${name}`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${rows.length}] ${name} @ ${firm}`);

    try {
      const snippets = await fetchAllSignals(name, firm);
      const result = await extractSignals(name, firm, snippets);

      const payload = {
        ai_overall: result.ai_overall,
        ai_signals: JSON.stringify(result.signals),
        ai_source_count: snippets.length,
        ai_confidence: result.ai_confidence,
        ai_seeded: true,
      };

      if (!DRY_RUN) {
        await updatePartnerAiSeed(id, payload);
      }

      appendFileSync(
        LOG_PATH,
        JSON.stringify({
          id, name, firm, status: "ok",
          ai_overall: result.ai_overall,
          ai_confidence: result.ai_confidence,
          snippet_count: snippets.length,
          signal_count: result.signals.length,
          dry_run: DRY_RUN,
          ts: new Date().toISOString(),
        }) + "\n"
      );

      console.log(`  score=${result.ai_overall} confidence=${result.ai_confidence} snippets=${snippets.length}`);
      ok++;
    } catch (err) {
      console.error(`  FAILED: ${err}`);
      appendFileSync(
        LOG_PATH,
        JSON.stringify({
          id, name, firm, status: "error",
          error: String(err),
          dry_run: DRY_RUN,
          ts: new Date().toISOString(),
        }) + "\n"
      );
      failed++;
    }

    if (i < rows.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
  console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
