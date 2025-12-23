import { Elysia, t } from "elysia"
import { treaty } from "@elysiajs/eden"
import { openapi } from "@elysiajs/openapi"
import { createFileRoute } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { todoDto } from "~/features/todos/server/todo-dto"
import { todoInsertSchema, todoSelectSchema } from "~/features/todos/schemas/todo-schema"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

const app = new Elysia({ prefix: "/api" })
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

      case "VALIDATION":
        set.status = 400

        return {
          error: error.message,
          code: "VALIDATION_ERROR",
        }

      default:
        set.status = 500

        return {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        }
    }
  })
  .use(
    openapi({
      path: "/swagger",
      documentation: {
        info: {
          title: "Todo API",
          version: "1.0.0",
          description: "API for managing todos",
        },
        tags: [{ name: "Todos", description: "Todo management endpoints" }],
      },
    }),
  )
  .group("/todos", (app) =>
    app
      .get(
        "/",
        async ({ set }) => {
          set.status = 200

          return await todoDto.getAll()
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

          return await todoDto.create(body.text)
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

          return await todoDto.update(params.id, {
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

          return await todoDto.delete(params.id)
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

const handle = ({ request }: { request: Request }) => {
  return app.fetch(request)
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<typeof app>(import.meta.env.VITE_APP_URL || "http://localhost:3000").api)
