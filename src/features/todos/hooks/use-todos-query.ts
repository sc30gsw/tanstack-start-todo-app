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
  const sorts = search.sorts ?? [{ field: "createdAt" as const, order: "desc" as const }]

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

      for (const sort of sorts) {
        switch (sort.field) {
          case "createdAt":
            query = query.orderBy(({ todo }) => todo.created_at, sort.order)
            break

          case "priority":
            query = query.orderBy(({ todo }) => todo.priority, sort.order)
            break

          case "urgency":
            query = query.orderBy(({ todo }) => todo.urgency, sort.order)
            break
        }
      }

      return query
    },
    [completed, priority, urgency, searchQuery, sorts],
  )
}
