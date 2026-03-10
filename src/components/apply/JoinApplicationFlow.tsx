"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export type JoinFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  initialBackground: string;
  softwareCAD: boolean;
  software3D: boolean;
  softwareCoding: boolean;
  hardware3DPrinting: string;
  hardwareLaserCutting: string;
  hardwareCNC: string;
  portfolioUrl: string;
  statementOfIntent: string;
  primaryInterest: string;
  howDidYouHear: string;
  agreeCollaborate: boolean;
  agreeSustainable: boolean;
};

const defaultData: JoinFormData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  initialBackground: "",
  softwareCAD: false,
  software3D: false,
  softwareCoding: false,
  hardware3DPrinting: "",
  hardwareLaserCutting: "",
  hardwareCNC: "",
  portfolioUrl: "",
  statementOfIntent: "",
  primaryInterest: "",
  howDidYouHear: "",
  agreeCollaborate: false,
  agreeSustainable: false,
};

const STEPS = [
  { id: 1, label: "Personal Information", short: "Personal Info" },
  { id: 2, label: "Fabrication Experience", short: "Fabrication Experience" },
  { id: 3, label: "Statement of Intent", short: "Statement of Intent" },
  { id: 4, label: "Review Application", short: "Review" },
];

const LOCATIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Africa", "Other"];
const EXPERIENCE_LEVELS = ["No experience", "Beginner (Curious)", "Intermediate (1-2 Years)", "Advanced (3+ Years)"];
const INTEREST_AREAS = ["Computational Design", "Robotic Fabrication", "Digital Manufacturing", "IoT & Smart Systems", "Other"];
const HOW_HEARD = ["Website", "Social Media", "Referral", "Event", "Other"];

type Props = {
  callId: string;
  title: string;
  summary: string;
  deadline: Date | null;
  nextUrl?: string;
};

