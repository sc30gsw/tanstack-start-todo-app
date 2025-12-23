import { createCollection } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { getTreaty } from "~/routes/api/$"
import { QueryClient } from "@tanstack/react-query"
import { todoSchema } from "~/features/todos/schemas/todo-schema"

const queryClient = new QueryClient()

const api = getTreaty()

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.todos.get()

      if (!response.data || response.data.length === 0) {
        return []
      }

      const mappedData = response.data.map((todo) => {
        return {
          ...todo,
          completed: todo.completed ?? false,
        }
      })

      return mappedData
    },
    getKey: (item) => {
      if (!item.id) {
        throw new Error("Todo item must have an id")
      }

      return item.id
    },
    schema: todoSchema,
    onInsert: async ({ transaction }) => {
      const { changes: newTodo } = transaction.mutations[0]

      if (!newTodo.text) {
        throw new Error("Todo text is required")
      }

      await api.todos.post({ text: newTodo.text })
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0]

      if (!original.id) {
        throw new Error("Todo item must have an id")
      }

      await api.todos({ id: original.id }).patch({
        text: modified.text,
        completed: modified.completed,
      })
    },
    onDelete: async ({ transaction }) => {
      const original = transaction.mutations[0].original

      await api.todos({ id: original.id }).delete()
    },
  }),
)
