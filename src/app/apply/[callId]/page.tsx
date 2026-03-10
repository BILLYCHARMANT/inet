import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApplyForm from "@/components/apply/ApplyForm";
import CommunityGate from "@/components/apply/CommunityGate";

export default async function ApplyToCallPage({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  const { callId } = await params;
  const session = await getServerSession(authOptions);
  const call = await prisma.callForApplication.findUnique({
    where: { id: callId },
  });
  if (!call || !call.published) notFound();

  const isCommunityJoin = call.slug === "join";
  const mustBeMember = !isCommunityJoin && !session;

  const formSchema = (call.formSchema as Array<{ id: string; type: string; label: string; required?: boolean; placeholder?: string; options?: string[]; accept?: string }>) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="hero-gradient px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-primary mb-6">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Home
          </Link>
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary mb-4">
            {call.type}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{call.title}</h1>
          {call.summary && (
            <p className="text-lg text-slate-600 mb-6">{call.summary}</p>
          )}
          {call.deadline && (
            <p className="text-sm text-slate-500">
              Deadline: {new Date(call.deadline).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto max-w-3xl flex flex-col md:flex-row gap-10">
          {call.imageUrl && (
            <div className="md:w-80 shrink-0">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={call.imageUrl}
                  alt={call.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {call.description && !mustBeMember && (
              <div className="prose prose-slate max-w-none mb-8 text-slate-600">
                <p className="whitespace-pre-wrap">{call.description}</p>
              </div>
            )}
            {mustBeMember ? (
              <CommunityGate courseTitle={call.title} returnPath={`/apply/${callId}`} />
            ) : (
              <ApplyForm
                callId={call.id}
                formSchema={formSchema}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
