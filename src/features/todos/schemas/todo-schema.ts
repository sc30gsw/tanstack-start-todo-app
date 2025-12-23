import { createSelectSchema, createInsertSchema } from "drizzle-typebox"
import { createSelectSchema as createSelectSchemaValibot } from "drizzle-valibot"
import type { InferOutput } from "valibot"
import { todos } from "~/db/schema"

export const todoSchema = createSelectSchemaValibot(todos)

export const todoSelectSchema = createSelectSchema(todos)
export const todoInsertSchema = createInsertSchema(todos)

export type Todo = InferOutput<typeof todoSchema>
