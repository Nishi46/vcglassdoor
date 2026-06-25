import { NextRequest, NextResponse } from "next/server";
import { getPartnerBySlug, getReviewsForPartner } from "@/lib/airtable";
import { generateBackchannelBrief } from "@/lib/brief";

export async function GET(
  _req: NextRequest,
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
  return NextResponse.json({ brief });
}
