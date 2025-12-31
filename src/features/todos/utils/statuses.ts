import type { Todo } from "~/features/todos/types/schemas/todo-schema"

export function getStatusLabel(priority: Todo["priority"] | Todo["urgency"]) {
  switch (priority) {
    case "high":
      return "高"

    case "medium":
      return "中"

    case "low":
      return "低"

    default:
      return "中"
  }
}

export function getStatusColorClass(priority: Todo["priority"] | Todo["urgency"]) {
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
