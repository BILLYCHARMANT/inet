"use client";

import Link from "next/link";

type FormFieldSchema = { id: string; label: string; type: string };
type Submission = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  data: Record<string, unknown>;
};

function escapeCsv(val: unknown): string {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function SubmissionsTable({
  callId,
  callTitle,
  formSchema,
  submissions,
}: {
  callId: string;
  callTitle: string;
  formSchema: FormFieldSchema[];
  submissions: Submission[];
}) {
  function exportCsv() {
    const headers = ["Submitted at", "Name", "Email", "Status", ...formSchema.map((f) => f.label)];
    const rows = submissions.map((s) => {
      const base = [
        new Date(s.createdAt).toLocaleString(),
        s.name,
        s.email,
        s.status,
      ];
      const dataCols = formSchema.map((f) => {
        const v = s.data[f.id];
        if (typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))) return v;
        return v != null ? String(v) : "";
      });
      return [...base, ...dataCols];
    });
    const csv = [headers.map(escapeCsv).join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${callTitle.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        No submissions yet. They will appear here when applicants submit via the public apply page.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Submitted</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
              {formSchema.map((f) => (
                <th key={f.id} className="text-left px-4 py-3 font-semibold text-slate-700">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3 text-slate-600">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                <td className="px-4 py-3 text-slate-600">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    s.status === "pending" ? "bg-amber-100 text-amber-800" :
                    s.status === "approved" ? "bg-green-100 text-green-800" :
                    s.status === "rejected" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {s.status}
                  </span>
                </td>
                {formSchema.map((f) => {
                  const v = s.data[f.id];
                  const str = v != null ? String(v) : "—";
                  const isUrl = typeof v === "string" && (v.startsWith("http") || v.startsWith("/"));
                  return (
                    <td key={f.id} className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {isUrl ? (
                        <a href={v} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">
                          {str}
                        </a>
                      ) : (
                        str
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-slate-100 text-center">
        <Link
          href={`/dashboard/applications`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all applications
        </Link>
      </div>
    </div>
  );
}
