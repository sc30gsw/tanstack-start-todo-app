import { createFileRoute } from "@tanstack/react-router"
import { TodoList } from "~/features/todos/components/todo-list"
import { searchSchema } from "~/features/todos/schemas/search-schema"

export const Route = createFileRoute("/")({
  component: TodoList,
  validateSearch: searchSchema,
})
