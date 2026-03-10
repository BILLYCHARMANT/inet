"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const POPUP_KEY = "inet-join-popup-shown";
const DELAY_MS = 60 * 1000; // 1 minute

export default function SigninApplyPopup() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status !== "unauthenticated") return;
    const already = typeof window !== "undefined" && sessionStorage.getItem(POPUP_KEY);
    if (already) return;
    const t = setTimeout(() => {
      setShow(true);
      try {
        sessionStorage.setItem(POPUP_KEY, "1");
      } catch {
        // ignore
      }
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [mounted, status]);

  if (!show || session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <h2 id="popup-title" className="text-2xl font-bold text-slate-900 mb-2">Join INET Community</h2>
        <p className="text-slate-600 mb-6">Get an account to see all upcoming opportunities and receive alerts by email and in the platform.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/apply/join"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Join INET Community
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="mt-4 text-sm text-slate-500 hover:text-slate-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
