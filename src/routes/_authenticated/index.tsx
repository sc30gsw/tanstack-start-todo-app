import { createFileRoute } from "@tanstack/react-router"
import { valibotValidator } from "@tanstack/valibot-adapter"
import { TodoList } from "~/features/todos/components/todo-list"
import { searchSchema, type SearchParams } from "~/features/todos/types/schemas/search-schema"

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: valibotValidator(searchSchema),
  search: {
    middlewares: [],
  },
  loaderDeps: ({ search: { q, completed, priority, urgency, sortBy, sortOrder } }) => ({
    q,
    completed,
    priority,
    urgency,
    sortBy,
    sortOrder,
  }),
  loader: ({ deps }): SearchParams => {
    return {
      q: deps.q,
      completed: deps.completed,
      priority: deps.priority,
      urgency: deps.urgency,
      sortBy: deps.sortBy,
      sortOrder: deps.sortOrder,
    }
  },
  component: TodoList,
})
