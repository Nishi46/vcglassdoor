import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getWatchlist } from "@/lib/airtable";

export async function GET() {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ partners: [] });
  const partners = await getWatchlist(sessionId);
  return NextResponse.json({ partners });
}
