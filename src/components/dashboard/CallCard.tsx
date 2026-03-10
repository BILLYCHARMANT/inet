import Link from "next/link";

type Call = {
  id: string;
  title: string;
  slug: string;
  status: string;
  deadline: Date | null;
  _count: { applications: number };
};

export default function CallCard({ call }: { call: Call }) {
  const statusColor = call.status === "open" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600";

  return (
    <Link
      href={`/dashboard/calls/${call.id}`}
      className="block rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary/50">campaign</span>
      </div>
      <div className="p-4">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-2 ${statusColor}`}>
          {call.status}
        </span>
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{call.title}</h3>
        <p className="text-sm text-slate-500 mb-3">{call._count.applications} application{call._count.applications !== 1 ? "s" : ""}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Manage <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}
