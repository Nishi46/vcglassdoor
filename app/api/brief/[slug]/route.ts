import { NextRequest, NextResponse } from "next/server";
import { getPartnerBySlug, getReviewsForPartner } from "@/lib/airtable";
import { generateBackchannelBrief, gateBrief, type BriefTier } from "@/lib/brief";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// LAUNCH BLOCKER: always returns "free" until Stripe + session auth is implemented.
// Pro UI in BriefCard.tsx shows ProGate placeholders but no content is sent to free users.
// To unlock pro: Stripe webhook → store flag on user record → sign a session cookie →
// read that cookie here and return "pro".
function resolveTier(_req: NextRequest): BriefTier {
  return "free";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(req);
  const { slug } = await params;

  // 3 generations per IP per slug per 5 minutes — prevents Anthropic cost runaway
  const rl = checkRateLimit(ip, `brief:${slug}`, 3, 5 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const partner = await getPartnerBySlug(slug);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const reviews = await getReviewsForPartner(partner.id);
    if (reviews.length < 3) {
      return NextResponse.json(
        { error: "Not enough reviews to generate a brief" },
        { status: 422 }
      );
    }

    const brief = await generateBackchannelBrief(partner, reviews);
    const tier = resolveTier(req);
    return NextResponse.json({ brief: gateBrief(brief, tier) });
  } catch (err) {
    console.error("Brief generation error:", err);
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
  }
}
