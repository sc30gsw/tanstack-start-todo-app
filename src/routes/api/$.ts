import { Elysia } from "elysia"
import { treaty } from "@elysiajs/eden"
import { openapi } from "@elysiajs/openapi"
import { createFileRoute } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { todosApp } from "./todos/$"

const app = new Elysia({
  prefix: "/",
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
  .use(todosApp)

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
  .client(() => treaty<typeof app>(import.meta.env.VITE_APP_URL!).api)
