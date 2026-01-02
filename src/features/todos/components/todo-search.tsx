import { getRouteApi } from "@tanstack/react-router"
import type { SearchParams } from "~/features/todos/types/schemas/search-schema"
import { PRIORITY_OPTIONS, URGENCY_OPTIONS } from "~/features/todos/constants/form"
import {
  getAvailableFields,
  getAvailableOrders,
  findNextAvailableSort,
  calculateNewSortOnFieldChange,
} from "~/features/todos/utils/sort"

export function TodoSearch() {
  const routeApi = getRouteApi("/_authenticated/")
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const currentSorts = search.sorts ?? [{ field: "createdAt", order: "desc" }]

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
      <div className="grid grid-cols-1 gap-4 min-w-0">
        <div className="grid grid-cols-[auto_1fr] gap-2 items-center min-w-0">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
          <div className="flex items-center gap-2 min-w-0">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="completed"
                checked={search.completed === undefined}
                onChange={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      completed: undefined,
                    }),
                  })
                }
                className="size-4 cursor-pointer text-blue-600"
              />
              <span className="text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="completed"
                checked={search.completed === false}
                onChange={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      completed: false,
                    }),
                  })
                }
                className="size-4 cursor-pointer text-blue-600"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="completed"
                checked={search.completed === true}
                onChange={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      completed: true,
                    }),
                  })
                }
                className="size-4 cursor-pointer text-blue-600"
              />
              <span className="text-sm text-gray-700">Completed</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center min-w-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Priority:</span>
            <select
              value={search.priority ?? ""}
              onChange={(e) => {
                const priority =
                  e.target.value === "" ? undefined : (e.target.value as SearchParams["priority"])

                navigate({
                  search: (prev) => ({
                    ...prev,
                    priority,
                  }),
                })
              }}
              className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            >
              <option value="">All</option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center min-w-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Urgency:</span>
            <select
              value={search.urgency ?? ""}
              onChange={(e) => {
                const urgency =
                  e.target.value === "" ? undefined : (e.target.value as SearchParams["urgency"])

                navigate({
                  search: (prev) => ({
                    ...prev,
                    urgency,
                  }),
                })
              }}
              className="w-40 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            >
              <option value="">All</option>
              {URGENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 min-w-0">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center min-w-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</span>
            <button
              type="button"
              onClick={() => {
                const nextSort = findNextAvailableSort(currentSorts)
                if (nextSort) {
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sorts: [...currentSorts, nextSort],
                    }),
                  })
                }
              }}
              disabled={currentSorts.length >= 8 || findNextAvailableSort(currentSorts) === null}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + 追加
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 min-w-0">
            {currentSorts.map((sort, index) => {
              const availableFields = getAvailableFields(currentSorts, index)
              const availableOrders = getAvailableOrders(currentSorts, index)

              return (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center min-w-0"
                >
                  <select
                    value={sort.field}
                    onChange={(e) => {
                      const newField = e.target.value as SearchParams["sorts"][number]["field"]
                      const newSort = calculateNewSortOnFieldChange(
                        currentSorts,
                        index,
                        newField,
                        sort.order,
                      )

                      if (!newSort) {
                        return
                      }

                      const newSorts = [...currentSorts]
                      newSorts[index] = {
                        field: newSort.field,
                        order: newSort.order,
                      } as const satisfies SearchParams["sorts"][number]

                      navigate({
                        search: (prev) => ({
                          ...prev,
                          sorts: newSorts,
                        }),
                      })
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    {availableFields.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sort.order}
                    onChange={(e) => {
                      const newOrder = e.target.value as SearchParams["sorts"][number]["order"]
                      const newSorts = [...currentSorts]

                      // 現在のfieldと新しいorderの組み合わせが既に使用されているかチェック
                      const usedCombinations = currentSorts
                        .map((s, i) => (i === index ? null : `${s.field}-${s.order}`))
                        .filter((c): c is string => c !== null)
                      const combination = `${sort.field}-${newOrder}`

                      if (usedCombinations.includes(combination)) {
                        return // 変更できない場合は何もしない
                      }

                      newSorts[index] = {
                        field: sort.field,
                        order: newOrder,
                      } as const satisfies SearchParams["sorts"][number]

                      navigate({
                        search: (prev) => ({
                          ...prev,
                          sorts: newSorts,
                        }),
                      })
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    {availableOrders.map((order) => (
                      <option key={order.value} value={order.value}>
                        {order.label}
                      </option>
                    ))}
                  </select>
                  {currentSorts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSorts = currentSorts.filter((_, i) => i !== index)

                        navigate({
                          search: (prev) => ({
                            ...prev,
                            sorts:
                              newSorts.length > 0
                                ? newSorts
                                : [{ field: "createdAt", order: "desc" }],
                          }),
                        })
                      }}
                      className="rounded border border-red-300 bg-white px-2 py-1 text-sm text-red-600 hover:bg-red-50 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap"
                    >
                      削除
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
