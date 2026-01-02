import type { Todo } from "~/features/todos/types/schemas/todo-schema"

export function getStatusColors(priority: Todo["priority"] | Todo["urgency"]) {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50"

    case "medium":
      return "text-yellow-600 bg-yellow-50"

    case "low":
      return "text-green-600 bg-green-50"

    default:
      return "text-gray-600 bg-gray-50"
  }
}
