import * as v from "valibot"

export const todoFormSchema = v.object({
  text: v.pipe(v.string(), v.minLength(1, "Todo text is required")),
  priority: v.union([v.literal("high"), v.literal("medium"), v.literal("low")]),
  urgency: v.union([v.literal("high"), v.literal("medium"), v.literal("low")]),
  estimatedTime: v.nullable(
    v.pipe(v.number(), v.minValue(0, "Estimated time must be 0 or greater")),
  ),
  actualTime: v.nullable(v.pipe(v.number(), v.minValue(0, "Actual time must be 0 or greater"))),
})

export type TodoFormValues = v.InferInput<typeof todoFormSchema>
