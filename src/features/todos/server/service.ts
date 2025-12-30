import { db } from "~/db"
import { todos } from "~/db/schema"
import { eq, and } from "drizzle-orm"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

export abstract class TodoService {
  static async getAll(userId: (typeof todos.$inferSelect)["user_id"]) {
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

  static async create(
    data: Pick<
      typeof todos.$inferInsert,
      "text" | "priority" | "urgency" | "estimated_time" | "actual_time"
    >,
    userId: (typeof todos.$inferSelect)["user_id"],
  ) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const result = await db
        .insert(todos)
        .values({
          text: data.text,
          priority: data.priority,
          urgency: data.urgency,
          estimated_time: data.estimated_time,
          actual_time: data.actual_time,
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
    data: Pick<typeof todos.$inferInsert, "text"> &
      Partial<
        Pick<
          typeof todos.$inferInsert,
          "completed" | "priority" | "urgency" | "estimated_time" | "actual_time"
        >
      >,
    userId: (typeof todos.$inferSelect)["user_id"],
  ) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
      const existing = await db.query.todos.findFirst({
        where: and(eq(todos.id, id), eq(todos.user_id, userId)),
      })

      if (!existing) {
        throw new TodoNotFoundError(id)
      }

      const updateData = {
        ...existing,
        ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)),
      } as const satisfies typeof todos.$inferInsert

      const result = await db
        .update(todos)
        .set(updateData)
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

  static async delete(
    id: (typeof todos.$inferSelect)["id"],
    userId: (typeof todos.$inferSelect)["user_id"],
  ) {
    if (!db) {
      throw new DatabaseError("Database not initialized")
    }

    try {
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
}
