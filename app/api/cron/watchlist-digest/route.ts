import { NextRequest, NextResponse } from "next/server";
import { getAllWatchlistSessions, getReviewsForPartner, getPartnerBySlug } from "@/lib/airtable";
import { Resend } from "resend";

// Vercel Cron: runs nightly at 08:00 UTC
// vercel.json: { "crons": [{ "path": "/api/cron/watchlist-digest", "schedule": "0 8 * * *" }] }

const FROM = process.env.RESEND_FROM ?? "VCGlassdoor <noreply@vcglassdoor.com>";

// Simple in-memory last-sent tracker (resets on cold start — fine for MVP)
// In production this should be persisted to Airtable.
const lastSentAt = new Map<string, number>();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  // Protect the cron endpoint
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sessions = await getAllWatchlistSessions();
  let sent = 0;
  let skipped = 0;

  for (const session of sessions) {
    if (!session.email) continue;

    // Rate-limit: don't email the same session more than once per day
    const lastSent = lastSentAt.get(session.sessionId) ?? 0;
    if (Date.now() - lastSent < ONE_DAY_MS) { skipped++; continue; }

    const updates: Array<{ name: string; firm: string; slug: string; reviewCount: number }> = [];

    for (const slug of session.partnerSlugs) {
      const partner = await getPartnerBySlug(slug);
      if (!partner) continue;
      const reviews = await getReviewsForPartner(partner.id);
      // Surface if they have recent reviews (simple heuristic: any reviews at all)
      if (reviews.length > 0) {
        updates.push({
          name: partner.name,
          firm: partner.firm,
          slug: partner.slug,
          reviewCount: reviews.length,
        });
      }
    }

    if (updates.length === 0) { skipped++; continue; }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://vcglassdoor.com";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#030818;color:#e8e8f0;padding:32px;max-width:560px;margin:0 auto;">
  <div style="margin-bottom:24px;">
    <span style="font-size:13px;color:#759fbc;letter-spacing:0.1em;text-transform:uppercase;">VCGlassdoor · Watchlist Digest</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 8px;">Your watchlist has activity</h1>
  <p style="font-size:14px;color:#b9b8d3;margin:0 0 28px;">Here's what's new for the partners you're tracking:</p>

  ${updates.map((u) => `
  <div style="background:rgba(10,22,36,0.8);border:1px solid rgba(117,159,188,0.2);border-radius:14px;padding:16px 20px;margin-bottom:12px;">
    <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:white;">${u.name}</p>
    <p style="margin:0 0 10px;font-size:13px;color:#759fbc;">${u.firm}</p>
    <p style="margin:0 0 12px;font-size:13px;color:#b9b8d3;">${u.reviewCount} verified ${u.reviewCount === 1 ? "review" : "reviews"}</p>
    <a href="${baseUrl}/partners/${u.slug}" style="display:inline-block;font-size:13px;font-weight:600;color:#90c3c8;text-decoration:none;border:1px solid rgba(144,195,200,0.3);border-radius:8px;padding:6px 14px;">View profile →</a>
  </div>`).join("")}

  <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(117,159,188,0.12);">
    <a href="${baseUrl}/watchlist" style="font-size:12px;color:rgba(117,159,188,0.5);text-decoration:none;">Manage watchlist</a>
    <span style="margin:0 8px;color:rgba(117,159,188,0.3);">·</span>
    <span style="font-size:12px;color:rgba(117,159,188,0.35);">VCGlassdoor — The open secret, finally on record.</span>
  </div>
</body>
</html>`;

    try {
      await resend.emails.send({
        from: FROM,
        to: session.email,
        subject: `Watchlist update: ${updates.map((u) => u.name).join(", ")}`,
        html,
      });
      lastSentAt.set(session.sessionId, Date.now());
      sent++;
    } catch {
      // Log silently — don't fail the whole cron for one bad email
    }
  }

  return NextResponse.json({ sent, skipped, total: sessions.length });
}
