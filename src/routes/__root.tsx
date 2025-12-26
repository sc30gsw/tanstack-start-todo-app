/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  stripSearchParams,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { valibotValidator } from "@tanstack/valibot-adapter"
import appCss from "../styles.css?url"
import { defaultSearchParams, searchSchema } from "~/features/todos/schemas/search-schema"
import type { SearchParams } from "~/features/todos/schemas/search-schema"

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
  validateSearch: valibotValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  loaderDeps: ({ search: { q, completed, sortBy, sortOrder } }) => ({
    q,
    completed,
    sortBy,
    sortOrder,
  }),
  loader: ({ deps }): SearchParams => {
    return {
      q: deps.q,
      completed: deps.completed,
      sortBy: deps.sortBy,
      sortOrder: deps.sortOrder,
    }
  },
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "TanStack Start Start" },
    ],
  }),
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
})

function RootComponent() {
  // #endregion
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="mx-auto max-w-2xl">
            <Outlet />
            <Footer />
          </div>
        </main>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

function Footer() {
  // ? depsの動作のため
  const searchParams = Route.useLoaderData()

  return (
    <footer className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
      <div className="space-y-2">
        <p className="font-semibold">現在の検索パラメータ:</p>
        <div className="space-y-1">
          <p>
            <span className="font-medium">検索クエリ:</span> {searchParams.q || "(なし)"}
          </p>
          <p>
            <span className="font-medium">完了状態:</span>{" "}
            {searchParams.completed === undefined
              ? "(すべて)"
              : searchParams.completed
                ? "完了"
                : "未完了"}
          </p>
          <p>
            <span className="font-medium">ソート:</span> {searchParams.sortBy} (
            {searchParams.sortOrder})
          </p>
        </div>
      </div>
    </footer>
  )
}

function NotFoundComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">404</h1>
      <p>ページが見つかりませんでした。</p>
    </div>
  )
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-600">エラー</h1>
      <p>{error.message}</p>
    </div>
  )
}

function PendingComponent() {
  return (
    <div className="p-4">
      <p>読み込み中...</p>
    </div>
  )
}