export default function JoinApplicationFlow({ callId, title, summary, deadline, nextUrl }: Props) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<JoinFormData>({
    ...defaultData,
    fullName: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const progress = (step / 4) * 100;

  function update(fields: Partial<JoinFormData>) {
    setData((d) => ({ ...d, ...fields }));
  }

  async function handleSubmit() {
    setError("");
    if (data.statementOfIntent.length < 200) {
      setError("Statement of intent must be at least 200 characters.");
      return;
    }
    if (!data.agreeCollaborate || !data.agreeSustainable) {
      setError("Please acknowledge both community guidelines.");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, string | number | null> = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        initialBackground: data.initialBackground,
        softwareCAD: data.softwareCAD ? "Yes" : "No",
        software3D: data.software3D ? "Yes" : "No",
        softwareCoding: data.softwareCoding ? "Yes" : "No",
        hardware3DPrinting: data.hardware3DPrinting || null,
        hardwareLaserCutting: data.hardwareLaserCutting || null,
        hardwareCNC: data.hardwareCNC || null,
        portfolioUrl: data.portfolioUrl || null,
        statementOfIntent: data.statementOfIntent,
        primaryInterest: data.primaryInterest || null,
        howDidYouHear: data.howDidYouHear || null,
        agreeCollaborate: data.agreeCollaborate ? "Yes" : "No",
        agreeSustainable: data.agreeSustainable ? "Yes" : "No",
      };
      const res = await fetch(`/api/public/calls/${callId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: payload,
          submitterName: data.fullName,
          submitterEmail: data.email,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submit failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to the INET Community!</h2>
          <p className="text-slate-600 mb-6">
            You’re in. We’ll review your profile and you’ll be able to see all upcoming opportunities and get alerts by email and in the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            {nextUrl && (
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(nextUrl)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">login</span> Sign in and continue to application
              </Link>
            )}
            <Link
              href="/"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl ${
                nextUrl ? "border border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <span className="material-symbols-outlined">home</span> Return to Home
            </Link>
            {!nextUrl && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50"
              >
                <span className="material-symbols-outlined">login</span> Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Left sidebar */}
      <aside className="lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-6 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Community signup</p>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600 mt-1">{summary}</p>
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 mb-2">Current progress</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm font-semibold text-slate-700 mt-1">{Math.round(progress)}%</p>
        </div>
        <nav className="space-y-1">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                step === s.id ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === s.id ? "bg-white/20" : "bg-slate-100"}`}>
                {s.id}
              </span>
              {s.short}
            </button>
          ))}
        </nav>
        {deadline && (
          <div className="mt-auto pt-6 flex items-center gap-2 text-sm text-slate-500">
            <span className="material-symbols-outlined text-lg">schedule</span>
            Applications close {new Date(deadline).toLocaleDateString()}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Step 1: Personal Information</h2>
              <p className="text-slate-600 mb-6">Tell us who you are and how to reach you.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => update({ fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Alex Rivera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => update({ email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="alex@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                  <select
                    value={data.location}
                    onChange={(e) => update({ location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Select region</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Background</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Architect", "Engineer", "Designer"].map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => update({ initialBackground: bg })}
                        className={`p-4 rounded-xl border-2 text-center font-medium transition-colors ${
                          data.initialBackground === bg ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-primary/40"
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Fabrication Experience</h2>
              <p className="text-slate-600 mb-6">Tell us about your technical background and the machines you&apos;ve used.</p>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Software Proficiency</p>
                  <div className="space-y-2">
                    {[
                      { key: "softwareCAD" as const, label: "CAD", desc: "AutoCAD, Fusion 360, SolidWorks" },
                      { key: "software3D" as const, label: "3D Modeling", desc: "Blender, Rhino, Maya" },
                      { key: "softwareCoding" as const, label: "Coding", desc: "Python, C++, Arduino, G-Code" },
                    ].map(({ key, label, desc }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => update({ [key]: !data[key] })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-colors ${
                          data[key] ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-sm text-slate-500">{desc}</p>
                        </div>
                        {data[key] && <span className="material-symbols-outlined text-primary">check_circle</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Hardware & Machinery</p>
                  <div className="space-y-3">
                    {[
                      { key: "hardware3DPrinting" as const, label: "3D Printing", desc: "FDM, SLA, industrial SLS" },
                      { key: "hardwareLaserCutting" as const, label: "Laser Cutting", desc: "CO2, Fiber, Engraving" },
                      { key: "hardwareCNC" as const, label: "CNC Milling", desc: "3-axis and 5-axis" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-900">{label}</p>
                          <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                        <select
                          value={data[key]}
                          onChange={(e) => update({ [key]: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        >
                          {EXPERIENCE_LEVELS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Portfolio (optional)</p>
                  <input
                    type="url"
                    value={data.portfolioUrl}
                    onChange={(e) => update({ portfolioUrl: e.target.value })}
                    placeholder="Paste portfolio URL here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Statement of Intent</h2>
              <p className="text-slate-600 mb-6">Tell us about your motivation and goals. This helps us tailor the experience.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Why do you want to join INET Maker?</label>
                  <textarea
                    value={data.statementOfIntent}
                    onChange={(e) => update({ statementOfIntent: e.target.value })}
                    rows={5}
                    placeholder="Describe your goals, what you hope to achieve, and how you see yourself contributing to our community..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 200 characters ({data.statementOfIntent.length}/200)</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Primary interest area</label>
                    <select
                      value={data.primaryInterest}
                      onChange={(e) => update({ primaryInterest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Select an area</option>
                      {INTEREST_AREAS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">How did you hear about us?</label>
                    <select
                      value={data.howDidYouHear}
                      onChange={(e) => update({ howDidYouHear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Choose an option</option>
                      {HOW_HEARD.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={data.agreeCollaborate} onChange={(e) => update({ agreeCollaborate: e.target.checked })} className="mt-1 rounded border-slate-300" />
                    <span className="text-sm text-slate-700">I agree to collaborate openly and share my knowledge with other members of the INET Maker community.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={data.agreeSustainable} onChange={(e) => update({ agreeSustainable: e.target.checked })} className="mt-1 rounded border-slate-300" />
                    <span className="text-sm text-slate-700">I understand that INET Maker promotes a sustainable and ethical approach to innovation.</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Review Application</h2>
              <p className="text-slate-600 mb-6">Please verify your details before final submission.</p>
              <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Personal Information</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">edit</span> Edit
                    </button>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-slate-500">Full name</dt><dd className="font-medium">{data.fullName || "—"}</dd>
                    <dt className="text-slate-500">Email</dt><dd className="font-medium">{data.email || "—"}</dd>
                    <dt className="text-slate-500">Phone</dt><dd className="font-medium">{data.phone || "—"}</dd>
                    <dt className="text-slate-500">Location</dt><dd className="font-medium">{data.location || "—"}</dd>
                    <dt className="text-slate-500">Background</dt><dd className="font-medium">{data.initialBackground || "—"}</dd>
                  </dl>
                </section>
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Fabrication Experience</h3>
                    <button type="button" onClick={() => setStep(2)} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">edit</span> Edit
                    </button>
                  </div>
                  <p className="text-sm text-slate-600">Software: {[data.softwareCAD && "CAD", data.software3D && "3D Modeling", data.softwareCoding && "Coding"].filter(Boolean).join(", ") || "—"}</p>
                  <p className="text-sm text-slate-600 mt-1">3D Printing: {data.hardware3DPrinting || "—"} · Laser: {data.hardwareLaserCutting || "—"} · CNC: {data.hardwareCNC || "—"}</p>
                  {data.portfolioUrl && <p className="text-sm text-primary mt-1"><a href={data.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio link</a></p>}
                </section>
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Statement of Intent</h3>
                    <button type="button" onClick={() => setStep(3)} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">edit</span> Edit
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.statementOfIntent || "—"}</p>
                  <p className="text-sm text-slate-500 mt-2">Interest: {data.primaryInterest || "—"} · Heard via: {data.howDidYouHear || "—"}</p>
                </section>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Joining…" : "Join INET Community"}
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </>
          )}

          {/* Step navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 border border-slate-200 font-semibold rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
            >
              <span className="material-symbols-outlined">arrow_back</span> Previous
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 flex items-center gap-1"
              >
                Next <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
