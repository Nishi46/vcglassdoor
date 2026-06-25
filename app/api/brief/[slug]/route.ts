import { NextRequest, NextResponse } from "next/server";
import { getPartnerBySlug, getReviewsForPartner } from "@/lib/airtable";
import { generateBackchannelBrief, gateBrief, type BriefTier } from "@/lib/brief";

// TODO: replace with real session-based tier lookup once auth exists
function resolveTier(_req: NextRequest): BriefTier {
  // Pro tier check: look for a signed pro session header/cookie here when auth is built.
  // Until then everyone is free — gating is enforced server-side, not in CSS.
  return "free";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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
}
