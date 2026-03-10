import Link from "next/link";

export default function ELearningPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Your learning dashboard</h2>
        <p className="text-slate-600 mb-6">
          You are signed in with your personal credentials. Course content and progress will appear here. This area is only accessible when you are logged in.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="material-symbols-outlined text-primary text-2xl mb-2">library_books</span>
            <h3 className="font-bold text-slate-900">Courses</h3>
            <p className="text-sm text-slate-500">Browse and enroll in programs.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="material-symbols-outlined text-primary text-2xl mb-2">trending_up</span>
            <h3 className="font-bold text-slate-900">Progress</h3>
            <p className="text-sm text-slate-500">Track your progress and certificates.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="material-symbols-outlined text-primary text-2xl mb-2">quiz</span>
            <h3 className="font-bold text-slate-900">Assessments</h3>
            <p className="text-sm text-slate-500">Quizzes and assignments.</p>
          </div>
        </div>
      </section>

      <p className="text-sm text-slate-500">
        To join e-learning you must be logged in. If you were redirected here after signing in, your session is active. You can sign out from the menu in the header.
      </p>
    </div>
  );
}
