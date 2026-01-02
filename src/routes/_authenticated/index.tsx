import { createFileRoute } from "@tanstack/react-router"
import { valibotValidator } from "@tanstack/valibot-adapter"
import { TodoList } from "~/features/todos/components/todo-list"
import { searchSchema, type SearchParams } from "~/features/todos/types/schemas/search-schema"

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: valibotValidator(searchSchema),
  search: {
    middlewares: [],
  },
  loaderDeps: ({ search: { q, completed, priority, urgency, sorts } }) => ({
    q,
    completed,
    priority,
    urgency,
    sorts,
  }),
  loader: ({ deps }): SearchParams => {
    return {
      q: deps.q,
      completed: deps.completed,
      priority: deps.priority,
      urgency: deps.urgency,
      sorts: deps.sorts,
    }
  },
  component: TodoList,
})
