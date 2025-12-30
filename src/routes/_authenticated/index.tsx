import { createFileRoute } from "@tanstack/react-router"
import { valibotValidator } from "@tanstack/valibot-adapter"
import { TodoList } from "~/features/todos/components/todo-list"
import { searchSchema } from "~/features/todos/schemas/search-schema"
import type { SearchParams } from "~/features/todos/schemas/search-schema"

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: valibotValidator(searchSchema),
  search: {
    middlewares: [],
  },
  loaderDeps: ({ search: { q, completed, sortBy, sortOrder } }) => ({
    q,
    completed,
    sortBy,
    sortOrder,
  }),
  loader: ({ deps }): SearchParams => {
    return {
      q: deps.q,
      completed: deps.completed,
      sortBy: deps.sortBy,
      sortOrder: deps.sortOrder,
    }
  },
  component: TodoList,
})
