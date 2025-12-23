import { object, string, boolean, optional, pipe, transform, picklist } from "valibot"
import type { InferInput, InferOutput } from "valibot"

export const sortBySchema = picklist(["created_at", "text"])
export const sortOrderSchema = picklist(["asc", "desc"])

export const searchSchema = object({
  q: pipe(
    optional(string()),
    transform((val) => val ?? ""),
  ),
  completed: optional(boolean()),
  sortBy: optional(sortBySchema),
  sortOrder: optional(sortOrderSchema),
})

export type SearchParams = InferOutput<typeof searchSchema>
export type SearchParamsInput = InferInput<typeof searchSchema>
