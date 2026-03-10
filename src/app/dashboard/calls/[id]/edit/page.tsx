import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CallForm from "@/components/dashboard/CallForm";
import type { CallFormInitialData } from "@/components/dashboard/CallForm";
import type { FormField } from "@/lib/call-schema";

export default async function EditCallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({
    where: { id },
  });
  if (!call) notFound();

  const initialData: CallFormInitialData = {
    id: call.id,
    title: call.title,
    slug: call.slug,
    type: call.type,
    summary: call.summary,
    description: call.description,
    imageUrl: call.imageUrl,
    deadline: call.deadline ? call.deadline.toISOString().slice(0, 16) : null,
    published: !!call.published,
    status: call.status,
    formSchema: (call.formSchema as FormField[]) ?? [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/calls/${id}`}
          className="text-sm font-semibold text-slate-600 hover:text-primary"
        >
          ← Back to call
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Edit call</h2>
      </div>
      <CallForm mode="edit" initialData={initialData} />
    </div>
  );
}
