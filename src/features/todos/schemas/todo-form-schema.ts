import { object, string, minLength, pipe } from "valibot"

// Valibot schema for todo form
export const todoFormSchema = object({
  text: pipe(
    string(),
    minLength(1, "Todo text is required"),
    minLength(3, "Todo text must be at least 3 characters"),
  ),
})
