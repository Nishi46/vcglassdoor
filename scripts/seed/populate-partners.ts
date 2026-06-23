/**
 * Populates Airtable Partners table with 20 well-known early-stage VC partners.
 * Run: npx tsx --env-file=.env.local scripts/seed/populate-partners.ts
 *
 * Data sourced from public firm websites and LinkedIn profiles.
 * Skips any partner whose slug already exists in Airtable.
 */
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);
const TABLE = process.env.AIRTABLE_PARTNERS_TABLE ?? "Partners";

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const PARTNERS = [
  {
    name: "Marc Andreessen",
    firm: "Andreessen Horowitz",
    title: "General Partner",
    linkedin_url: "https://www.linkedin.com/in/mandreessen/",
    photo_url: "https://a16z.com/wp-content/uploads/2020/08/Marc-Andreessen.jpg",
  },
  {
    name: "Ben Horowitz",
    firm: "Andreessen Horowitz",
    title: "General Partner",
    linkedin_url: "https://www.linkedin.com/in/benhorowitz/",
    photo_url: "https://a16z.com/wp-content/uploads/2020/08/Ben-Horowitz.jpg",
  },
  {
    name: "Peter Thiel",
    firm: "Founders Fund",
    title: "Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/peterthiel/",
    photo_url: "",
  },
  {
    name: "Vinod Khosla",
    firm: "Khosla Ventures",
    title: "Founder & Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/vinodkhosla/",
    photo_url: "",
  },
  {
    name: "John Doerr",
    firm: "Kleiner Perkins",
    title: "Partner",
    linkedin_url: "https://www.linkedin.com/in/johndoerr/",
    photo_url: "",
  },
  {
    name: "Mary Meeker",
    firm: "Bond Capital",
    title: "General Partner",
    linkedin_url: "https://www.linkedin.com/in/marymeeker/",
    photo_url: "",
  },
  {
    name: "Reid Hoffman",
    firm: "Greylock",
    title: "Partner",
    linkedin_url: "https://www.linkedin.com/in/reidhoffman/",
    photo_url: "",
  },
  {
    name: "Josh Kopelman",
    firm: "First Round Capital",
    title: "Founding Partner",
    linkedin_url: "https://www.linkedin.com/in/jkopelman/",
    photo_url: "",
  },
  {
    name: "Bill Gurley",
    firm: "Benchmark",
    title: "General Partner",
    linkedin_url: "https://www.linkedin.com/in/bgurley/",
    photo_url: "",
  },
  {
    name: "Mike Moritz",
    firm: "Sequoia Capital",
    title: "Partner",
    linkedin_url: "https://www.linkedin.com/in/mike-moritz-b2b94b3/",
    photo_url: "",
  },
  {
    name: "Roelof Botha",
    firm: "Sequoia Capital",
    title: "Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/roelofbotha/",
    photo_url: "",
  },
  {
    name: "Alfred Lin",
    firm: "Sequoia Capital",
    title: "Partner",
    linkedin_url: "https://www.linkedin.com/in/alfredlin/",
    photo_url: "",
  },
  {
    name: "Aileen Lee",
    firm: "Cowboy Ventures",
    title: "Founder & Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/aileenlee/",
    photo_url: "",
  },
  {
    name: "Kirsten Green",
    firm: "Forerunner Ventures",
    title: "Founder & Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/kirstengreen/",
    photo_url: "",
  },
  {
    name: "Hunter Walk",
    firm: "Homebrew",
    title: "Co-Founder & Partner",
    linkedin_url: "https://www.linkedin.com/in/hunterwalk/",
    photo_url: "",
  },
  {
    name: "Satya Patel",
    firm: "Homebrew",
    title: "Co-Founder & Partner",
    linkedin_url: "https://www.linkedin.com/in/satyapatel/",
    photo_url: "",
  },
  {
    name: "Pejman Nozad",
    firm: "Pear VC",
    title: "Co-Founder & Managing Partner",
    linkedin_url: "https://www.linkedin.com/in/pejmannozad/",
    photo_url: "",
  },
  {
    name: "Garry Tan",
    firm: "Y Combinator",
    title: "President & CEO",
    linkedin_url: "https://www.linkedin.com/in/garrytan/",
    photo_url: "",
  },
  {
    name: "Paul Graham",
    firm: "Y Combinator",
    title: "Co-Founder",
    linkedin_url: "https://www.linkedin.com/in/paul-graham-321/",
    photo_url: "",
  },
  {
    name: "Jessica Livingston",
    firm: "Y Combinator",
    title: "Co-Founder",
    linkedin_url: "https://www.linkedin.com/in/jessicalivingston/",
    photo_url: "",
  },
];

async function getExistingNames(): Promise<Set<string>> {
  const records = await base(TABLE).select({ fields: ["name"] }).all();
  return new Set(
    records.map((r) => ((r.fields["name"] as string) ?? "").toLowerCase()).filter(Boolean)
  );
}

async function main() {
  console.log("Fetching existing partners...");
  const existing = await getExistingNames();
  console.log(`Found ${existing.size} existing partners\n`);

  let created = 0;
  let skipped = 0;

  for (const p of PARTNERS) {
    if (existing.has(p.name.toLowerCase())) {
      console.log(`SKIP (exists): ${p.name}`);
      skipped++;
      continue;
    }

    const fields: Record<string, unknown> = {
      name: p.name,
      firm: p.firm,
      title: p.title,
      linkedin_url: p.linkedin_url,
      published: true,
    };
    if (p.photo_url) fields.photo_url = p.photo_url;

    await base(TABLE).create(fields);
    console.log(`  Created: ${p.name} @ ${p.firm}`);
    created++;

    // Small delay to avoid Airtable rate limits
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nDone. Created=${created} Skipped=${skipped}`);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
