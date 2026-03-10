"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/dashboard/applications", label: "Applications", icon: "description" },
  { href: "/dashboard/calls", label: "Calls", icon: "campaign" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export default function DashboardSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <span className="material-symbols-outlined text-white text-xl">rocket_launch</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 block">INET Maker</span>
            <span className="text-xs text-slate-500">Admin Dashboard</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
          {user.image ? (
            <img src={user.image} alt="" className="w-10 h-10 rounded-full bg-primary/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {(user.name || user.email || "?").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 truncate text-sm">{user.name || "Admin"}</p>
            <p className="text-xs text-slate-500 truncate">Admin Account</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-slate-400 hover:text-slate-600 p-1"
            title="Sign out"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
