import { object, string, boolean, optional, picklist } from "valibot"
import type { InferInput, InferOutput } from "valibot"

export const defaultSearchParams = {
  q: "",
  completed: undefined,
  priority: undefined,
  urgency: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
} as const

export const searchSchema = object({
  q: optional(string(), defaultSearchParams.q),
  completed: optional(boolean(), defaultSearchParams.completed),
  priority: optional(picklist(["high", "medium", "low"]), defaultSearchParams.priority),
  urgency: optional(picklist(["high", "medium", "low"]), defaultSearchParams.urgency),
  sortBy: optional(
    picklist(["createdAt", "text", "priority", "urgency"]),
    defaultSearchParams.sortBy,
  ),
  sortOrder: optional(picklist(["asc", "desc"]), defaultSearchParams.sortOrder),
})

export type SearchParams = InferOutput<typeof searchSchema>
export type SearchParamsInput = InferInput<typeof searchSchema>
