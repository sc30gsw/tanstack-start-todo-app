import { memo, useCallback, useState } from "react"
import type { Todo } from "~/features/todos/types/schemas/todo-schema"
import { todoCollection } from "~/features/todos/collections"
import { cn } from "~/utils/cn"
import { BUTTON_LABELS, FORM_LABELS } from "~/features/todos/constants/form"
import { TodoForm } from "./todo-form"
import { getStatusColors } from "~/features/todos/utils/get-status-colors"
import { getStatusLabel } from "~/features/todos/utils/get-status-label"

type TodoItemViewProps = {
  todo: Todo
  onEdit: () => void
}

const TodoItemView = memo(function TodoItemView({ todo, onEdit }: TodoItemViewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed ?? false}
          onChange={() =>
            todoCollection.update(todo.id, (draft) => {
              draft.completed = !(todo.completed ?? false)
            })
          }
          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span
          className={cn("flex-1", todo.completed ? "text-gray-500 line-through" : "text-gray-900")}
        >
          {todo.text}
        </span>
        <button
          onClick={onEdit}
          className="rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          {BUTTON_LABELS.edit}
        </button>
        <button
          onClick={() => todoCollection.delete(todo.id)}
          className="rounded px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          {BUTTON_LABELS.delete}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="font-medium text-gray-600">{FORM_LABELS.priority}:</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              getStatusColors(todo.priority),
            )}
          >
            {getStatusLabel(todo.priority)}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="font-medium text-gray-600">{FORM_LABELS.urgency}:</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              getStatusColors(todo.urgency),
            )}
          >
            {getStatusLabel(todo.urgency)}
          </span>
        </span>
        {todo.estimated_time !== null && todo.estimated_time !== undefined && (
          <span>
            <span className="font-medium">{FORM_LABELS.estimatedTime}:</span> {todo.estimated_time}
            分
          </span>
        )}
        {todo.actual_time !== null && todo.actual_time !== undefined && (
          <span>
            <span className="font-medium">{FORM_LABELS.actualTime}:</span> {todo.actual_time}分
          </span>
        )}
      </div>
    </div>
  )
})

export const TodoItem = memo(function TodoItem({ todo }: Record<"todo", Todo>) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  return isEditing ? (
    <TodoForm isEdit={isEditing} todo={todo} onCancel={handleCancel} />
  ) : (
    <TodoItemView todo={todo} onEdit={handleEdit} />
  )
})
