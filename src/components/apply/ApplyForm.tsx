"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type FormFieldSchema = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

export default function ApplyForm({
  callId,
  formSchema,
}: {
  callId: string;
  formSchema: FormFieldSchema[];
}) {
  const { data: session } = useSession();
  const [data, setData] = useState<Record<string, string | number | File>>({});
  const [submitterName, setSubmitterName] = useState(session?.user?.name ?? "");
  const [submitterEmail, setSubmitterEmail] = useState(session?.user?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(fieldId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.set("file", file);
    const res = await fetch(`/api/public/calls/${callId}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Upload failed");
    }
    const { url } = await res.json();
    return url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: Record<string, string | number> = {};
      for (const field of formSchema) {
        const val = data[field.id];
        if (field.type === "file" && val instanceof File) {
          payload[field.id] = await handleFileUpload(field.id, val);
        } else if (val !== undefined && val !== null && typeof val !== "object") {
          payload[field.id] = val as string | number;
        }
      }
      const res = await fetch(`/api/public/calls/${callId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: payload,
          submitterName: submitterName.trim() || undefined,
          submitterEmail: submitterEmail.trim() || undefined,
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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-green-600 mb-4">check_circle</span>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Application submitted</h3>
        <p className="text-slate-600 mb-6">Thank you. We will review your application and get back to you.</p>
        <a href="/" className="text-primary font-semibold hover:underline">Back to home</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Application form</h2>
        <p className="text-slate-600 mb-6">Please complete the questions below. They appear in the same order as in the form.</p>

        {!session && (
          <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Your contact (optional)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Your name</label>
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className={inputClass}
                  placeholder="Name"
                />
              </div>
              <div>
                <label className={labelClass}>Your email</label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        )}

        {formSchema.length === 0 ? (
          <p className="text-slate-500">This call has no form fields. You can still submit to express interest.</p>
        ) : (
          <div className="space-y-6">
            {formSchema.map((field, index) => (
              <section key={field.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <label className={`${labelClass} flex items-center gap-2`}>
                  <span className="text-slate-400 font-normal">{index + 1}.</span>
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {field.type === "text" && (
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) ?? ""}
                    onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                    className={inputClass}
                  />
                )}
                {field.type === "email" && (
                  <input
                    type="email"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) ?? ""}
                    onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                    className={inputClass}
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    value={(data[field.id] as string) ?? ""}
                    onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={(data[field.id] as number) ?? ""}
                    onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value === "" ? "" : Number(e.target.value) }))}
                    className={inputClass}
                  />
                )}
                {field.type === "select" && (
                  <div className="space-y-2">
                    {(field.options ?? []).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(field.options ?? []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setData((d) => ({ ...d, [field.id]: opt }))}
                            className={`p-4 rounded-xl border-2 text-left font-medium transition-colors ${
                              (data[field.id] as string) === opt ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-primary/40"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <select
                        required={field.required}
                        value={(data[field.id] as string) ?? ""}
                        onChange={(e) => setData((d) => ({ ...d, [field.id]: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        {(field.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                {field.type === "file" && (
                  <input
                    type="file"
                    required={field.required}
                    accept={field.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setData((d) => ({ ...d, [field.id]: file }));
                    }}
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold`}
                  />
                )}
              </section>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
