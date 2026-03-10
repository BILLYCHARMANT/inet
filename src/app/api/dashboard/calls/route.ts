import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createCallSchema } from "@/lib/call-schema";

const ALLOWED = ["SUPER_ADMIN", "ADMIN"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role || !ALLOWED.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const parsed = createCallSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors?.title?.[0] ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { title, slug, type, summary, description, imageUrl, deadline, published, status, formSchema } = parsed.data;
    const finalSlug = (slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "call-" + Date.now()).slice(0, 191);
    const call = await prisma.callForApplication.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        type: type ?? "APPLICATION",
        summary: summary?.trim() || null,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        published: published ?? false,
        status: status === "open" || status === "closed" ? status : "draft",
        formSchema: formSchema && formSchema.length > 0 ? formSchema : undefined,
      },
    });
    return NextResponse.json({ id: call.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create call" }, { status: 500 });
  }
}
