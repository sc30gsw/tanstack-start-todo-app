import * as R from "remeda"
import type { SearchParams } from "~/features/todos/types/schemas/search-schema"

export const SORT_FIELDS = [
  { value: "createdAt", label: "Date" },
  { value: "priority", label: "Priority" },
  { value: "urgency", label: "Urgency" },
] as const satisfies readonly { value: SearchParams["sorts"][number]["field"]; label: string }[]

export const SORT_ORDERS = [
  { value: "desc", label: "Desc" },
  { value: "asc", label: "Asc" },
] as const satisfies readonly { value: SearchParams["sorts"][number]["order"]; label: string }[]

export function getUsedCombinations(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  excludeIndex: number,
) {
  return sorts
    .map((s, i) => (i === excludeIndex ? null : `${s.field}-${s.order}`))
    .filter((c): c is string => c !== null)
}

export function getFieldUsageCount(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  field: string,
  excludeIndex: number,
): number {
  return sorts.filter((s, i) => i !== excludeIndex && s.field === field).length
}

export function getAvailableFields(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  index: number,
) {
  const currentSort = sorts[index]
  if (!currentSort) {
    return [...SORT_FIELDS]
  }

  const usedCombinations = getUsedCombinations(sorts, index)

  return R.pipe(
    SORT_FIELDS,
    R.filter((field) => {
      if (getFieldUsageCount(sorts, field.value, index) >= 2) {
        return false
      }
      const combination = `${field.value}-${currentSort.order}`

      return !usedCombinations.includes(combination)
    }),
  )
}

export function getAvailableOrders(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  index: number,
) {
  const currentSort = sorts[index]

  if (!currentSort) {
    return [...SORT_ORDERS]
  }

  const usedCombinations = getUsedCombinations(sorts, index)

  return R.pipe(
    SORT_ORDERS,
    R.filter((order) => {
      const combination = `${currentSort.field}-${order.value}`
      return !usedCombinations.includes(combination)
    }),
  )
}

export function findNextAvailableSort(sorts: NonNullable<SearchParams["sorts"]>[number][]) {
  const usedCombinations = sorts.map((s) => `${s.field}-${s.order}`)

  for (const field of SORT_FIELDS) {
    const fieldUsageCount = R.pipe(
      sorts,
      R.filter((s) => s.field === field.value),
      R.length(),
    )

    if (fieldUsageCount >= 2) {
      continue
    }

    for (const order of SORT_ORDERS) {
      const combination = `${field.value}-${order.value}`

      if (!usedCombinations.includes(combination)) {
        return {
          field: field.value,
          order: order.value,
        }
      }
    }
  }

  return null
}

export function getAvailableOrdersForField(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  field: NonNullable<SearchParams["sorts"]>[number]["field"],
  excludeIndex: number,
) {
  const usedCombinations = getUsedCombinations(sorts, excludeIndex)

  return R.pipe(
    SORT_ORDERS,
    R.filter((order) => {
      const combination = `${field}-${order.value}`
      return !usedCombinations.includes(combination)
    }),
  )
}

export function calculateNewSortOnFieldChange(
  sorts: NonNullable<SearchParams["sorts"]>[number][],
  index: number,
  newField: NonNullable<SearchParams["sorts"]>[number]["field"],
  currentOrder: NonNullable<SearchParams["sorts"]>[number]["order"],
): NonNullable<SearchParams["sorts"]>[number] | null {
  const usedCombinations = getUsedCombinations(sorts, index)
  const combination = `${newField}-${currentOrder}`

  if (!usedCombinations.includes(combination)) {
    return {
      field: newField,
      order: currentOrder,
    }
  }

  const availableOrders = getAvailableOrdersForField(sorts, newField, index)
  const firstAvailableOrder = availableOrders[0]

  if (!firstAvailableOrder) {
    return null
  }

  return {
    field: newField,
    order: firstAvailableOrder.value,
  }
}
