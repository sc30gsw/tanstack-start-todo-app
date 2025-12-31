import { Suspense } from "react"
import { TodoSearch } from "~/features/todos/components/todo-search"
import { TodoListContent } from "~/features/todos/components/todo-list-content"
import { ClientOnly } from "@tanstack/react-router"

function TodoItemSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded border border-gray-300 bg-gray-200 animate-pulse" />
        <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

function TodoListLoading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <TodoItemSkeleton key={index} />
      ))}
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
