import { NextRequest, NextResponse } from "next/server";

// MVP: accepts the file and returns metadata. The file name + size get stored
// on the Airtable review record by the submit route. A future iteration can
// pipe the file to Vercel Blob or S3 and return a real URL.
export async function POST(request: NextRequest) {
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

    return NextResponse.json({
      success: true,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
