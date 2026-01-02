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
import { getTextInputClassName, getInputFieldClassName } from "~/features/todos/utils/form"
import { Loader } from "~/components/ui/loader"
import { cn } from "~/utils/cn"
import type { Todo } from "~/features/todos/types/schemas/todo-schema"

type TodoFormProps =
  | { isEdit: false; onSuccess: () => void }
  | { isEdit: true; todo: Todo; onCancel: () => void }

export function TodoForm(props: TodoFormProps) {
  const { user } = useAuth()
  const isEdit = props.isEdit

  const defaultValues: TodoFormValues = isEdit
    ? {
        text: props.todo.text,
        priority: (props.todo.priority ?? "medium") as TodoFormValues["priority"],
        urgency: (props.todo.urgency ?? "medium") as TodoFormValues["urgency"],
        estimatedTime: props.todo.estimated_time ?? null,
        actualTime: props.todo.actual_time ?? null,
      }
    : DEFAULT_FORM_VALUES

  const form = useForm({
    defaultValues,
    validators: {
      onChange: todoFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        todoCollection.update(props.todo.id, (draft) => {
          draft.text = value.text.trim()
          draft.priority = value.priority
          draft.urgency = value.urgency
          draft.estimated_time = value.estimatedTime
          draft.actual_time = value.actualTime
        })

        props.onCancel()
      } else {
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
        props.onSuccess()
      }
    },
  })

  const textField = (
    <form.Field name="text">
      {(field) => (
        <div className={isEdit ? "relative flex-1" : "flex flex-col gap-2"}>
          <div className="flex gap-2">
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={FORM_PLACEHOLDERS.text}
              className={
                isEdit
                  ? getInputFieldClassName(
                      field.state.meta.errors.length > 0,
                      form.state.isSubmitted || field.state.meta.isTouched,
                      "flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                    )
                  : getTextInputClassName(
                      field.state.meta.errors.length > 0,
                      form.state.isSubmitted || field.state.meta.isTouched,
                    )
              }
            />
            {!isEdit && (
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="relative rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 min-w-[100px] min-h-[40px] flex items-center justify-center border-2 border-blue-600"
                  >
                    {isSubmitting ? <Loader /> : BUTTON_LABELS.add}
                  </button>
                )}
              </form.Subscribe>
            )}
          </div>
          {(form.state.isSubmitted || field.state.meta.isTouched) &&
            field.state.meta.errors.length > 0 && (
              <p
                className={
                  isEdit
                    ? "absolute top-full left-0 mt-1 text-sm text-red-600"
                    : "text-sm text-red-600"
                }
              >
                {field.state.meta.errors.map((err) => err?.message ?? "Invalid input").join(", ")}
              </p>
            )}
        </div>
      )}
    </form.Field>
  )

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={isEdit ? "" : "space-y-4"}
    >
      {!isEdit && textField}

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
            <div
              className={cn(
                "grid grid-cols-2 gap-4",
                isEdit && hasTextError && "mt-8",
                !isEdit && "mt-0",
              )}
            >
              <form.Field name="priority">
                {(field) => (
                  <div className={cn("flex flex-col gap-2", isEdit && "relative")}>
                    <label
                      htmlFor={isEdit ? `priority-${props.todo.id}` : "priority"}
                      className="text-sm font-medium text-gray-700"
                    >
                      {FORM_LABELS.priority}
                    </label>
                    <select
                      id={isEdit ? `priority-${props.todo.id}` : "priority"}
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
                        <p
                          className={
                            isEdit
                              ? "absolute top-full left-0 mt-1 text-sm text-red-600"
                              : "text-sm text-red-600"
                          }
                        >
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
                  <div className={cn("flex flex-col gap-2", isEdit && "relative")}>
                    <label
                      htmlFor={isEdit ? `urgency-${props.todo.id}` : "urgency"}
                      className="text-sm font-medium text-gray-700"
                    >
                      {FORM_LABELS.urgency}
                    </label>
                    <select
                      id={isEdit ? `urgency-${props.todo.id}` : "urgency"}
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
                        <p
                          className={
                            isEdit
                              ? "absolute top-full left-0 mt-1 text-sm text-red-600"
                              : "text-sm text-red-600"
                          }
                        >
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

      <div className={cn("grid grid-cols-1 gap-2", isEdit && "mt-4")}>
        <form.Field name="estimatedTime">
          {(field) => {
            const { hours, minutes } = minutesToHoursAndMinutes(field.state.value)
            const { onHoursChange, onMinutesChange } = createTimeInputHandler(
              hours,
              field.handleChange,
            )

            return (
              <div className={cn("flex flex-col gap-2", isEdit && "relative")}>
                <label
                  htmlFor={isEdit ? `estimatedTime-${props.todo.id}` : "estimatedTime"}
                  className="text-sm font-medium text-gray-700"
                >
                  {FORM_LABELS.estimatedTime}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id={isEdit ? `estimatedTime-hours-${props.todo.id}` : "estimatedTime-hours"}
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
                      id={isEdit ? `estimatedTime-${props.todo.id}` : "estimatedTime"}
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
                    <p
                      className={
                        isEdit
                          ? "absolute top-full left-0 mt-1 text-sm text-red-600"
                          : "text-sm text-red-600"
                      }
                    >
                      {field.state.meta.errors
                        .map((err) => err?.message ?? "Invalid input")
                        .join(", ")}
                    </p>
                  )}
              </div>
            )
          }}
        </form.Field>
        <span className="sm:text-sm text-xs text-rose-600">
          ※ 時間または分のいずれか一方のみを入力で時間・分が自動算出されます
          <br />
          （例: 1時間入力の場合、時間に1を入力すると、分に60が入力されます）
        </span>
      </div>
    </form>
  )

  if (isEdit) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={props.todo.completed ?? false}
            onChange={() =>
              todoCollection.update(props.todo.id, (draft) => {
                draft.completed = !(props.todo.completed ?? false)
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
                            className={cn(
                              "rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent min-w-[80px] min-h-[32px] flex items-center justify-center",
                              isSubmitting && "border-2 ring-1",
                            )}
                          >
                            {isSubmitting ? <Loader /> : BUTTON_LABELS.save}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              props.onCancel()
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
            onClick={() => todoCollection.delete(props.todo.id)}
            className="rounded px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            {BUTTON_LABELS.delete}
          </button>
        </div>

        {formContent}
        <div className={cn("grid grid-cols-1 gap-2", "mt-4")}>
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
                    htmlFor={`actualTime-${props.todo.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {FORM_LABELS.actualTime}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        id={`actualTime-hours-${props.todo.id}`}
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
                        id={`actualTime-${props.todo.id}`}
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
          <span className="sm:text-sm text-xs text-rose-600">
            ※ 時間または分のいずれか一方のみを入力で時間・分が自動算出されます
            <br />
            （例: 1時間入力の場合、時間に1を入力すると、分に60が入力されます）
          </span>
        </div>
      </div>
    )
  }

  return formContent
}
