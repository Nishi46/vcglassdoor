import { NextRequest, NextResponse } from "next/server";
import { setWatchlistEmail } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, sessionId } = body as Record<string, unknown>;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "Session required" }, { status: 400 });
  }

  await setWatchlistEmail(sessionId, email.trim().toLowerCase());
  return NextResponse.json({ success: true });
}
