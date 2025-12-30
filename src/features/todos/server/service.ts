import { db } from "~/db"
import { todos } from "~/db/schema"
import { eq, and, lt } from "drizzle-orm"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

export abstract class TodoService {
  static async getAll(userId: string) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const result = await db.query.todos.findMany({
        where: eq(todos.user_id, userId),
      })

      return result
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch todos: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  static async create(text: (typeof todos.$inferInsert)["text"], userId: string) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const result = await db
        .insert(todos)
        .values({
          text,
          user_id: userId,
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
    userId: string,
  ) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      // まず、ToDoが存在し、かつユーザーが所有していることを確認
      const existing = await db.query.todos.findFirst({
        where: and(eq(todos.id, id), eq(todos.user_id, userId)),
      })

      if (!existing) {
        throw new TodoNotFoundError(id)
      }

      const result = await db
        .update(todos)
        .set({
          text: data.text,
          completed: data.completed ?? false,
        })
        .where(and(eq(todos.id, id), eq(todos.user_id, userId)))
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

  static async delete(id: (typeof todos.$inferSelect)["id"], userId: string) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      // まず、ToDoが存在し、かつユーザーが所有していることを確認
      const existing = await db.query.todos.findFirst({
        where: and(eq(todos.id, id), eq(todos.user_id, userId)),
      })

      if (!existing) {
        throw new TodoNotFoundError(id)
      }

      await db.delete(todos).where(and(eq(todos.id, id), eq(todos.user_id, userId)))

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

  static async deleteOldTodos() {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      const result = await db
        .delete(todos)
        .where(lt(todos.created_at, twentyFourHoursAgo))
        .returning()

      return { deletedCount: result.length, success: true }
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete old todos: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }
}
