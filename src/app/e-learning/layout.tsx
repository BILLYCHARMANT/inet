import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ELearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/e-learning");

  return (
    <div className="min-h-screen bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">E-Learning</h1>
            <p className="text-slate-600 text-sm mt-1">
              Welcome back, {session.user?.name || session.user?.email}. Use your personal credentials to access courses and progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-primary"
            >
              ← Back to site
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
