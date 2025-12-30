import { createCollection } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { getTreaty } from "~/routes/api/$"
import { QueryClient } from "@tanstack/react-query"
import { todoSchema } from "~/features/todos/schemas/todo-schema"
import { getAuth } from "@workos/authkit-tanstack-react-start"

const queryClient = new QueryClient()

const api = getTreaty()

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["todos"],
    queryFn: async () => {
      const { user } = await getAuth()

      if (!user) {
        throw new Error("User not found")
      }

      try {
        await api.todos.batch["delete-old"].post({ headers: { authorization: user.id } })
      } catch (error) {
        console.error("Batch job error:", error)
      }

      const response = await api.todos.get({ headers: { authorization: user.id } })

      if (response.status !== 200) {
        throw new Error(response.error?.value?.message || "Failed to fetch todos")
      }

      if (!response.data) {
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

      const { user } = await getAuth()

      if (!user) {
        throw new Error("User not found")
      }

      await api.todos.post({ text: newTodo.text }, { headers: { authorization: user.id } })
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0]

      if (!original.id) {
        throw new Error("Todo item must have an id")
      }

      const { user } = await getAuth()

      if (!user) {
        throw new Error("User not found")
      }

      await api.todos({ id: original.id }).patch(
        {
          text: modified.text,
          completed: modified.completed,
          user_id: user.id,
        },
        {
          headers: { authorization: user.id },
        },
      )
    },
    onDelete: async ({ transaction }) => {
      const original = transaction.mutations[0].original

      if (!original.id) {
        throw new Error("Todo item must have an id")
      }

      const { user } = await getAuth()

      if (!user) {
        throw new Error("User not found")
      }

      await api.todos({ id: original.id }).delete({ headers: { authorization: user.id } })
    },
  }),
)
