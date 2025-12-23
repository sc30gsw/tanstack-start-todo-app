import { db as drizzleDb } from "~/db"
import { todos } from "~/db/schema"
import { eq } from "drizzle-orm"
import type { Todo } from "~/features/todos/schemas/todo-schema"

export const todoDto = {
  getAll: async () => {
    if (!drizzleDb) {
      throw new Error("Database not initialized")
    }

    const result = await drizzleDb.query.todos.findMany()

    return result
  },

  create: async (text: Todo["text"]) => {
    if (!drizzleDb) {
      throw new Error("Database not initialized")
    }

    const result = await drizzleDb
      .insert(todos)
      .values({
        text,
      })
      .returning()

    return result[0]
  },

  update: async (id: Todo["id"], data: Partial<Pick<Todo, "text" | "completed">>) => {
    if (!drizzleDb) {
      throw new Error("Database not initialized")
    }

    const result = await drizzleDb
      .update(todos)
      .set({
        text: data.text,
        completed: data.completed ?? false,
      })
      .where(eq(todos.id, id))
      .returning()

    const todo = result[0]
    if (!todo) {
      return undefined
    }

    return {
      ...todo,
      completed: todo.completed ?? undefined,
    }
  },

  delete: async (id: Todo["id"]) => {
    if (!drizzleDb) {
      throw new Error("Database not initialized")
    }

    await drizzleDb.delete(todos).where(eq(todos.id, id))

    return { success: true }
  },
} as const satisfies Record<string, (...args: any[]) => Promise<any>>
