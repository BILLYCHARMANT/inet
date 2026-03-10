import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ApplicationActions from "@/components/dashboard/ApplicationActions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await prisma.application.findUnique({
    where: { id },
    include: { call: true },
  });
  if (!app) notFound();

  const formSchema = (app.call.formSchema as Array<{ id: string; label: string; type: string }>) ?? [];
  const data = (app.data as Record<string, unknown>) ?? {};

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/dashboard/applications" className="text-sm font-semibold text-slate-600 hover:text-primary">
        ← Back to applications
      </Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{app.name}</h2>
            <p className="text-slate-600">{app.email}</p>
            <p className="text-sm text-slate-500 mt-1">Applied to: {app.call.title}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${
            app.status === "pending" ? "bg-amber-100 text-amber-800" :
            app.status === "approved" ? "bg-green-100 text-green-800" :
            app.status === "rejected" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
          }`}>
            {app.status}
          </span>
        </div>
        <div className="py-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Manage</h3>
          <ApplicationActions applicationId={id} currentStatus={app.status} />
        </div>
        {formSchema.length > 0 && Object.keys(data).length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Form answers</h3>
            <dl className="space-y-2">
              {formSchema.map((f) => {
                const val = data[f.id];
                const str = val != null ? String(val) : "—";
                const isUrl = typeof val === "string" && (val.startsWith("http") || val.startsWith("/"));
                return (
                  <div key={f.id}>
                    <dt className="text-xs font-medium text-slate-500">{f.label}</dt>
                    <dd className="text-slate-900 mt-0.5">
                      {isUrl ? (
                        <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {str}
                        </a>
                      ) : (
                        str
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}
        {app.content && !formSchema.length && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Submission</h3>
            <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-xl">
              {app.content}
            </pre>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-4">Received {new Date(app.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
