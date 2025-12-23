import { Suspense } from "react"
import { TodoSearch } from "~/features/todos/components/todo-search"
import { TodoListContent } from "~/features/todos/components/todo-list-content"
import { ClientOnly } from "~/components/client-only"

function TodoListLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <p className="text-xl">Loading...</p>
    </div>
  )
}

export function TodoListWithSearch() {
  return (
    <>
      <TodoSearch />
      <ClientOnly fallback={<TodoListLoading />}>
        <Suspense fallback={<TodoListLoading />}>
          <TodoListContent />
        </Suspense>
      </ClientOnly>
    </>
  )
}
