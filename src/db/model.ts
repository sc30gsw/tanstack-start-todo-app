// ? https://elysiajs.com/integrations/drizzle.html#drizzle-typebox-1

import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { table } from "~/db/schema"
import { spreads } from "~/db/utils"

export const db = {
  insert: spreads(
    {
      todos: createInsertSchema(table.todos),
    },
    "insert",
  ),
  select: spreads(
    {
      todos: createSelectSchema(table.todos),
    },
    "select",
  ),
} as const
