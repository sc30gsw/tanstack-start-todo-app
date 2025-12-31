import { createSelectSchema } from "drizzle-valibot"
import * as v from "valibot"
import { todos } from "~/db/schema"

export const todoSchema = createSelectSchema(todos)

export type Todo = v.InferOutput<typeof todoSchema>
