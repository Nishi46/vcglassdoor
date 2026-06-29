import { NextRequest, NextResponse } from "next/server";
import { createPendingReview } from "@/lib/airtable";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { notifyModerator } from "@/lib/notify";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, "submit", 5, 60 * 60 * 1000); // 5 per hour
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();

    const {
      partner_airtable_id,
      partner_name_manual,
      partner_firm_manual,
      relationship,
      year,
      rating_overall,
      rating_responsiveness,
      rating_behavior,
      rating_founder_friendly,
      rating_term_sheet_match,
      review_text,
      green_flags,
      red_flags,
      verification_file_name,
      verification_file_size,
      verification_url,
      verification_skipped,
    } = body;

    if (!relationship || !year || !rating_overall) {
      return NextResponse.json(
        { error: "relationship, year, and rating_overall are required" },
        { status: 400 }
      );
    }

    if (!partner_airtable_id && !partner_name_manual) {
      return NextResponse.json(
        { error: "Either partner_airtable_id or partner_name_manual is required" },
        { status: 400 }
      );
    }

    const recordId = await createPendingReview({
      partner_airtable_id,
      partner_name_manual,
      partner_firm_manual,
      relationship,
      year: Number(year),
      rating_overall: Number(rating_overall),
      rating_responsiveness: rating_responsiveness ? Number(rating_responsiveness) : undefined,
      rating_behavior: rating_behavior ? Number(rating_behavior) : undefined,
      rating_founder_friendly: rating_founder_friendly ? Number(rating_founder_friendly) : undefined,
      rating_term_sheet_match: rating_term_sheet_match ? Number(rating_term_sheet_match) : undefined,
      review_text,
      green_flags,
      red_flags,
      verification_file_name,
      verification_file_size,
      verification_url,
      verification_skipped: verification_skipped ?? false,
    });

    // Fire-and-forget — notification failure must not fail the submission
    notifyModerator(
      recordId,
      partner_name_manual ?? partner_airtable_id ?? "unknown"
    ).catch((e) => console.error("Moderator notification error:", e));

    return NextResponse.json({ success: true, id: recordId });
  } catch (err) {
    console.error("Review submit error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
