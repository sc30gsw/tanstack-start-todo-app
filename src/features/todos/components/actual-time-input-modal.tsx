import { useForm } from "@tanstack/react-form"
import { todoCollection } from "~/features/todos/collections"
import type { Todo } from "~/features/todos/types/schemas/todo-schema"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "~/components/ui/revola"
import { minutesToHoursAndMinutes, createTimeInputHandler } from "~/features/todos/utils/time"
import { getInputFieldClassName } from "~/features/todos/utils/form"
import { FORM_LABELS, FORM_PLACEHOLDERS, BUTTON_LABELS } from "~/features/todos/constants/form"
import { Loader } from "~/components/ui/loader"
import * as v from "valibot"
import { todoFormSchema } from "~/features/todos/types/schemas/todo-form-schema"

type ActualTimeInputModalProps = {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActualTimeInputModal({ todo, open, onOpenChange }: ActualTimeInputModalProps) {
  const form = useForm({
    defaultValues: {
      actualTime: todo.actual_time ?? null,
    },
    validators: {
      onChange: v.pick(todoFormSchema, ["actualTime"]),
    },
    onSubmit: async ({ value }) => {
      todoCollection.update(todo.id, (draft) => {
        draft.actual_time = value.actualTime
      })

      onOpenChange(false)
      form.reset()
    },
  })

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[80vh] p-6 bg-white">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>実績時間を入力</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Todoアイテムの実績時間を入力してください。
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4 mt-4"
        >
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
                          form.state.isSubmitted || field.state.meta.isTouched,
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
                          form.state.isSubmitted || field.state.meta.isTouched,
                          "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                        )}
                      />
                    </div>
                  </div>
                  {(form.state.isSubmitted || field.state.meta.isTouched) &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-600">
                        {field.state.meta.errors
                          .map((err) => err?.message ?? "Invalid input")
                          .join(", ")}
                      </p>
                    )}
                </div>
              )
            }}
          </form.Field>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              キャンセル
            </button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="relative rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 min-w-[100px] min-h-[40px] flex items-center justify-center border-2 border-blue-600"
                >
                  {isSubmitting ? <Loader /> : BUTTON_LABELS.save || "保存"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
