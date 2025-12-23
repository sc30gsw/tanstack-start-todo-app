import { useLiveSuspenseQuery } from "@tanstack/react-db"
import { todoCollection } from "~/features/todos/collections"
import { eq, like } from "@tanstack/db"
import type { SearchParams } from "~/features/todos/schemas/search-schema"

export function useTodosQuery({
  q: searchQuery,
  completed,
  sortBy = "createdAt",
  sortOrder = "desc",
}: SearchParams = {}) {
  return useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ todo: todoCollection })

      if (typeof completed === "boolean") {
        query = query.where(({ todo }) => eq(todo.completed, completed))
      }

      if (searchQuery) {
        query = query.where(({ todo }) => {
          return like(todo.text, `%${searchQuery}%`)
        })
      }

      switch (sortBy) {
        case "createdAt":
          query = query.orderBy(({ todo }) => todo.created_at, sortOrder)
          break

        case "text":
          query = query.orderBy(({ todo }) => todo.text, sortOrder)
          break
      }

      return query
    },
    [completed, searchQuery, sortBy, sortOrder],
  )
}
