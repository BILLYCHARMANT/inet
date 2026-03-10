"use client";

import { useState, useRef } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export default function ImageUploadDropzone({ value, onChange, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploadError("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) {
      setUploadError("Please use PNG, JPG, GIF or WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/dashboard/upload/image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) uploadFile(file);
    else setUploadError("Please drop an image file.");
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  const displayUrl = value.startsWith("http") ? value : value ? `${typeof window !== "undefined" ? window.location.origin : ""}${value}` : null;

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed min-h-[140px] flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors
          ${dragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50/50"}
          ${disabled || uploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        {value ? (
          <div className="w-full h-full min-h-[120px] flex items-center justify-center rounded-lg overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl || value}
              alt="Preview"
              className="max-h-32 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
            <p className="text-sm font-medium text-slate-600 text-center">
              {uploading ? "Uploading…" : "Drag and drop an image here, or click to choose"}
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP — max 5MB</p>
          </>
        )}
      </div>
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {value && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(""); }}
          disabled={disabled}
          className="text-sm font-medium text-slate-500 hover:text-red-600"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
