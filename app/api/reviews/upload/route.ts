import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip, "upload", 10, 60 * 60 * 1000); // 10 per hour
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only images and PDFs are accepted" },
        { status: 400 }
      );
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File must be under 10 MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = await put(
      `verifications/${Date.now()}-${file.name}`,
      arrayBuffer,
      { access: "private", contentType: file.type }
    );

    return NextResponse.json({
      success: true,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      verification_url: blob.url,
    });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
