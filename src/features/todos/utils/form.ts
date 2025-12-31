import { cn } from "~/utils/cn"

export function getInputFieldClassName(
  hasError: boolean,
  isSubmitted: boolean,
  baseClasses = "rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
) {
  return cn(
    baseClasses,
    hasError && isSubmitted
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  )
}

export function getTextInputClassName(hasError: boolean, isSubmitted: boolean) {
  return getInputFieldClassName(
    hasError,
    isSubmitted,
    "flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
  )
}
