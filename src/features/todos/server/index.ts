import { Elysia } from "elysia"
import { TodoService } from "~/features/todos/server/service"
import { TodoModel } from "~/features/todos/server/model"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"

export const todoPlugin = new Elysia({ prefix: "/todos", name: "todo" })
  .error({
    DatabaseError,
    TodoNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "DatabaseError":
        set.status = error.status

        return {
          error: error.message,
          code: "DATABASE_ERROR",
        }

      case "TodoNotFoundError":
        set.status = error.status

        return {
          error: error.message,
          code: "TODO_NOT_FOUND",
        }

      default:
        throw error
    }
  })
  .get(
    "/",
    async () => {
      return await TodoService.getAll()
    },
    {
      response: {
        200: TodoModel.todoList,
      },
      detail: {
        summary: "Get all todos",
        tags: ["Todos"],
      },
    },
  )
  .post(
    "/",
    async ({ body }) => {
      return await TodoService.create(body.text)
    },
    {
      body: TodoModel.createBody,
      response: {
        201: TodoModel.todo,
      },
      detail: {
        summary: "Create a new todo",
        tags: ["Todos"],
      },
    },
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      return await TodoService.update(params.id, {
        text: body.text,
        completed: body.completed,
      })
    },
    {
      params: TodoModel.todoParams,
      body: TodoModel.updateBody,
      response: {
        200: TodoModel.todo,
      },
      detail: {
        summary: "Update a todo",
        tags: ["Todos"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      return await TodoService.delete(params.id)
    },
    {
      params: TodoModel.todoParams,
      response: {
        200: TodoModel.deleteResponse,
      },
      detail: {
        summary: "Delete a todo",
        tags: ["Todos"],
      },
    },
  )
