import {
  object,
  string,
  minLength,
  pipe,
  number,
  minValue,
  literal,
  union,
  nullable,
  type InferInput,
} from "valibot"

export const todoFormSchema = object({
  text: pipe(string(), minLength(1, "Todo text is required")),
  priority: union([literal("high"), literal("medium"), literal("low")]),
  urgency: union([literal("high"), literal("medium"), literal("low")]),
  estimatedTime: nullable(pipe(number(), minValue(0, "Estimated time must be 0 or greater"))),
  actualTime: nullable(pipe(number(), minValue(0, "Actual time must be 0 or greater"))),
})

export type TodoFormValues = InferInput<typeof todoFormSchema>
