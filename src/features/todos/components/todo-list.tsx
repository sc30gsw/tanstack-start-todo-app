import { getRouteApi } from "@tanstack/react-router"
import { TodoForm } from "~/features/todos/components/todo-form"
import { TodoListWithSearch } from "~/features/todos/components/todo-list-with-search"

export function TodoList() {
  return (
    <div className="grid grid-rows-[auto_auto_1fr] gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <h1 className="text-4xl font-bold text-gray-900">Todo App</h1>
        <ParentRouteContextText />
      </div>
      <TodoForm />
      <TodoListWithSearch />
    </div>
  )
}

// Name better name
function ParentRouteContextText() {
  // ? 親ルートのcontext(beforeLoadで設定したデータ)を取得
  const { href } = getRouteApi("/").useRouteContext()

  return <h3 className="text-blue-500 font-bold md:text-lg text-sm">Current URL: {href}</h3>
}
