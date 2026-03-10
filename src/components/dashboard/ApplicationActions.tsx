"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicationActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(newStatus: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setStatus(newStatus);
      router.refresh();
    } catch {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/applications/${applicationId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard/applications");
      router.refresh();
    } catch {
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Status:</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
      >
        Delete submission
      </button>
    </div>
  );
}
