import { object, string, boolean, optional, picklist } from "valibot"
import type { InferInput, InferOutput } from "valibot"

export const defaultSearchParams = {
  q: "",
  completed: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
} as const

export const searchSchema = object({
  q: optional(string(), defaultSearchParams.q),
  completed: optional(boolean(), defaultSearchParams.completed),
  sortBy: optional(picklist(["createdAt", "text"]), defaultSearchParams.sortBy),
  sortOrder: optional(picklist(["asc", "desc"]), defaultSearchParams.sortOrder),
})

export type SearchParams = InferOutput<typeof searchSchema>
export type SearchParamsInput = InferInput<typeof searchSchema>
