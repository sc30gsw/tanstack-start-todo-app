import { TodoForm } from "~/features/todos/components/todo-form"
import { TodoListWithSearch } from "~/features/todos/components/todo-list-with-search"

export function TodoList() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Todo App</h1>
      <TodoForm />
      <TodoListWithSearch />
    </>
  )
}
