import { db } from "~/db"
import { todos } from "~/db/schema"
import { eq } from "drizzle-orm"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

export abstract class TodoService {
  static async getAll() {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const result = await db.query.todos.findMany()

      return result
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch todos: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  static async create(text: (typeof todos.$inferInsert)["text"]) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const result = await db
        .insert(todos)
        .values({
          text,
        })
        .returning()

      if (!result[0]) {
        throw new DatabaseError("Failed to create todo")
      }

      return result[0]
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof TodoNotFoundError) {
        throw error
      }

      throw new DatabaseError(
        `Failed to create todo: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  static async update(
    id: (typeof todos.$inferSelect)["id"],
    data: Partial<Pick<typeof todos.$inferInsert, "text" | "completed">>,
  ) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
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
        throw new TodoNotFoundError(id)
      }

      return {
        ...todo,
        completed: todo.completed ?? false,
      }
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof TodoNotFoundError) {
        throw error
      }

      throw new DatabaseError(
        `Failed to update todo: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  static async delete(id: (typeof todos.$inferSelect)["id"]) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const existing = await db.query.todos.findFirst({
        where: eq(todos.id, id),
      })

      if (!existing) {
        throw new TodoNotFoundError(id)
      }

      await db.delete(todos).where(eq(todos.id, id))

      return { success: true }
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof TodoNotFoundError) {
        throw error
      }

      throw new DatabaseError(
        `Failed to delete todo: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }
}
