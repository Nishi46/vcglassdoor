import Airtable from "airtable";
import { POPULAR_PARTNERS } from "./popular-partners";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const PARTNERS = process.env.AIRTABLE_PARTNERS_TABLE ?? "Partners";
const REVIEWS = process.env.AIRTABLE_REVIEWS_TABLE ?? "Reviews";
const PRO_WAITLIST = process.env.AIRTABLE_PRO_WAITLIST_TABLE ?? "pro_waitlist";
const WATCHLIST_SESSIONS = process.env.AIRTABLE_WATCHLIST_TABLE ?? "watchlist_sessions";

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
  // AI-seeded fields (optional — only present after seeding pipeline runs)
  ai_overall?: number;
  ai_signals?: string; // JSON string: Array<{type, text, source}>
  ai_source_count?: number;
  ai_confidence?: number;
  ai_seeded?: boolean;
}

export interface AiSeedPayload {
  ai_overall: number;
  ai_signals: string; // JSON.stringify([...])
  ai_source_count: number;
  ai_confidence: number;
  ai_seeded: boolean;
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
  ai_generated?: boolean;
}

export interface PendingReviewPayload {
  partner_airtable_id?: string; // set if partner exists in Airtable
  partner_name_manual?: string; // set if entered manually
  partner_firm_manual?: string;
  relationship: string;
  year: number;
  rating_overall: number;
  rating_responsiveness?: number;
  rating_behavior?: number;
  rating_founder_friendly?: number;
  rating_term_sheet_match?: number;
  review_text?: string;
  green_flags?: string;
  red_flags?: string;
  verification_file_name?: string;
  verification_file_size?: number;
  verification_skipped?: boolean;
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
    ai_overall: (f["ai_overall"] as number) ?? undefined,
    ai_signals: (f["ai_signals"] as string) ?? undefined,
    ai_source_count: (f["ai_source_count"] as number) ?? undefined,
    ai_confidence: (f["ai_confidence"] as number) ?? undefined,
    ai_seeded: (f["ai_seeded"] as boolean) ?? false,
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
    ai_generated: (f["ai_generated"] as boolean) ?? false,
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
        "ai_overall",
        "ai_signals",
        "ai_source_count",
        "ai_confidence",
        "ai_seeded",
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
        "ai_overall",
        "ai_signals",
        "ai_source_count",
        "ai_confidence",
        "ai_seeded",
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
  const airtablePartners = records.map(toPartner);
  const airtableSlugs = new Set(airtablePartners.map((p) => p.slug));

  // Merge matching static partners that aren't already in Airtable results
  const lq = query.toLowerCase();
  const staticMatches = POPULAR_PARTNERS
    .filter((sp) =>
      !airtableSlugs.has(sp.slug) &&
      (sp.name.toLowerCase().includes(lq) || sp.firm.toLowerCase().includes(lq))
    )
    .map((sp): Partner => ({
      id: `static:${sp.slug}`,
      name: sp.name,
      firm: sp.firm,
      title: sp.title,
      slug: sp.slug,
      linkedin_url: "",
      photo_url: "",
      avg_overall: 0,
      review_count: 0,
      ai_seeded: false,
    }));

