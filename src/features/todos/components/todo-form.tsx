import { useForm } from "@tanstack/react-form"
import { todoCollection } from "~/features/todos/collections"
import { todoFormSchema } from "~/features/todos/schemas/todo-form-schema"

export function TodoForm() {
  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onChange: todoFormSchema,
    },
    onSubmit: async ({ value }) => {
      todoCollection.insert({
        id: crypto.randomUUID(),
        text: value.text.trim(),
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      })

      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="mb-6"
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
                placeholder="Add a new todo..."
                className={`flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  field.state.meta.errors.length > 0
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "..." : "Add"}
                  </button>
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
  )
}
