import { NextRequest, NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { addToWatchlist, removeFromWatchlist } from "@/lib/airtable";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sessionId = await getOrCreateSessionId();
  await addToWatchlist(sessionId, slug);
  return NextResponse.json({ success: true, saved: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sessionId = await getOrCreateSessionId();
  await removeFromWatchlist(sessionId, slug);
  return NextResponse.json({ success: true, saved: false });
}
