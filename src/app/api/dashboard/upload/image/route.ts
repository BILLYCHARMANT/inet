import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED = ["SUPER_ADMIN", "ADMIN"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"].map((s) => s.toLowerCase()));

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.role || !ALLOWED.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || "";
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: "Only images allowed: PNG, JPG, JPEG, GIF, WEBP" },
        { status: 400 }
      );
    }

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    // On Vercel we must use Blob storage (filesystem is read-only). Without the token we return a clear error.
    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Image upload is not configured on Vercel. In your Vercel project: Storage → Create Blob store, then add BLOB_READ_WRITE_TOKEN in Settings → Environment Variables.",
        },
        { status: 503 }
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`images/${safeName}`, file, {
          access: "public",
          addRandomSuffix: true,
        });
        return NextResponse.json({ url: blob.url });
      } catch (e) {
        console.error("Vercel Blob upload failed:", e);
        return NextResponse.json(
          { error: "Upload failed. Check that BLOB_READ_WRITE_TOKEN is set and the Blob store exists in Vercel." },
          { status: 500 }
        );
      }
    }

    // Never write to disk on Vercel (read-only filesystem)
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Image upload needs a Blob store on Vercel. In your project: Storage → Create Blob store, then add BLOB_READ_WRITE_TOKEN in Settings → Environment Variables.",
        },
        { status: 503 }
      );
    }

    // Local: write to public/uploads
    try {
      const dir = path.join(process.cwd(), "public", "uploads", "images");
      await mkdir(dir, { recursive: true });
      const filePath = path.join(dir, safeName);
      const bytes = new Uint8Array(await file.arrayBuffer());
      await writeFile(filePath, bytes);
      const url = `/uploads/images/${safeName}`;
      return NextResponse.json({ url });
    } catch (e) {
      console.error("Local image upload failed:", e);
      return NextResponse.json({ error: "Image save failed." }, { status: 500 });
    }
  } catch (e) {
    console.error("Image upload error:", e);
    return NextResponse.json(
      { error: "Image upload failed. Check server logs for details." },
      { status: 500 }
    );
  }
}
