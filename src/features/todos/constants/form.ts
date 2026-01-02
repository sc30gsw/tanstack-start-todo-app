import type { TodoFormValues } from "~/features/todos/types/schemas/todo-form-schema"
import type { getStatusLabel } from "~/features/todos/utils/get-status-label"

export const DEFAULT_FORM_VALUES: TodoFormValues = {
  text: "",
  priority: "medium",
  urgency: "medium",
  estimatedTime: null,
  actualTime: null,
}

export const PRIORITY_OPTIONS = [
  { value: "high" as const, label: "高" },
  { value: "medium" as const, label: "中" },
  { value: "low" as const, label: "低" },
] as const satisfies {
  value: TodoFormValues["priority"]
  label: ReturnType<typeof getStatusLabel>
}[]

export const URGENCY_OPTIONS = [
  { value: "high" as const, label: "高" },
  { value: "medium" as const, label: "中" },
  { value: "low" as const, label: "低" },
] as const satisfies {
  value: TodoFormValues["urgency"]
  label: ReturnType<typeof getStatusLabel>
}[]

export const FORM_LABELS = {
  priority: "優先度",
  urgency: "緊急度",
  estimatedTime: "予測時間",
  actualTime: "実績時間",
  text: "Todo",
} as const satisfies Record<keyof TodoFormValues, string>

export const FORM_PLACEHOLDERS = {
  text: "Add a new todo...",
  hours: "時間",
  minutes: "分",
} as const satisfies Record<string, string>

export const BUTTON_LABELS = {
  add: "Add",
  save: "Save",
  cancel: "Cancel",
  edit: "Edit",
  delete: "Delete",
} as const satisfies Record<string, string>

export const ERROR_MESSAGES = {
  invalidInput: "Invalid input",
} as const satisfies Record<string, string>
