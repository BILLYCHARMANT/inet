"use client";

import type { FormField, FormFieldType } from "@/lib/call-schema";
import { formFieldTypes } from "@/lib/call-schema";

const fieldTypeLabels: Record<FormFieldType, string> = {
  text: "Short text",
  email: "Email",
  textarea: "Long text",
  number: "Number",
  select: "Dropdown",
  file: "File upload",
};

export default function CallFormSchemaBuilder({
  fields,
  onChange,
}: {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}) {
  function addField() {
    const id = `field_${Date.now()}`;
    onChange([...fields, { id, type: "text", label: "New field", required: false }]);
  }

  function updateField(index: number, updates: Partial<FormField>) {
    const next = [...fields];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">Form fields</h4>
        <button
          type="button"
          onClick={addField}
          className="text-sm font-semibold text-primary hover:underline"
        >
          + Add field
        </button>
      </div>
      <ul className="space-y-3">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                placeholder="Label"
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value as FormFieldType })}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                {formFieldTypes.map((t) => (
                  <option key={t} value={t}>{fieldTypeLabels[t]}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={field.required ?? false}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Required
              </label>
              {(field.type === "text" || field.type === "email" || field.type === "textarea") && (
                <input
                  type="text"
                  value={field.placeholder ?? ""}
                  onChange={(e) => updateField(index, { placeholder: e.target.value || undefined })}
                  placeholder="Placeholder"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm w-48"
                />
              )}
              {field.type === "select" && (
                <input
                  type="text"
                  value={(field.options ?? []).join(", ")}
                  onChange={(e) =>
                    updateField(index, {
                      options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Options (comma-separated)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm flex-1 min-w-[200px]"
                />
              )}
              {field.type === "file" && (
                <input
                  type="text"
                  value={field.accept ?? ""}
                  onChange={(e) => updateField(index, { accept: e.target.value || undefined })}
                  placeholder="Accept e.g. .pdf,.doc"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm w-40"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove field
            </button>
          </li>
        ))}
      </ul>
      {fields.length === 0 && (
        <p className="text-sm text-slate-500">No fields yet. Add fields applicants will fill.</p>
      )}
    </div>
  );
}