  return [...airtablePartners, ...staticMatches];
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

// ── Firm directory helpers ────────────────────────────────────────────────────

export interface FirmSummary {
  firm: string;
  firmSlug: string;
  partnerCount: number;
  reviewedCount: number;
  avgOverall: number;
}

export async function getPartnersByFirm(firmSlug: string): Promise<Partner[]> {
  // Convert slug back to a partial firm name for a case-insensitive search.
  // The slug is the firm name lowercased with spaces replaced by hyphens.
  const firmName = firmSlug.replace(/-/g, " ");
  const escaped = firmName.replace(/"/g, "");
  const records = await base(PARTNERS)
    .select({
      filterByFormula: `AND({published} = 1, SEARCH("${escaped}", LOWER({firm})))`,
      fields: [
        "name", "firm", "title", "slug", "linkedin_url", "photo_url",
        "avg_overall", "review_count", "ai_overall", "ai_seeded",
      ],
      sort: [{ field: "avg_overall", direction: "desc" }],
    })
    .all();
  return records.map(toPartner);
}

export async function getFirmDirectory(): Promise<FirmSummary[]> {
  const records = await base(PARTNERS)
    .select({
      filterByFormula: "{published} = 1",
      fields: ["firm", "avg_overall", "review_count"],
    })
    .all();

  const map = new Map<string, { total: number; reviewed: number; scoreSum: number }>();
  for (const r of records) {
    const firm = (r.fields["firm"] as string) ?? "";
    if (!firm) continue;
    const reviewCount = (r.fields["review_count"] as number) ?? 0;
    const avgOverall = (r.fields["avg_overall"] as number) ?? 0;
    const existing = map.get(firm) ?? { total: 0, reviewed: 0, scoreSum: 0 };
    existing.total += 1;
    if (reviewCount > 0) {
      existing.reviewed += 1;
      existing.scoreSum += avgOverall;
    }
    map.set(firm, existing);
  }

  return Array.from(map.entries())
    .map(([firm, data]) => ({
      firm,
      firmSlug: firm.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      partnerCount: data.total,
      reviewedCount: data.reviewed,
      avgOverall: data.reviewed > 0 ? data.scoreSum / data.reviewed : 0,
    }))
    .sort((a, b) => b.reviewedCount - a.reviewedCount || b.avgOverall - a.avgOverall);
}

// ── Submission helpers ───────────────────────────────────────────────────────

export async function createPendingReview(payload: PendingReviewPayload): Promise<string> {
  const fields: Airtable.FieldSet = {
    relationship: payload.relationship,
    year: payload.year,
    rating_overall: payload.rating_overall,
    ...(payload.rating_responsiveness ? { rating_responsiveness: payload.rating_responsiveness } : {}),
    ...(payload.rating_behavior ? { rating_behavior: payload.rating_behavior } : {}),
    ...(payload.rating_founder_friendly ? { rating_founder_friendly: payload.rating_founder_friendly } : {}),
    ...(payload.rating_term_sheet_match ? { rating_term_sheet_match: payload.rating_term_sheet_match } : {}),
    ...(payload.review_text ? { review_text: payload.review_text } : {}),
    ...(payload.green_flags ? { green_flags: payload.green_flags } : {}),
    ...(payload.red_flags ? { red_flags: payload.red_flags } : {}),
    verification_status: "pending",
    ...(payload.verification_file_name ? { verification_file_name: payload.verification_file_name } : {}),
    ...(payload.verification_file_size ? { verification_file_size: payload.verification_file_size } : {}),
    verification_skipped: payload.verification_skipped ?? false,
    published: false,
    ai_generated: false,
    ...(payload.partner_airtable_id ? { partner: [payload.partner_airtable_id] } : {}),
    ...(payload.partner_name_manual ? { partner_name_manual: payload.partner_name_manual } : {}),
    ...(payload.partner_firm_manual ? { partner_firm_manual: payload.partner_firm_manual } : {}),
  };

  const record = await base(REVIEWS).create(fields);
  return record.id;
}

// ── Seeding helpers ──────────────────────────────────────────────────────────

export async function getAllPartnersForSeeding(): Promise<Partner[]> {
  const records = await base(PARTNERS)
    .select({
      fields: [
        "name",
        "firm",
        "title",
        "slug",
        "linkedin_url",
        "photo_url",
        "avg_overall",
        "review_count",
        "ai_seeded",
        "ai_overall",
        "ai_signals",
        "ai_source_count",
        "ai_confidence",
      ],
    })
    .all();
  return records.map(toPartner);
}

export async function updatePartnerAiSeed(
  recordId: string,
  payload: AiSeedPayload
): Promise<void> {
  await base(PARTNERS).update(recordId, {
    ai_overall: payload.ai_overall,
    ai_signals: payload.ai_signals,
    ai_source_count: payload.ai_source_count,
    ai_confidence: payload.ai_confidence,
    ai_seeded: payload.ai_seeded,
  });
}

export async function createSyntheticReview(
  partnerRecordId: string,
  review: Omit<Review, "id">
): Promise<string> {
  const record = await base(REVIEWS).create({
    partner: [partnerRecordId],
    relationship: review.relationship,
    year: review.year,
    rating_overall: review.rating_overall,
    rating_responsiveness: review.rating_responsiveness,
    rating_behavior: review.rating_behavior,
    rating_founder_friendly: review.rating_founder_friendly,
    rating_term_sheet_match: review.rating_term_sheet_match,
    review_text: review.review_text,
    green_flags: review.green_flags,
    red_flags: review.red_flags,
    ai_generated: true,
    published: true,
  } as Airtable.FieldSet);
  return record.id;
}

export async function joinProWaitlist(email: string): Promise<void> {
  // Check for duplicate before inserting
  const existing = await base(PRO_WAITLIST)
    .select({
      filterByFormula: `{email} = "${email.replace(/"/g, '\\"')}"`,
      maxRecords: 1,
      fields: ["email"],
    })
    .firstPage();
  if (existing.length > 0) return; // already on list — silently succeed
  await base(PRO_WAITLIST).create({ email, created_at: new Date().toISOString() } as Airtable.FieldSet);
}

export async function getAiReviewsForPartner(partnerId: string): Promise<Review[]> {
  const records = await base(REVIEWS)
    .select({
      filterByFormula: `AND({ai_generated} = 1, FIND("${partnerId}", ARRAYJOIN({partner})))`,
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
        "ai_generated",
      ],
      sort: [{ field: "year", direction: "desc" }],
    })
    .all();
  return records.map(toReview);
}

// ── Watchlist ──────────────────────────────────────────────────────────────

export interface WatchlistSession {
  recordId: string;
  sessionId: string;
  partnerSlugs: string[];
  email?: string;
}

async function getWatchlistRecord(sessionId: string): Promise<WatchlistSession | null> {
  const records = await base(WATCHLIST_SESSIONS)
    .select({
      filterByFormula: `{session_id} = "${sessionId}"`,
      maxRecords: 1,
      fields: ["session_id", "partner_slugs", "email"],
    })
    .firstPage();
  if (records.length === 0) return null;
  const f = records[0].fields;
  return {
    recordId: records[0].id,
    sessionId: f["session_id"] as string,
    partnerSlugs: ((f["partner_slugs"] as string) ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    email: (f["email"] as string) ?? undefined,
  };
}

export async function getWatchlist(sessionId: string): Promise<Partner[]> {
  const session = await getWatchlistRecord(sessionId);
  if (!session || session.partnerSlugs.length === 0) return [];

  const partners: Partner[] = [];
  for (const slug of session.partnerSlugs) {
    const p = await getPartnerBySlug(slug);
    if (p) partners.push(p);
  }
  // Sort by review_count desc (most active first)
  return partners.sort((a, b) => b.review_count - a.review_count);
}

export async function addToWatchlist(sessionId: string, partnerSlug: string): Promise<void> {
  const session = await getWatchlistRecord(sessionId);
  if (session) {
    if (session.partnerSlugs.includes(partnerSlug)) return;
    const updated = [...session.partnerSlugs, partnerSlug];
    await base(WATCHLIST_SESSIONS).update(session.recordId, {
      partner_slugs: updated.join(","),
    } as Airtable.FieldSet);
  } else {
    await base(WATCHLIST_SESSIONS).create({
      session_id: sessionId,
      partner_slugs: partnerSlug,
      created_at: new Date().toISOString(),
    } as Airtable.FieldSet);
  }
}

export async function removeFromWatchlist(sessionId: string, partnerSlug: string): Promise<void> {
  const session = await getWatchlistRecord(sessionId);
  if (!session) return;
  const updated = session.partnerSlugs.filter((s) => s !== partnerSlug);
  await base(WATCHLIST_SESSIONS).update(session.recordId, {
    partner_slugs: updated.join(","),
  } as Airtable.FieldSet);
}

export async function setWatchlistEmail(sessionId: string, email: string): Promise<void> {
  const session = await getWatchlistRecord(sessionId);
  if (!session) return;
  await base(WATCHLIST_SESSIONS).update(session.recordId, { email } as Airtable.FieldSet);
}

export async function getAllWatchlistSessions(): Promise<WatchlistSession[]> {
  const records = await base(WATCHLIST_SESSIONS)
    .select({ fields: ["session_id", "partner_slugs", "email"] })
    .all();
  return records
    .map((r) => ({
      recordId: r.id,
      sessionId: r.fields["session_id"] as string,
      partnerSlugs: ((r.fields["partner_slugs"] as string) ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      email: (r.fields["email"] as string) ?? undefined,
    }))
    .filter((s) => s.email && s.partnerSlugs.length > 0);
}
