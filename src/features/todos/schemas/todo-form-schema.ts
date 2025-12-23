import { object, string, minLength, pipe } from "valibot"

export const todoFormSchema = object({
  text: pipe(string(), minLength(1, "Todo text is required")),
})
