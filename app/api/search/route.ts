import { NextRequest, NextResponse } from "next/server";
import { searchPartners } from "@/lib/airtable";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ partners: [] });
  }

  try {
    const partners = await searchPartners(q);
    return NextResponse.json({ partners: partners.slice(0, 8) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
