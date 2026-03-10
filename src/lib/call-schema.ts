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

export const createCallSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().max(191).optional(),
  type: z.enum(CALL_TYPES).optional().default("APPLICATION"),
  summary: z.string().max(2000).optional(),
  description: z.string().max(10000).optional(),
  imageUrl: z.string().max(2000).optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  published: z.boolean().optional().default(false),
  status: z.enum(["draft", "open", "closed"]).optional().default("draft"),
  formSchema: formSchemaArraySchema.optional(),
});

export const submitCallSchema = z.object({
  data: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  submitterName: z.string().max(500).optional(),
  submitterEmail: z.string().email().max(500).optional(),
});

export type CreateCallInput = z.infer<typeof createCallSchema>;
export type SubmitCallInput = z.infer<typeof submitCallSchema>;
