import { db } from "~/db"
import { todos } from "~/db/schema"
import { eq } from "drizzle-orm"
import type { Todo } from "~/features/todos/schemas/todo-schema"

export const todoDto = {
  getAll: async () => {
    if (!db) {
      throw new Error("Database not initialized")
    }

    const result = await db.query.todos.findMany()

    return result
  },

  create: async (text: Todo["text"]) => {
    if (!db) {
      throw new Error("Database not initialized")
    }

    const result = await db
      .insert(todos)
      .values({
        text,
      })
      .returning()

    return result[0]
  },

  update: async (id: Todo["id"], data: Partial<Pick<Todo, "text" | "completed">>) => {
    if (!db) {
      throw new Error("Database not initialized")
    }

    const result = await db
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
    if (!db) {
      throw new Error("Database not initialized")
    }

    await db.delete(todos).where(eq(todos.id, id))

    return { success: true }
  },
} as const satisfies Record<string, (...args: any[]) => Promise<any>>
