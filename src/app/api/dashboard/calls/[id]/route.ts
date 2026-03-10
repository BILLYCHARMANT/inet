import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createCallSchema } from "@/lib/call-schema";

const ALLOWED = ["SUPER_ADMIN", "ADMIN"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role || !ALLOWED.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({
    where: { id },
  });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formSchema = call.formSchema as Array<unknown> | null;
  return NextResponse.json({
    id: call.id,
    title: call.title,
    slug: call.slug,
    type: call.type,
    summary: call.summary,
    description: call.description,
    imageUrl: call.imageUrl,
    deadline: call.deadline?.toISOString().slice(0, 16) ?? null,
    published: call.published,
    status: call.status,
    formSchema: formSchema ?? [],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role || !ALLOWED.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({ where: { id } });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();

    // Only published/status quick toggle (minimal payload)
    const { published: publishedToggle, status: statusOnly } = body;
    if (Object.keys(body).length <= 2 && (typeof publishedToggle === "boolean" || statusOnly !== undefined)) {
      const updates: { published?: boolean; status?: string } = {};
      if (typeof publishedToggle === "boolean") updates.published = publishedToggle;
      if (statusOnly === "draft" || statusOnly === "open" || statusOnly === "closed") updates.status = statusOnly;
      if (updates.published === true && !updates.status) updates.status = "open";
      if (updates.published === false && !updates.status) updates.status = "draft";
      await prisma.callForApplication.update({ where: { id }, data: updates });
      return NextResponse.json({ ok: true });
    }

    // Full update
    const parsed = createCallSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors?.title?.[0] ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { title, slug, type, summary, description, imageUrl, deadline, published, status, formSchema } = parsed.data;
    const finalSlug = (slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || call.slug).slice(0, 191);
    await prisma.callForApplication.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: finalSlug,
        type: type ?? call.type,
        summary: summary?.trim() || null,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        published: published ?? call.published,
        status: status === "open" || status === "closed" ? status : (published ? "open" : "draft"),
        formSchema: (formSchema && formSchema.length > 0
          ? formSchema
          : (call.formSchema != null ? call.formSchema : Prisma.JsonNull)) as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role || !ALLOWED.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({ where: { id } });
  if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await prisma.callForApplication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
