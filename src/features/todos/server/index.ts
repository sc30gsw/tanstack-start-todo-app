import { Elysia } from "elysia"
import { TodoService } from "~/features/todos/server/service"
import { TodoModel } from "~/features/todos/server/model"
import { DatabaseError, TodoNotFoundError } from "~/features/todos/server/errors"
import { sessionMiddleware } from "~/lib/session-middleware"

export const todoPlugin = new Elysia({ prefix: "/todos", name: "todo" })
  .use(sessionMiddleware)
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
    async ({ user }) => {
      return await TodoService.getAll(user.id)
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
    async ({ body, user }) => {
      return await TodoService.create(body, user.id)
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
    async ({ params, body, user }) => {
      return await TodoService.update(params.id, body, user.id)
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
    async ({ params, user }) => {
      return await TodoService.delete(params.id, user.id)
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
