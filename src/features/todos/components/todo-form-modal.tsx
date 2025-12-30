import { TodoForm } from "~/features/todos/components/todo-form"
import { TODO_MODAL_ID } from "~/features/todos/constants"
import { cn } from "~/utils/cn"

export function TodoFormModal() {
  return (
    <div
      id={TODO_MODAL_ID}
      popover="auto"
      className={cn(
        "[&:popover-open]:fixed [&:popover-open]:inset-0 [&:popover-open]:m-auto",
        "[&:popover-open]:w-full [&:popover-open]:max-w-2xl [&:popover-open]:max-h-[90vh]",
        "[&:popover-open]:flex [&:popover-open]:flex-col",
        "[&:popover-open]:bg-white [&:popover-open]:rounded-lg [&:popover-open]:shadow-xl [&:popover-open]:p-6",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
      )}
    >
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-900">新しいTodoを作成</h2>
        <button
          type="button"
          popoverTarget={TODO_MODAL_ID}
          popoverTargetAction="hide"
          className="text-gray-400 hover:text-gray-600 transition-colors absolute right-0 top-0"
          aria-label="閉じる"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto">
        <TodoForm />
      </div>
    </div>
  )
}
