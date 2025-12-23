import { db as drizzleDb } from "~/db"
import { todos } from "~/db/schema"
import { eq } from "drizzle-orm"
import type { Todo } from "~/features/todos/schemas/todo-schema"

export async function getTodos() {
  if (!drizzleDb) {
    throw new Error("Database not initialized")
  }

  const result = await drizzleDb.query.todos.findMany()

  return result
}

export async function createTodo(text: Todo["text"]) {
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
}

export async function updateTodo(
  id: Todo["id"],
  data: {
    text?: Todo["text"]
    completed?: Todo["completed"]
  },
) {
  if (!drizzleDb) {
    throw new Error("Database not initialized")
  }

  const result = await drizzleDb
    .update(todos)
    .set({
      text: data.text,
      completed: data.completed ?? null,
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
}

export async function deleteTodo(id: Todo["id"]) {
  if (!drizzleDb) {
    throw new Error("Database not initialized")
  }

  await drizzleDb.delete(todos).where(eq(todos.id, id))

  return { success: true }
}
