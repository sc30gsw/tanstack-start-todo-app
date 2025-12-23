import { object, string, boolean, optional, pipe, transform, picklist } from "valibot"
import type { InferInput, InferOutput } from "valibot"

export const searchSchema = object({
  q: pipe(
    optional(string()),
    transform((val) => val ?? ""),
  ),
  completed: optional(boolean()),
  sortBy: optional(picklist(["created_at", "text"])),
  sortOrder: optional(picklist(["asc", "desc"])),
})

export type SearchParams = InferOutput<typeof searchSchema>
export type SearchParamsInput = InferInput<typeof searchSchema>
