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
