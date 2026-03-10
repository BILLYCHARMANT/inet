import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublishToggle from "@/components/dashboard/PublishToggle";

export const dynamic = "force-dynamic";

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const call = await prisma.callForApplication.findUnique({
    where: { id },
    include: {
      applications: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!call) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
              call.status === "open" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
            }`}>
              {call.status}
            </span>
            <PublishToggle callId={id} published={!!call.published} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{call.title}</h2>
          {call.description && <p className="text-slate-600 mt-1">{call.description}</p>}
          {call.deadline && (
            <p className="text-sm text-slate-500 mt-2">Deadline: {new Date(call.deadline).toLocaleString()}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/calls"
            className="text-sm font-semibold text-slate-600 hover:text-primary"
          >
            ← Back to calls
          </Link>
          <Link
            href={`/dashboard/calls/${id}/edit`}
            className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 text-sm"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit call
          </Link>
          <Link
            href={`/dashboard/calls/${id}/submissions`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 text-sm"
          >
            <span className="material-symbols-outlined text-lg">table_chart</span>
            View submissions ({call.applications.length})
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900 mb-4">Applications ({call.applications.length})</h3>
        {call.applications.length === 0 ? (
          <p className="text-slate-500">No applications yet. Share the apply link: /apply/{id}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {call.applications.map((app) => (
              <li key={app.id} className="py-3 first:pt-0">
                <Link
                  href={`/dashboard/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{app.name}</p>
                    <p className="text-sm text-slate-500">{app.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    app.status === "pending" ? "bg-amber-100 text-amber-800" :
                    app.status === "approved" ? "bg-green-100 text-green-800" :
                    app.status === "rejected" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {app.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
