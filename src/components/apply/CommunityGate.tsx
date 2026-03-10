import Link from "next/link";

type Props = {
  courseTitle?: string;
  returnPath: string; // e.g. /apply/abc123
};

export default function CommunityGate({ courseTitle, returnPath }: Props) {
  const joinUrl = `/apply/join?next=${encodeURIComponent(returnPath)}`;

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-8 md:p-10 text-center max-w-xl mx-auto">
      <span className="material-symbols-outlined text-5xl text-primary mb-4">groups</span>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Join the community first</h2>
      <p className="text-slate-600 mb-6">
        To apply for {courseTitle ? `"${courseTitle}"` : "this opportunity"}, you need to be part of the INET Community. Sign in if you already have an account, or join the community to get access to all opportunities and alerts.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={joinUrl}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90"
        >
          Join INET Community
        </Link>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(returnPath)}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
        >
          Sign in
        </Link>
      </div>
      <p className="text-sm text-slate-500 mt-6">
        After joining or signing in, you’ll be able to apply to courses and see all upcoming opportunities.
      </p>
    </div>
  );
}
