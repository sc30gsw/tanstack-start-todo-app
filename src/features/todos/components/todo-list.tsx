import { TodoForm } from "~/features/todos/components/todo-form"
import { TodoListWithSearch } from "~/features/todos/components/todo-list-with-search"

export function TodoList() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Todo App</h1>
        <TodoForm />
        <TodoListWithSearch />
      </div>
    </main>
  )
}
