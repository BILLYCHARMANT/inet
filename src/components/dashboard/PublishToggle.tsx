"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishToggle({
  callId,
  published: initialPublished,
}: {
  callId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) throw new Error("Failed");
      setPublished(!published);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`text-sm font-semibold px-3 py-1.5 rounded-lg border ${
        published
          ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
          : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
      } disabled:opacity-50`}
    >
      {loading ? "…" : published ? "Published (click to unpublish)" : "Draft (click to publish)"}
    </button>
  );
}
