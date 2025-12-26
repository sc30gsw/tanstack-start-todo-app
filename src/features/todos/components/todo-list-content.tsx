import { getRouteApi } from "@tanstack/react-router"
import { TodoItem } from "~/features/todos/components/todo-item"
import { useTodosQuery } from "~/features/todos/hooks/use-todos-query"

export function TodoListContent() {
  const routeApi = getRouteApi("/")
  const search = routeApi.useSearch()
  const q = search.q ?? ""

  const { data } = useTodosQuery()

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {q ? "No todos found matching your search." : "No todos yet. Add one above!"}
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
