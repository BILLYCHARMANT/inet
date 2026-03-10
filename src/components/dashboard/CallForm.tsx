"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FormField } from "@/lib/call-schema";
import { CALL_TYPES } from "@/lib/call-schema";
import CallFormSchemaBuilder from "@/components/dashboard/CallFormSchemaBuilder";
import ImageUploadDropzone from "@/components/dashboard/ImageUploadDropzone";

export type CallFormInitialData = {
  id: string;
  title: string;
  slug: string;
  type: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  deadline: string | null;
  published: boolean;
  status: string;
  formSchema: FormField[];
};

type CallFormProps = {
  mode: "create" | "edit";
  initialData?: CallFormInitialData | null;
};

export default function CallForm({ mode, initialData }: CallFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("APPLICATION");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [publishNow, setPublishNow] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type || "APPLICATION");
      setSummary(initialData.summary ?? "");
      setDescription(initialData.description ?? "");
      setImageUrl(initialData.imageUrl ?? "");
      setDeadline(initialData.deadline ? initialData.deadline.slice(0, 16) : "");
      setFormFields(Array.isArray(initialData.formSchema) ? initialData.formSchema : []);
      setPublishNow(!!initialData.published);
    }
  }, [initialData]);

  function buildPayload(overrides: { published?: boolean; status?: string } = {}) {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "call-" + Date.now();
    return {
      title: title.trim(),
      slug: mode === "create" ? slug : undefined,
      type: type || "APPLICATION",
      summary: summary.trim() || null,
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      deadline: deadline || null,
      published: overrides.published ?? publishNow,
      status: overrides.status ?? (publishNow ? "open" : "draft"),
      formSchema: formFields.length ? formFields : undefined,
    };
  }

  async function submit(payload: ReturnType<typeof buildPayload>) {
    setError("");
    setFieldErrors({});
    if (!title.trim()) {
      setError("Title is required.");
      setFieldErrors({ title: ["Title is required."] });
      return;
    }
    setLoading(true);
    try {
      const url = mode === "edit" && initialData ? `/api/dashboard/calls/${initialData.id}` : "/api/dashboard/calls";
      const method = mode === "edit" ? "PATCH" : "POST";
      const slug = payload.slug ?? (payload.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "call-" + Date.now());
      const body = mode === "edit" ? payload : { ...payload, slug };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFieldErrors((data.fieldErrors as Record<string, string[]>) ?? {});
        throw new Error(data.error || (method === "POST" ? "Failed to create call" : "Failed to update call"));
      }
      if (mode === "create") {
        router.push("/dashboard/applications");
      } else {
        router.push(`/dashboard/calls/${initialData!.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData || mode !== "edit") return;
    if (!confirm("Delete this call? All submissions will be deleted. This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/calls/${initialData.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard/calls");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(buildPayload());
      }}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
        <input
          id="title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setFieldErrors((prev) => ({ ...prev, title: [] })); }}
          type="text"
          required
          placeholder="e.g. Summer 2025 Cohort"
          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${fieldErrors.title?.length ? "border-red-400 bg-red-50/50" : "border-slate-200"}`}
        />
        {fieldErrors.title?.[0] && <p className="text-sm text-red-600 mt-1">{fieldErrors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        >
          {CALL_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="summary" className="block text-sm font-semibold text-slate-700 mb-1">Summary (short)</label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          placeholder="Brief summary for listings"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Full description for the apply page"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
        />
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Image / flyer (optional)</label>
          <ImageUploadDropzone
            value={imageUrl}
            onChange={setImageUrl}
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 mb-1">Deadline (optional)</label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none max-w-xs"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <CallFormSchemaBuilder fields={formFields} onChange={setFormFields} />
      </div>

      {mode === "create" && (
        <div className="flex items-center gap-2">
          <input
            id="publish"
            type="checkbox"
            checked={publishNow}
            onChange={(e) => setPublishNow(e.target.checked)}
            className="rounded border-slate-300"
          />
          <label htmlFor="publish" className="text-sm font-medium text-slate-700">Publish immediately (show on homepage and allow applications)</label>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {mode === "create" && (
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create call"}
          </button>
        )}
        {mode === "edit" && (
          <>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Update"}
            </button>
            <button
              type="button"
              onClick={() => submit(buildPayload({ published: false, status: "draft" }))}
              disabled={loading}
              className="px-6 py-3 border border-slate-200 font-semibold rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Save as draft
            </button>
            <button
              type="button"
              onClick={() => submit(buildPayload({ published: true, status: "open" }))}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => submit(buildPayload({ published: false, status: "draft" }))}
              disabled={loading}
              className="px-6 py-3 border border-amber-200 bg-amber-50 text-amber-800 font-semibold rounded-xl hover:bg-amber-100 disabled:opacity-50"
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() => submit(buildPayload({ status: "closed" }))}
              disabled={loading}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 disabled:opacity-50"
            >
              Close call
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 border border-red-200 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 ml-auto"
            >
              Delete call
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-slate-200 font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
