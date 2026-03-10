"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, { title: string; icon: string }> = {
  "/dashboard": { title: "Dashboard", icon: "grid_view" },
  "/dashboard/applications": { title: "Applications", icon: "description" },
  "/dashboard/calls": { title: "Calls for Application", icon: "campaign" },
  "/dashboard/calls/new": { title: "Create call", icon: "add_circle" },
  "/dashboard/settings": { title: "Settings", icon: "settings" },
};

function getTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.endsWith("/edit")) return { title: "Edit call", icon: "edit" };
  if (pathname.includes("/submissions")) return { title: "Submissions", icon: "table_chart" };
  if (pathname.startsWith("/dashboard/calls/") && !pathname.endsWith("/new")) return { title: "Call details", icon: "campaign" };
  if (pathname.startsWith("/dashboard/applications/")) return { title: "Application", icon: "description" };
  return { title: "Dashboard", icon: "grid_view" };
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const info = getTitle(pathname);

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-2xl">{info.icon}</span>
        <h1 className="text-xl font-bold text-slate-900">{info.title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
        </div>
        <button type="button" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
