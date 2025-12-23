import { memo, useCallback, useState } from "react"
import { useForm } from "@tanstack/react-form"
import type { Todo } from "~/features/todos/schemas/todo-schema"
import { todoCollection } from "~/features/todos/collections"
import { todoFormSchema } from "~/features/todos/schemas/todo-form-schema"
import { cn } from "~/utils/cn"

type TodoItemViewProps = {
  todo: Todo
  onEdit: () => void
}

const TodoItemView = memo(function TodoItemView({ todo, onEdit }: TodoItemViewProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
        Edit
      </button>
      <button
        onClick={() => todoCollection.delete(todo.id)}
        className="rounded px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  )
})

type TodoItemEditProps = {
  todo: Todo
  onCancel: () => void
}

const TodoItemEdit = memo(function TodoItemEdit({ todo, onCancel }: TodoItemEditProps) {
  const form = useForm({
    defaultValues: {
      text: todo.text,
    },
    validators: {
      onChange: todoFormSchema,
    },
    onSubmit: async ({ value }) => {
      todoCollection.update(todo.id, (draft) => {
        draft.text = value.text.trim()
      })
      onCancel()
    },
  })

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex-1"
      >
        <form.Field name="text">
          {(field) => (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                    field.state.meta.errors.length > 0
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  )}
                />
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <>
                      <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onCancel()
                          form.reset()
                        }}
                        className="rounded px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </form.Subscribe>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">
                  {field.state.meta.errors.map((err) => err?.message ?? "Invalid input").join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </form>
      <button
        onClick={() => todoCollection.delete(todo.id)}
        className="rounded px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        Delete
      </button>
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
    <TodoItemEdit todo={todo} onCancel={handleCancel} />
  ) : (
    <TodoItemView todo={todo} onEdit={handleEdit} />
  )
})
