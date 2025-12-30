import { getRouteApi } from "@tanstack/react-router"
import type { SearchParams } from "~/features/todos/schemas/search-schema"

export function TodoSearch() {
  const routeApi = getRouteApi("/_authenticated/")
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const handleCompletedChange = (completed?: boolean) => {
    navigate({
      search: (prev) => ({
        ...prev,
        completed,
      }),
    })
  }

  const handleSortChange = (
    sortBy: NonNullable<SearchParams["sortBy"]>,
    sortOrder: NonNullable<NonNullable<SearchParams["sortOrder"]>>,
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy,
        sortOrder,
      }),
    })
  }

  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        value={search.q ?? ""}
        onChange={(e) => {
          navigate({
            search: (prev) => ({
              ...prev,
              q: e.target.value,
            }),
          })
        }}
        placeholder="Search todos..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="completed"
              checked={search.completed === undefined}
              onChange={() => handleCompletedChange()}
              className="h-4 w-4 cursor-pointer text-blue-600"
            />
            <span className="text-sm text-gray-700">All</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="completed"
              checked={search.completed === false}
              onChange={() => handleCompletedChange(false)}
              className="h-4 w-4 cursor-pointer text-blue-600"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="completed"
              checked={search.completed === true}
              onChange={() => handleCompletedChange(true)}
              className="h-4 w-4 cursor-pointer text-blue-600"
            />
            <span className="text-sm text-gray-700">Completed</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <select
            value={search.sortBy ?? "createdAt"}
            onChange={(e) => {
              const sortBy = e.target.value as NonNullable<SearchParams["sortBy"]>
              const currentOrder = search.sortOrder ?? "desc"

              handleSortChange(sortBy, currentOrder)
            }}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Date</option>
            <option value="text">Text</option>
          </select>
          <select
            value={search.sortOrder ?? "desc"}
            onChange={(e) => {
              const sortOrder = e.target.value as NonNullable<
                NonNullable<SearchParams["sortOrder"]>
              >
              const currentBy = search.sortBy ?? "createdAt"

              handleSortChange(currentBy, sortOrder)
            }}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
    </div>
  )
}
