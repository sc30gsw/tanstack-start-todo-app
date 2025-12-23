import { Elysia, t } from "elysia"
import { treaty } from "@elysiajs/eden"
import { openapi } from "@elysiajs/openapi"
import { createFileRoute } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getTodos, createTodo, updateTodo, deleteTodo } from "~/features/todos/queries"
import { db } from "~/db/model"

const app = new Elysia({ prefix: "/api" })
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
        async () => {
          return await getTodos()
        },
        {
          detail: {
            summary: "Get all todos",
            tags: ["Todos"],
          },
        },
      )
      .post(
        "/",
        async ({ body }) => {
          return await createTodo(body.text)
        },
        {
          body: t.Object({
            text: db.insert.todos.text,
          }),
          detail: {
            summary: "Create a new todo",
            tags: ["Todos"],
          },
        },
      )
      .patch(
        "/:id",
        async ({ params, body }) => {
          return await updateTodo(params.id, {
            text: body.text,
            completed: body.completed,
          })
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            text: t.Optional(db.insert.todos.text),
            completed: t.Optional(db.insert.todos.completed),
          }),
          detail: {
            summary: "Update a todo",
            tags: ["Todos"],
          },
        },
      )
      .delete(
        "/:id",
        async ({ params }) => {
          return await deleteTodo(params.id)
        },
        {
          params: t.Object({
            id: t.String(),
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
