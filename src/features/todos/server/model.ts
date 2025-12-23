import { createSelectSchema, createInsertSchema } from "drizzle-typebox"
import { todos } from "~/db/schema"

export const todoSelectSchema = createSelectSchema(todos)
export const todoInsertSchema = createInsertSchema(todos)
