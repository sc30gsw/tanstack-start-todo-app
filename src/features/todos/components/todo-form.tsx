import { useForm } from "@tanstack/react-form"
import { useAuth } from "@workos/authkit-tanstack-react-start/client"
import { todoCollection } from "~/features/todos/collections"
import {
  todoFormSchema,
  type TodoFormValues,
} from "~/features/todos/types/schemas/todo-form-schema"
import {
  DEFAULT_FORM_VALUES,
  PRIORITY_OPTIONS,
  URGENCY_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  BUTTON_LABELS,
} from "~/features/todos/constants/form"
import { minutesToHoursAndMinutes, createTimeInputHandler } from "~/features/todos/utils/time"
import {
  formatErrorMessage,
  getTextInputClassName,
  getInputFieldClassName,
} from "~/features/todos/utils/form"

export function TodoForm() {
  const { user } = useAuth()

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    validators: {
      onSubmit: todoFormSchema,
    },
    onSubmit: async ({ value }) => {
      todoCollection.insert({
        id: crypto.randomUUID(),
        text: value.text.trim(),
        completed: false,
        priority: value.priority,
        urgency: value.urgency,
        estimated_time: value.estimatedTime,
        actual_time: value.actualTime,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user?.id ?? "",
      })

      form.reset()
    },
  })
  console.log("🚀 ~ TodoForm ~ form:", form.state.errors)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
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
                placeholder={FORM_PLACEHOLDERS.text}
                className={getTextInputClassName(
                  field.state.meta.errors.length > 0,
                  form.state.isSubmitted,
                )}
              />
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "..." : BUTTON_LABELS.add}
                  </button>
                )}
              </form.Subscribe>
            </div>
            {form.state.isSubmitted && field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">{formatErrorMessage(field.state.meta.errors)}</p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="priority">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                {FORM_LABELS.priority}
              </label>
              <select
                id="priority"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as TodoFormValues["priority"])}
                className={getInputFieldClassName(
                  field.state.meta.errors.length > 0,
                  form.state.isSubmitted,
                )}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.state.isSubmitted && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">
                  {field.state.meta.errors.map((err) => err?.message ?? "Invalid input").join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="urgency">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor="urgency" className="text-sm font-medium text-gray-700">
                {FORM_LABELS.urgency}
              </label>
              <select
                id="urgency"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as TodoFormValues["urgency"])}
                className={getInputFieldClassName(
                  field.state.meta.errors.length > 0,
                  form.state.isSubmitted,
                )}
              >
                {URGENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.state.isSubmitted && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">
                  {field.state.meta.errors.map((err) => err?.message ?? "Invalid input").join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="estimatedTime">
          {(field) => {
            const { hours, minutes } = minutesToHoursAndMinutes(field.state.value)
            const { onHoursChange, onMinutesChange } = createTimeInputHandler(
              hours,
              field.handleChange,
            )

            return (
              <div className="flex flex-col gap-2">
                <label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.estimatedTime}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id="estimatedTime-hours"
                      type="number"
                      min="0"
                      step="0.25"
                      value={hours === null ? "" : hours}
                      onChange={onHoursChange}
                      placeholder={FORM_PLACEHOLDERS.hours}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id="estimatedTime"
                      type="number"
                      min="0"
                      value={minutes === null ? "" : minutes}
                      onChange={onMinutesChange}
                      placeholder={FORM_PLACEHOLDERS.minutes}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                </div>
                {form.state.isSubmitted && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {formatErrorMessage(field.state.meta.errors)}
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
              <div className="flex flex-col gap-2">
                <label htmlFor="actualTime" className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.actualTime}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id="actualTime-hours"
                      type="number"
                      min="0"
                      step="0.25"
                      value={hours === null ? "" : hours}
                      onChange={onHoursChange}
                      placeholder={FORM_PLACEHOLDERS.hours}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      id="actualTime"
                      type="number"
                      min="0"
                      value={minutes === null ? "" : minutes}
                      onChange={onMinutesChange}
                      placeholder={FORM_PLACEHOLDERS.minutes}
                      className={getInputFieldClassName(
                        field.state.meta.errors.length > 0,
                        form.state.isSubmitted,
                        "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                      )}
                    />
                  </div>
                </div>
                {form.state.isSubmitted && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {formatErrorMessage(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>
      </div>
    </form>
  )
}
