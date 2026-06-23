/**
 * Smoke test for Airtable data access.
 * Run with: npx ts-node --env-file=.env.local scripts/test-airtable.ts
 */
import {
  getPublishedPartners,
  getPartnerBySlug,
  getReviewsForPartner,
  searchPartners,
  getAllPublishedPartnerSlugs,
} from "../lib/airtable";

async function main() {
  console.log("\n--- getPublishedPartners ---");
  const partners = await getPublishedPartners();
  console.log(`Found ${partners.length} published partners`);
  if (partners.length > 0) console.log("First:", partners[0]);

  if (partners.length > 0) {
    const first = partners[0];

    console.log(`\n--- getPartnerBySlug("${first.slug}") ---`);
    const partner = await getPartnerBySlug(first.slug);
    console.log(partner ?? "Not found");

    console.log(`\n--- getReviewsForPartner("${first.id}") ---`);
    const reviews = await getReviewsForPartner(first.id);
    console.log(`Found ${reviews.length} published reviews`);
    if (reviews.length > 0) console.log("First review:", reviews[0]);
  }

  console.log('\n--- searchPartners("sequoia") ---');
  const results = await searchPartners("sequoia");
  console.log(`Found ${results.length} results`);

  console.log("\n--- getAllPublishedPartnerSlugs ---");
  const slugs = await getAllPublishedPartnerSlugs();
  console.log("Slugs:", slugs);

  console.log("\nAll checks passed.");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
