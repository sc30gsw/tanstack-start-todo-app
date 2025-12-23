import { getRouteApi } from "@tanstack/react-router"
import { useLiveQuery } from "@tanstack/react-db"
import { todoCollection } from "~/features/todos/collections"
import { TodoItem } from "~/features/todos/components/todo-item"
import { eq, like } from "@tanstack/db"

export function TodoListContent() {
  const routeApi = getRouteApi("/")
  const search = routeApi.useSearch()
  const searchQuery = search.q ?? ""
  const completedFilter = search.completed
  const sortBy = search.sortBy ?? "created_at"
  const sortOrder = search.sortOrder ?? "desc"

  const { data } = useLiveQuery(
    (q) => {
      let query = q.from({ todo: todoCollection })

      if (typeof completedFilter === "boolean") {
        query = query.where(({ todo }) => eq(todo.completed, completedFilter))
      }

      if (searchQuery) {
        query = query.where(({ todo }) => {
          return like(todo.text, `%${searchQuery}%`)
        })
      }

      if (sortBy === "created_at") {
        query = query.orderBy(({ todo }) => todo.created_at, sortOrder)
      } else if (sortBy === "text") {
        query = query.orderBy(({ todo }) => todo.text, sortOrder)
      }

      return query
    },
    [completedFilter, searchQuery, sortBy, sortOrder],
  )

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {searchQuery ? "No todos found matching your search." : "No todos yet. Add one above!"}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
