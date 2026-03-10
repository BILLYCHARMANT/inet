"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function AuthNav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">...</span>
        <Link
          href="/apply/join"
          className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20"
        >
          Join Community
        </Link>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3" ref={ref}>
        <Link
          href="/apply"
          className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20"
        >
          Opportunities
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary px-3 py-2 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <span className="material-symbols-outlined text-primary">person</span>
            )}
            <span className="max-w-[120px] truncate">{session.user.name || session.user.email}</span>
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
              {session.user.role && session.user.role !== "USER" && (
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {session.user.role.replace("_", " ")}
                  </span>
                </div>
              )}
              {(session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN") && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  Dashboard
                </Link>
              )}
              <Link
                href="/e-learning"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">school</span>
                E-Learning
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary text-left"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden sm:block text-sm font-bold px-4 py-2 text-slate-700 hover:text-primary"
      >
        Sign in
      </Link>
      <Link
        href="/apply/join"
        className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20"
      >
        Join INET Community
      </Link>
    </div>
  );
}
