import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE ?? "Partners";
const REVIEWS = process.env.AIRTABLE_REVIEWS_TABLE ?? "Reviews";

export interface Partner {
  id: string;
  name: string;
  firm: string;
  title: string;
  slug: string;
  linkedin_url: string;
  photo_url: string;
  avg_overall: number;
  review_count: number;
}

export interface Review {
  id: string;
  relationship: string;
  year: number;
  rating_overall: number;
  rating_responsiveness: number;
  rating_behavior: number;
  rating_founder_friendly: number;
  rating_term_sheet_match: number;
  review_text: string;
  green_flags: string;
  red_flags: string;
}

function toPartner(record: Airtable.Record<Airtable.FieldSet>): Partner {
  const f = record.fields;
  return {
    id: record.id,
    name: (f["name"] as string) ?? "",
    firm: (f["firm"] as string) ?? "",
    title: (f["title"] as string) ?? "",
    slug: (f["slug"] as string) ?? "",
    linkedin_url: (f["linkedin_url"] as string) ?? "",
    photo_url: (f["photo_url"] as string) ?? "",
    avg_overall: Number.isFinite(f["avg_overall"] as number) ? (f["avg_overall"] as number) : 0,
    review_count: (f["review_count"] as number) ?? 0,
  };
}

function toReview(record: Airtable.Record<Airtable.FieldSet>): Review {
  const f = record.fields;
  return {
    id: record.id,
    relationship: (f["relationship"] as string) ?? "",
    year: (f["year"] as number) ?? 0,
    rating_overall: (f["rating_overall"] as number) ?? 0,
    rating_responsiveness: (f["rating_responsiveness"] as number) ?? 0,
    rating_behavior: (f["rating_behavior"] as number) ?? 0,
    rating_founder_friendly: (f["rating_founder_friendly"] as number) ?? 0,
    rating_term_sheet_match: (f["rating_term_sheet_match"] as number) ?? 0,
    review_text: (f["review_text"] as string) ?? "",
    green_flags: (f["green_flags"] as string) ?? "",
    red_flags: (f["red_flags"] as string) ?? "",
  };
}

export async function getPublishedPartners(): Promise<Partner[]> {
  const records = await base(PARTNERS)
    .select({
      filterByFormula: "{published} = 1",
      fields: [
        "name",
        "firm",
        "title",
        "slug",
        "linkedin_url",
        "photo_url",
        "avg_overall",
        "review_count",
      ],
      sort: [{ field: "avg_overall", direction: "desc" }],
    })
    .all();
  return records.map(toPartner);
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  const records = await base(PARTNERS)
    .select({
      filterByFormula: `AND({published} = 1, {slug} = "${slug}")`,
      fields: [
        "name",
        "firm",
        "title",
        "slug",
        "linkedin_url",
        "photo_url",
        "avg_overall",
        "review_count",
      ],
      maxRecords: 1,
    })
    .all();
  return records.length > 0 ? toPartner(records[0]) : null;
}

export async function getReviewsForPartner(partnerId: string): Promise<Review[]> {
  const records = await base(REVIEWS)
    .select({
      filterByFormula: `AND({published} = 1, FIND("${partnerId}", ARRAYJOIN({partner})))`,
      fields: [
        "relationship",
        "year",
        "rating_overall",
        "rating_responsiveness",
        "rating_behavior",
        "rating_founder_friendly",
        "rating_term_sheet_match",
        "review_text",
        "green_flags",
        "red_flags",
      ],
      sort: [{ field: "year", direction: "desc" }],
    })
    .all();

  // Safety net: never surface reviews if fewer than 3 exist
  if (records.length < 3) {
    if (records.length > 0) {
      console.warn(
        `Partner ${partnerId} has ${records.length} published review(s) but minimum is 3 — suppressing.`
      );
    }
    return [];
  }

  return records.map(toReview);
}

export async function searchPartners(query: string): Promise<Partner[]> {
  const escaped = query.replace(/"/g, "");
  const records = await base(PARTNERS)
    .select({
      filterByFormula: `AND({published} = 1, OR(SEARCH("${escaped}", LOWER({name})), SEARCH("${escaped}", LOWER({firm}))))`,
      fields: [
        "name",
        "firm",
        "title",
        "slug",
        "linkedin_url",
        "photo_url",
        "avg_overall",
        "review_count",
      ],
      sort: [{ field: "avg_overall", direction: "desc" }],
    })
    .all();
  return records.map(toPartner);
}

export async function getAllPublishedPartnerSlugs(): Promise<string[]> {
  const records = await base(PARTNERS)
    .select({
      filterByFormula: "{published} = 1",
      fields: ["slug"],
    })
    .all();
  return records
    .map((r) => r.fields["slug"] as string)
    .filter(Boolean);
}
