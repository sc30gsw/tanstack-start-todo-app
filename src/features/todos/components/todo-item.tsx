import { memo, useCallback, useState } from "react"
import { useForm } from "@tanstack/react-form"
import type { Todo } from "~/features/todos/types/schemas/todo-schema"
import { todoCollection } from "~/features/todos/collections"
import {
  todoFormSchema,
  type TodoFormValues,
} from "~/features/todos/types/schemas/todo-form-schema"
import { cn } from "~/utils/cn"
import { getStatusLabel, getStatusColorClass } from "~/features/todos/utils/statuses"
import {
  BUTTON_LABELS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  PRIORITY_OPTIONS,
  URGENCY_OPTIONS,
} from "~/features/todos/constants/form"
import { minutesToHoursAndMinutes, createTimeInputHandler } from "~/features/todos/utils/time"
import { getInputFieldClassName } from "~/features/todos/utils/form"

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
              getStatusColorClass(todo.priority),
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
              getStatusColorClass(todo.urgency),
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

type TodoItemEditProps = {
  todo: Todo
  onCancel: () => void
}

const TodoItemEdit = memo(function TodoItemEdit({ todo, onCancel }: TodoItemEditProps) {
  const defaultValues: TodoFormValues = {
    text: todo.text,
    priority: (todo.priority ?? "medium") as "high" | "medium" | "low",
    urgency: (todo.urgency ?? "medium") as "high" | "medium" | "low",
    estimatedTime: todo.estimated_time ?? null,
    actualTime: todo.actual_time ?? null,
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: todoFormSchema,
    },
    onSubmit: async ({ value }) => {
      todoCollection.update(todo.id, (draft) => {
        draft.text = value.text.trim()
        draft.priority = value.priority
        draft.urgency = value.urgency
        draft.estimated_time = value.estimatedTime
        draft.actual_time = value.actualTime
      })
      onCancel()
    },
  })

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
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
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={getInputFieldClassName(
                      field.state.meta.errors.length > 0,
                      form.state.isSubmitted || field.state.meta.isTouched,
                      "flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
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
                          {isSubmitting ? "..." : BUTTON_LABELS.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onCancel()
                            form.reset()
                          }}
                          className="rounded px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          {BUTTON_LABELS.cancel}
                        </button>
                      </>
                    )}
                  </form.Subscribe>
                </div>
                {(form.state.isSubmitted || field.state.meta.isTouched) &&
                  field.state.meta.errors.length > 0 && (
                    <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                      {field.state.meta.errors
                        .map((err) => err?.message ?? "Invalid input")
                        .join(", ")}
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
          {BUTTON_LABELS.delete}
        </button>
      </div>

      <form.Subscribe
        selector={(state) => [
          state.fieldMeta.text?.errors,
          state.fieldMeta.text?.isTouched,
          state.isSubmitted,
        ]}
      >
        {([textErrors, isTextTouched, isSubmitted]) => {
          const hasTextError =
            (isSubmitted || isTextTouched) && Array.isArray(textErrors) && textErrors.length > 0

          return (
            <div className={cn("grid grid-cols-2 gap-4", hasTextError && "mt-8")}>
              <form.Field name="priority">
                {(field) => (
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor={`priority-${todo.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {FORM_LABELS.priority}
                    </label>
                    <select
                      id={`priority-${todo.id}`}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value as TodoFormValues["priority"])
                      }
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                      )}
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {(form.state.isSubmitted || field.state.meta.isTouched) &&
                      field.state.meta.errors.length > 0 && (
                        <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                          {field.state.meta.errors
                            .map((err) => err?.message ?? "Invalid input")
                            .join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <form.Field name="urgency">
                {(field) => (
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor={`urgency-${todo.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {FORM_LABELS.urgency}
                    </label>
                    <select
                      id={`urgency-${todo.id}`}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value as TodoFormValues["urgency"])
                      }
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                      )}
                    >
                      {URGENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {(form.state.isSubmitted || field.state.meta.isTouched) &&
                      field.state.meta.errors.length > 0 && (
                        <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                          {field.state.meta.errors
                            .map((err) => err?.message ?? "Invalid input")
                            .join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
            </div>
          )
        }}
      </form.Subscribe>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <form.Field name="estimatedTime">
          {(field) => {
            const { hours, minutes } = minutesToHoursAndMinutes(field.state.value)
            const { onHoursChange, onMinutesChange } = createTimeInputHandler(
              hours,
              field.handleChange,
            )

            return (
              <div className="relative flex flex-col gap-2">
                <label
                  htmlFor={`estimatedTime-${todo.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {FORM_LABELS.estimatedTime}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id={`estimatedTime-hours-${todo.id}`}
                      type="number"
                      min="0"
                      step="0.25"
                      value={hours === null ? "" : hours}
                      onChange={onHoursChange}
                      placeholder={FORM_PLACEHOLDERS.hours}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id={`estimatedTime-${todo.id}`}
                      type="number"
                      min="0"
                      value={minutes === null ? "" : minutes}
                      onChange={onMinutesChange}
                      placeholder={FORM_PLACEHOLDERS.minutes}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                </div>
                {(form.state.isSubmitted || field.state.meta.isTouched) &&
                  field.state.meta.errors.length > 0 && (
                    <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                      {field.state.meta.errors
                        .map((err) => err?.message ?? "Invalid input")
                        .join(", ")}
                    </p>
                  )}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="actualTime">
          {(field) => {
            const { hours, minutes } = minutesToHoursAndMinutes(field.state.value)
            const { onHoursChange, onMinutesChange } = createTimeInputHandler(
              hours,
              field.handleChange,
            )

            return (
              <div className="relative flex flex-col gap-2">
                <label
                  htmlFor={`actualTime-${todo.id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {FORM_LABELS.actualTime}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id={`actualTime-hours-${todo.id}`}
                      type="number"
                      min="0"
                      step="0.25"
                      value={hours === null ? "" : hours}
                      onChange={onHoursChange}
                      placeholder={FORM_PLACEHOLDERS.hours}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id={`actualTime-${todo.id}`}
                      type="number"
                      min="0"
                      value={minutes === null ? "" : minutes}
                      onChange={onMinutesChange}
                      placeholder={FORM_PLACEHOLDERS.minutes}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted || field.state.meta.isTouched,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                </div>
                {(form.state.isSubmitted || field.state.meta.isTouched) &&
                  field.state.meta.errors.length > 0 && (
                    <p className="absolute top-full left-0 mt-1 text-sm text-red-600">
                      {field.state.meta.errors
                        .map((err) => err?.message ?? "Invalid input")
                        .join(", ")}
                    </p>
                  )}
              </div>
            )
          }}
        </form.Field>
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
    <TodoItemEdit todo={todo} onCancel={handleCancel} />
  ) : (
    <TodoItemView todo={todo} onEdit={handleEdit} />
  )
})
