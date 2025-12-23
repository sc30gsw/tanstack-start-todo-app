import { getRouteApi } from "@tanstack/react-router"
import { useLiveQuery } from "@tanstack/react-db"
import { todoCollection } from "~/features/todos/collections"
import { TodoItem } from "~/features/todos/components/todo-item"
import { eq } from "@tanstack/db"

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

      if (searchQuery.trim()) {
        query = query.where(({ todo }) => {
          // #region agent log
          fetch("http://127.0.0.1:7244/ingest/6ec05b2f-c451-4d53-b48e-14dbfa335171", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "todo-list-content.tsx:24",
              message: "Before String conversion - todo.text analysis",
              data: {
                todoText: todo.text,
                todoTextType: typeof todo.text,
                todoTextConstructor: todo.text?.constructor?.name,
                todoTextValueOf: todo.text?.valueOf?.(),
                todoTextToString: todo.text?.toString?.(),
                todoKeys: Object.keys(todo),
                todoTextIsNull: todo.text === null,
                todoTextIsUndefined: todo.text === undefined,
                searchQuery,
                hypothesisId: "A",
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
            }),
          }).catch(() => {})
          // #endregion

          // #region agent log
          let textValue: string
          try {
            textValue = String(todo.text ?? "").toLowerCase()
            fetch("http://127.0.0.1:7244/ingest/6ec05b2f-c451-4d53-b48e-14dbfa335171", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "todo-list-content.tsx:25",
                message: "After String conversion - success",
                data: { textValue, hypothesisId: "A" },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
              }),
            }).catch(() => {})
          } catch (error) {
            fetch("http://127.0.0.1:7244/ingest/6ec05b2f-c451-4d53-b48e-14dbfa335171", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "todo-list-content.tsx:25",
                message: "String conversion failed",
                data: {
                  error: String(error),
                  errorMessage: error instanceof Error ? error.message : "Unknown error",
                  todoText: todo.text,
                  todoTextType: typeof todo.text,
                  hypothesisId: "A",
                },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
              }),
            }).catch(() => {})
            throw error
          }
          // #endregion

          const text = textValue
          return text.includes(searchQuery.toLowerCase())
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
