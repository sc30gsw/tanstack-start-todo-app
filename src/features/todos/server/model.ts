import { t } from "elysia"
import { createSelectSchema, createInsertSchema } from "drizzle-typebox"
import { todos } from "~/db/schema"

const todoSelectSchema = createSelectSchema(todos)
const todoInsertSchema = createInsertSchema(todos)

export namespace TodoModel {
  export const createBody = t.Pick(todoInsertSchema, ["text"])
  export type createBody = typeof createBody.static

  export const updateBody = t.Partial(t.Omit(todoInsertSchema, ["id", "created_at", "updated_at"]))
  export type updateBody = typeof updateBody.static

  export const todoParams = t.Object({
    id: t.String(),
  })
  export type todoParams = typeof todoParams.static

  export const todo = todoSelectSchema
  export type todo = typeof todo.static

  export const todoList = t.Array(todoSelectSchema)
  export type todoList = typeof todoList.static

  export const deleteResponse = t.Object({
    success: t.Boolean(),
  })
  export type deleteResponse = typeof deleteResponse.static

  export const databaseError = t.Object({
    error: t.String(),
    code: t.Literal("DATABASE_ERROR"),
  })
  export type databaseError = typeof databaseError.static

  export const todoNotFoundError = t.Object({
    error: t.String(),
    code: t.Literal("TODO_NOT_FOUND"),
  })
  export type todoNotFoundError = typeof todoNotFoundError.static
}
