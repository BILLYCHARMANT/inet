import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CallCard from "@/components/dashboard/CallCard";

export default async function DashboardHomePage() {
  let calls: Awaited<ReturnType<typeof prisma.callForApplication.findMany>>;
  let applications: Awaited<ReturnType<typeof prisma.application.findMany>>;
  let recentApplications: Awaited<ReturnType<typeof prisma.application.findMany>>;

  try {
    [calls, applications, recentApplications] = await Promise.all([
      prisma.callForApplication.findMany({
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { applications: true } } },
      }),
      prisma.application.findMany(),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { call: { select: { title: true } } },
      }),
    ]);
  } catch (err) {
    const isPoolTimeout =
      err instanceof Error &&
      (err.message.includes("pool timeout") || err.message.includes("retrieve a connection from pool"));
    return (
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 max-w-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Database connection failed</h2>
        <p className="text-slate-700 mb-4">
          {isPoolTimeout
            ? "The app could not reach the database (pool timeout). This often happens when the database is on a remote host (e.g. Hostinger) and connections are blocked or slow."
            : "The database is temporarily unavailable."}
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-6">
          <li>Check <code className="bg-white px-1 rounded">.env</code> and <code className="bg-white px-1 rounded">DATABASE_URL</code>.</li>
          <li>If using Hostinger: enable <strong>Remote MySQL</strong> in hPanel (Databases → Remote MySQL) and add your IP.</li>
          <li>Run <code className="bg-white px-1 rounded">npm run db:test</code> to verify the connection.</li>
        </ul>
        <p className="text-sm text-slate-500">Error: {err instanceof Error ? err.message : String(err)}</p>
      </div>
    );
  }

  const openCalls = calls.filter((c) => c.status === "open");
  const totalCalls = calls.length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-primary">{totalCalls}</p>
            <p className="text-sm font-medium text-slate-500">Total calls</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-slate-900">{openCalls.length}</p>
            <p className="text-sm font-medium text-slate-500">Open calls</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-slate-900">{totalApplications}</p>
            <p className="text-sm font-medium text-slate-500">Total applications</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-amber-600">{pendingApplications}</p>
            <p className="text-sm font-medium text-slate-500">Pending review</p>
          </div>
        </div>
      </section>

      {/* Active Calls for Application */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calls for Application</h2>
            <p className="text-slate-600 mt-1">
              Manage your calls and track applications. Create a new call or continue editing existing ones.
            </p>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1">
            <span className="px-4 py-2 rounded-lg bg-white text-sm font-semibold text-primary shadow-sm">Open</span>
            <Link href="/dashboard/calls?filter=closed" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg" prefetch={false}>Closed</Link>
          </div>
        </div>
        {openCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">campaign</span>
            <p className="text-slate-600 font-medium">No open calls yet</p>
            <Link href="/dashboard/applications?tab=create" className="mt-4 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90">
              Create your first call
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {openCalls.slice(0, 3).map((call) => (
              <CallCard key={call.id} call={call} />
            ))}
            <Link
              href="/dashboard/applications?tab=create"
              className="flex flex-col items-center justify-center min-h-[240px] rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors group"
            >
              <span className="material-symbols-outlined text-5xl text-slate-300 group-hover:text-primary mb-3">add_circle</span>
              <span className="font-bold text-slate-600 group-hover:text-primary">Create New Call</span>
              <span className="text-sm text-slate-500 mt-1 text-center px-4">Create a new call for application form</span>
            </Link>
          </div>
        )}
      </section>

      {/* Recent Applications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
          <Link href="/dashboard/applications" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>
        {recentApplications.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No applications yet. They will appear here when users submit.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentApplications.map((app) => (
              <li key={app.id} className="py-4 first:pt-0">
                <Link href={`/dashboard/applications/${app.id}`} className="flex items-center justify-between gap-4 hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-900">{app.name}</p>
                    <p className="text-sm text-slate-500">{app.email} · {app.call.title}</p>
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
