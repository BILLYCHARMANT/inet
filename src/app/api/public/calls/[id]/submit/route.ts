import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitCallSchema } from "@/lib/call-schema";

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
  try {
    const body = await request.json();
    const parsed = submitCallSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors?.data?.[0] ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { data, submitterName, submitterEmail } = parsed.data;
    const session = await getServerSession(authOptions);
    const name = submitterName?.trim() || session?.user?.name || "Anonymous";
    const email = (submitterEmail?.trim() || session?.user?.email) ?? "";

    const submission = await prisma.application.create({
      data: {
        callId,
        userId: session?.user?.id ?? null,
        name,
        email,
        submitterName: submitterName?.trim() || null,
        submitterEmail: submitterEmail?.trim() || null,
        data: data as object,
        status: "pending",
      },
    });
    return NextResponse.json({ id: submission.id, message: "Application submitted successfully." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
