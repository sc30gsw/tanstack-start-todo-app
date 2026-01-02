import { useTransition } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { useAuth } from "@workos/authkit-tanstack-react-start/client"
import { TodoListWithSearch } from "~/features/todos/components/todo-list-with-search"
import { TodoFormModal } from "~/features/todos/components/todo-form-modal"

export function TodoList() {
  return (
    <div className="grid grid-rows-[auto_auto_1fr] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Todo App</h1>
        <SignOutButton />
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="col-span-1">
          <ParentRouteContextText />
        </div>
        <div className="col-span-1">
          <TodoFormModal
            trigger={
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                + 新しいTodo
              </button>
            }
          />
        </div>
      </div>
      <TodoListWithSearch />
    </div>
  )
}

function ParentRouteContextText() {
  // ? 親ルートのcontext(beforeLoadで設定したデータ)を取得
  const { href } = getRouteApi("/_authenticated/").useRouteContext()

  return (
    <h3 className="text-blue-500 font-bold md:text-lg text-sm min-w-0 break-all">
      Current URL: {href}
    </h3>
  )
}

function SignOutButton() {
  const [isPending, startTransition] = useTransition()
  const { signOut } = useAuth()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => await signOut())}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      ログアウト
    </button>
  )
}
