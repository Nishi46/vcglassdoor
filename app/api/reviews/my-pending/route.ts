import { NextRequest, NextResponse } from "next/server";
import { getReviewById } from "@/lib/airtable";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^rec[a-zA-Z0-9]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const review = await getReviewById(id);
  if (!review) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(review);
}
