import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JoinApplicationFlow from "@/components/apply/JoinApplicationFlow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join INET Community | INET Maker",
  description: "Join the INET community. Get an account to see all upcoming opportunities and receive alerts by email and in the platform.",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function JoinApplicationPage({ searchParams }: Props) {
  const { next: nextUrl } = await searchParams;
  const call = await prisma.callForApplication.findUnique({
    where: { slug: "join", published: true },
  });
  if (!call) notFound();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-2xl text-primary">INET</span> Maker
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/help" className="text-slate-500 hover:text-slate-700 p-2 rounded-lg" title="Guide">
            <span className="material-symbols-outlined">help</span>
          </Link>
          <Link href="/login" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" title="Profile / Sign in">
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </header>

      <JoinApplicationFlow
        callId={call.id}
        title="Join INET Community"
        summary="Get an account to see all upcoming opportunities, courses, and calls. We’ll alert you by email and in the platform so you never miss a chance to apply."
        deadline={call.deadline}
        nextUrl={nextUrl ?? undefined}
      />

      <footer className="border-t border-slate-200 bg-white px-6 py-6 mt-auto flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
        <span>© {new Date().getFullYear()} INET Maker Program. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/contact" className="hover:text-primary">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
