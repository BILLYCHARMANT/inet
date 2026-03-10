import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = new Set(
  ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp".split(",").map((s) => s.trim().toLowerCase())
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: callId } = await params;
  const call = await prisma.callForApplication.findUnique({
    where: { id: callId },
  });
  if (!call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }
  if (!call.published) {
    return NextResponse.json({ error: "This call is not open for applications" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase() || "";
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "File type not allowed. Use: " + [...ALLOWED_EXT].join(", ") },
      { status: 400 }
    );
  }

  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const dir = path.join(process.cwd(), "public", "uploads", "calls", callId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, safeName);
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  const url = `/uploads/calls/${callId}/${safeName}`;
  return NextResponse.json({ url });
}
