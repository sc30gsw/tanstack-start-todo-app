import { Elysia } from "elysia"
import { treaty } from "@elysiajs/eden"
import { openapi } from "@elysiajs/openapi"
import { createFileRoute } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { todoPlugin } from "~/features/todos/server"

const app = new Elysia({ prefix: "/api" })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400

        return {
          error: error.message,
          code: "VALIDATION_ERROR",
        }

      default:
        set.status = 500

        return {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        }
    }
  })
  .use(
    openapi({
      path: "/swagger",
      documentation: {
        info: {
          title: "Todo API",
          version: "1.0.0",
          description: "API for managing todos",
        },
        tags: [{ name: "Todos", description: "Todo management endpoints" }],
      },
    }),
  )
  .use(todoPlugin)

const handle = ({ request }: { request: Request }) => {
  return app.fetch(request)
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})

export const getTreaty = createIsomorphicFn()
  .server(() => treaty(app).api)
  .client(() => treaty<typeof app>(import.meta.env.VITE_APP_URL || "http://localhost:3000").api)
