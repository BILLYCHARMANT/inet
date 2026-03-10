import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CallCard from "@/components/dashboard/CallCard";

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const calls = await prisma.callForApplication.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });
  const filtered = filter === "closed" ? calls.filter((c) => c.status === "closed") : calls.filter((c) => c.status !== "closed" || !filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-slate-600">
          {filter === "closed" ? "Closed" : "Open"} calls. Create a new call to collect applications.
        </p>
        <Link
          href="/dashboard/calls/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90"
        >
          <span className="material-symbols-outlined">add</span>
          Create call
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/calls/new"
          className="flex flex-col items-center justify-center min-h-[240px] rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors group"
        >
          <span className="material-symbols-outlined text-5xl text-slate-300 group-hover:text-primary mb-3">add_circle</span>
          <span className="font-bold text-slate-600 group-hover:text-primary">Create New Call</span>
          <span className="text-sm text-slate-500 mt-1">Create form for call for application</span>
        </Link>
        {filtered.map((call) => (
          <CallCard key={call.id} call={call} />
        ))}
      </div>
    </div>
  );
}
