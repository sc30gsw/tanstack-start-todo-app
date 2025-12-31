import { useLiveSuspenseQuery } from "@tanstack/react-db"
import { todoCollection } from "~/features/todos/collections"
import { eq, like } from "@tanstack/db"

import { getRouteApi } from "@tanstack/react-router"

export function useTodosQuery() {
  const routeApi = getRouteApi("/_authenticated/")
  const search = routeApi.useSearch()
  const searchQuery = search.q ?? ""
  const completed = search.completed
  const priority = search.priority
  const urgency = search.urgency
  const sortBy = search.sortBy
  const sortOrder = search.sortOrder

  return useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ todo: todoCollection })

      if (typeof completed === "boolean") {
        query = query.where(({ todo }) => eq(todo.completed, completed))
      }

      if (priority !== undefined) {
        query = query.where(({ todo }) => eq(todo.priority, priority))
      }

      if (urgency !== undefined) {
        query = query.where(({ todo }) => eq(todo.urgency, urgency))
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

        case "priority":
          query = query.orderBy(({ todo }) => todo.priority, sortOrder)
          break

        case "urgency":
          query = query.orderBy(({ todo }) => todo.urgency, sortOrder)
          break
      }

      return query
    },
    [completed, priority, urgency, searchQuery, sortBy, sortOrder],
  )
}
