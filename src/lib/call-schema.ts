import { z } from "zod";

export const CALL_TYPES = ["PROJECT", "APPLICATION", "COMPETITION", "EVENT"] as const;
export type CallType = (typeof CALL_TYPES)[number];

export const formFieldTypes = ["text", "email", "textarea", "number", "select", "file"] as const;
export type FormFieldType = (typeof formFieldTypes)[number];

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(formFieldTypes),
  label: z.string().min(1),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(), // for select
  accept: z.string().optional(), // for file, e.g. ".pdf,.doc"
});

export type FormField = z.infer<typeof formFieldSchema>;

export const formSchemaArraySchema = z.array(formFieldSchema);

// Optional string: accept string, null, undefined, or "" and normalize to string | null
const optionalString = (maxLen: number) =>
  z
    .union([z.string().max(maxLen), z.null(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

export const createCallSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  slug: z.string().max(191).optional().nullable(),
  type: z.enum(CALL_TYPES).optional().default("APPLICATION"),
  summary: optionalString(2000),
  description: optionalString(10000),
  imageUrl: optionalString(2000),
  deadline: z
    .union([z.string(), z.null(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  published: z.boolean().optional().default(false),
  status: z.enum(["draft", "open", "closed"]).optional().default("draft"),
  formSchema: formSchemaArraySchema.optional().nullable(),
});

export const submitCallSchema = z.object({
  data: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  submitterName: z.string().max(500).optional(),
  submitterEmail: z.string().email().max(500).optional(),
});

export type CreateCallInput = z.infer<typeof createCallSchema>;
export type SubmitCallInput = z.infer<typeof submitCallSchema>;
