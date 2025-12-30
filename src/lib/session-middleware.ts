import { Elysia } from "elysia"
import { db } from "~/db"
import { DatabaseError } from "~/features/todos/server/errors"
import { getAuth } from "@workos/authkit-tanstack-react-start"

class UnauthorizedError extends Error {
  status = 401

  constructor() {
    super("Unauthorized")
    this.name = "UnauthorizedError"
  }
}

class UserNotFoundError extends Error {
  status = 404

  constructor() {
    super("User not found")
    this.name = "UserNotFoundError"
  }
}

export const sessionMiddleware = new Elysia({ name: "session" })
  .error({
    UnauthorizedError,
    UserNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UnauthorizedError":
        set.status = error.status

        return {
          error: error.message,
          code: "UNAUTHORIZED",
        }

      case "UserNotFoundError":
        set.status = error.status

        return {
          error: error.message,
          code: "USER_NOT_FOUND",
        }

      default:
        throw error
    }
  })
  .derive(async ({ headers }) => {
    try {
      // WorkOSから認証情報を取得
      const headersObj = new Headers()
      Object.entries(headers).forEach(([key, value]) => {
        if (value) {
          headersObj.set(key, value)
        }
      })
      const { user: workosUser } = await getAuth({ headers: headersObj })

      if (!workosUser) {
        throw new UnauthorizedError()
      }

      // データベースからユーザー情報を取得
      if (!db) {
        throw new DatabaseError("Database not initialized")
      }

      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, workosUser.id),
      })

      if (!user) {
        throw new UserNotFoundError()
      }

      return { user }
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof UserNotFoundError) {
        throw error
      }

      throw new DatabaseError(error instanceof Error ? error.message : "Failed to get user")
    }
  })
  .as("scoped")
