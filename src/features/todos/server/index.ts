import { Elysia, t } from "elysia"
import { TodoService } from "~/features/todos/server/service"
import { todoInsertSchema, todoSelectSchema } from "~/features/todos/server/model"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

export const todoPlugin = new Elysia({ name: "todo" })
  .error({
    DatabaseError,
    TodoNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "DatabaseError":
        set.status = error.status

        return {
          error: error.message,
          code: "DATABASE_ERROR",
        }

      case "TodoNotFoundError":
        set.status = error.status

        return {
          error: error.message,
          code: "TODO_NOT_FOUND",
        }

      default:
        throw error
    }
  })
  .group("/todos", (app) =>
    app
      .get(
        "/",
        async ({ set }) => {
          set.status = 200

          return await TodoService.getAll()
        },
        {
          response: t.Array(todoSelectSchema),
          detail: {
            summary: "Get all todos",
            tags: ["Todos"],
          },
        },
      )
      .post(
        "/",
        async ({ body, set }) => {
          set.status = 201

          return await TodoService.create(body.text)
        },
        {
          body: t.Pick(todoInsertSchema, ["text"]),
          response: todoSelectSchema,
          detail: {
            summary: "Create a new todo",
            tags: ["Todos"],
          },
        },
      )
      .patch(
        "/:id",
        async ({ params, body, set }) => {
          set.status = 200

          return await TodoService.update(params.id, {
            text: body.text,
            completed: body.completed,
          })
        },
        {
          params: t.Pick(todoInsertSchema, ["id"]),
          body: t.Partial(t.Omit(todoInsertSchema, ["id", "created_at", "updated_at"])),
          response: todoSelectSchema,
          detail: {
            summary: "Update a todo",
            tags: ["Todos"],
          },
        },
      )
      .delete(
        "/:id",
        async ({ params, set }) => {
          set.status = 200

          return await TodoService.delete(params.id)
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          response: t.Object({
            success: t.Boolean(),
          }),
          detail: {
            summary: "Delete a todo",
            tags: ["Todos"],
          },
        },
      ),
  )
