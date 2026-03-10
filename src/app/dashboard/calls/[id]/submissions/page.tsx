import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmissionsTable from "@/components/dashboard/SubmissionsTable";

export default async function CallSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({
    where: { id },
    include: {
      applications: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!call) notFound();

  const formSchema = (call.formSchema as Array<{ id: string; label: string; type: string }>) ?? [];
  const submissions = call.applications.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    data: (a.data as Record<string, unknown>) ?? {},
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href={`/dashboard/calls/${id}`}
            className="text-sm font-semibold text-slate-600 hover:text-primary mb-2 inline-block"
          >
            ← Back to call
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Submissions: {call.title}</h2>
          <p className="text-slate-600 mt-1">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <SubmissionsTable
        callId={id}
        callTitle={call.title}
        formSchema={formSchema}
        submissions={submissions}
      />
    </div>
  );
}
