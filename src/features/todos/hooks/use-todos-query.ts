import { useLiveSuspenseQuery } from "@tanstack/react-db"
import { todoCollection } from "~/features/todos/collections"
import { eq, like } from "@tanstack/db"

import { getRouteApi } from "@tanstack/react-router"

export function useTodosQuery() {
  const routeApi = getRouteApi("/")
  const search = routeApi.useSearch()
  const searchQuery = search.q ?? ""
  const completed = search.completed
  const sortBy = search.sortBy
  const sortOrder = search.sortOrder

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
