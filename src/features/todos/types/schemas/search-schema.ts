import * as v from "valibot"

export const defaultSearchParams = {
  q: "",
  completed: undefined,
  priority: undefined,
  urgency: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
} as const

export const searchSchema = v.object({
  q: v.optional(v.string(), defaultSearchParams.q),
  completed: v.optional(v.boolean(), defaultSearchParams.completed),
  priority: v.optional(v.picklist(["high", "medium", "low"]), defaultSearchParams.priority),
  urgency: v.optional(v.picklist(["high", "medium", "low"]), defaultSearchParams.urgency),
  sortBy: v.optional(
    v.picklist(["createdAt", "text", "priority", "urgency"]),
    defaultSearchParams.sortBy,
  ),
  sortOrder: v.optional(v.picklist(["asc", "desc"]), defaultSearchParams.sortOrder),
})

export type SearchParams = v.InferOutput<typeof searchSchema>
export type SearchParamsInput = v.InferInput<typeof searchSchema>
