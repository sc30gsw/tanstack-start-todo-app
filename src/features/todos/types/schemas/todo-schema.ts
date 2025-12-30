import { createSelectSchema } from "drizzle-valibot"
import type { InferOutput } from "valibot"
import { todos } from "~/db/schema"

export const todoSchema = createSelectSchema(todos)

export type Todo = InferOutput<typeof todoSchema>
