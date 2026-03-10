"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CallForm from "@/components/dashboard/CallForm";

type ApplicationItem = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  call: { title: string };
};

export default function ApplicationsTabs({
  applications,
  initialTab = "create",
}: {
  applications: ApplicationItem[];
  initialTab?: "create" | "received";
}) {
  const [tab, setTab] = useState<"create" | "received">(initialTab);
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "create" || t === "received") setTab(t);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl bg-slate-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("create")}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === "create" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Create form for application
        </button>
        <button
          type="button"
          onClick={() => setTab("received")}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === "received" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Received applications
        </button>
      </div>

      {tab === "create" && (
        <div>
          <p className="text-slate-600 mb-6">
            Create a new call for application. After creating, you can share the link so applicants can submit.
          </p>
          <CallForm mode="create" />
        </div>
      )}

      {tab === "received" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No applications yet. They will appear here when users submit to your calls.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {applications.map((app) => (
                <li key={app.id}>
                  <a
                    href={`/dashboard/applications/${app.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{app.name}</p>
                      <p className="text-sm text-slate-500">{app.email} · {app.call.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        app.status === "pending" ? "bg-amber-100 text-amber-800" :
                        app.status === "approved" ? "bg-green-100 text-green-800" :
                        app.status === "rejected" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
