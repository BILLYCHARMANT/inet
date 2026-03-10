import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join INET Community | INET Maker",
  description: "Join the INET community to get an account, see all upcoming opportunities, and receive alerts by email and in the platform.",
};

export default async function ApplyPage() {
  const openCalls = await prisma.callForApplication.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="relative min-h-screen w-full">
      {/* Hero */}
      <section className="hero-gradient px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Applications open</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Community</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Join INET Community to get an account, see all upcoming opportunities, and receive alerts. Or apply to a specific call below.
          </p>
        </div>
      </section>

      {/* Open calls list */}
      {openCalls.length > 0 ? (
        <section className="px-6 py-12 border-y border-slate-200 bg-white/50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Open calls</h2>
            <ul className="space-y-4">
              {openCalls.map((call) => (
                <li key={call.id}>
                  <Link
                    href={call.slug === "join" ? "/apply/join" : `/apply/${call.id}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{call.type}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1">{call.title}</h3>
                    {call.summary && <p className="text-slate-600 text-sm mb-3 line-clamp-2">{call.summary}</p>}
                    {call.deadline && (
                      <p className="text-xs text-slate-500">Deadline: {new Date(call.deadline).toLocaleDateString()}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-2">
                      {call.slug === "join" ? "Join INET Community" : "Apply now"} <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="px-6 py-12 border-y border-slate-200 bg-white/50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What you need to know</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">calendar_today</span>
                <span><strong className="text-slate-900">Cohort start:</strong> September 1st</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">schedule</span>
                <span><strong className="text-slate-900">Duration:</strong> 8–12 weeks depending on program</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">badge</span>
                <span><strong className="text-slate-900">Eligibility:</strong> Open to all; no prior fabrication experience required</span>
              </li>
            </ul>
          </div>
        </section>
      )}

      {openCalls.length === 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-primary mb-4">edit_document</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No open calls at the moment</h3>
              <p className="text-slate-600 mb-6">
                Check back later or contact us to express your interest.
              </p>
              <a
                href="mailto:apply@inetmaker.example?subject=INET Maker – Application interest"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
              >
                Contact us <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-24 text-center">
        <Link href="/" className="text-primary font-semibold hover:underline underline-offset-4">
          ← Back to home
        </Link>
      </section>
    </div>
  );
}
