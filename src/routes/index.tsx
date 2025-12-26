import { createFileRoute } from "@tanstack/react-router"
import { TodoList } from "~/features/todos/components/todo-list"

export const Route = createFileRoute("/")({
  component: TodoList,
})
