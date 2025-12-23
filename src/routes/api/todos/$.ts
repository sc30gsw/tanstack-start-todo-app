import { Elysia, t } from "elysia"
import { createFileRoute } from "@tanstack/react-router"
import { db as drizzleDb } from "~/db"
import { todos } from "~/db/schema"
import { db } from "~/db/model"
import { eq } from "drizzle-orm"

export const todosApp = new Elysia({
  prefix: "/api/todos",
})
  .get(
    "/",
    async () => {
      if (!drizzleDb) {
        throw new Error("Database not initialized")
      }

      const result = await drizzleDb.query.todos.findMany()

      return result
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
      if (!drizzleDb) {
        throw new Error("Database not initialized")
      }

      const result = await drizzleDb
        .insert(todos)
        .values({
          text: body.text,
        })
        .returning()

      return result[0]
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
      if (!drizzleDb) {
        throw new Error("Database not initialized")
      }

      const result = await drizzleDb
        .update(todos)
        .set({
          text: body.text,
          completed: body.completed,
        })
        .where(eq(todos.id, params.id))
        .returning()

      return result[0] || null
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
      if (!drizzleDb) {
        throw new Error("Database not initialized")
      }

      await drizzleDb.delete(todos).where(eq(todos.id, params.id))

      return { success: true }
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
  )

const handle = ({ request }: { request: Request }) => {
  return todosApp.fetch(request)
}

export const Route = createFileRoute("/api/todos/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})
