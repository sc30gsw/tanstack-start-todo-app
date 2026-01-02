import * as v from "valibot"

export const defaultSearchParams = {
  q: "",
  completed: undefined,
  priority: undefined,
  urgency: undefined,
  sorts: [{ field: "createdAt" as const, order: "desc" as const }],
}

export const sortConditionSchema = v.object({
  field: v.picklist(["createdAt", "priority", "urgency"]),
  order: v.picklist(["asc", "desc"]),
})

export const searchSchema = v.object({
  q: v.optional(v.string(), defaultSearchParams.q),
  completed: v.optional(v.boolean(), defaultSearchParams.completed),
  priority: v.optional(v.picklist(["high", "medium", "low"]), defaultSearchParams.priority),
  urgency: v.optional(v.picklist(["high", "medium", "low"]), defaultSearchParams.urgency),
  sorts: v.optional(v.array(sortConditionSchema), defaultSearchParams.sorts),
})

export type SearchParams = v.InferOutput<typeof searchSchema>
export type SearchParamsInput = v.InferInput<typeof searchSchema>
