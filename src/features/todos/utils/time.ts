import type { ChangeEvent } from "react"
import type { TodoFormValues } from "~/features/todos/types/schemas/todo-form-schema"

const MINUTES_PER_HOUR = 60
const DEFAULT_TIME = 0
const MINIMUM_HOURS = 1

export function minutesToHoursAndMinutes(totalMinutes: TodoFormValues["estimatedTime"]) {
  if (totalMinutes === null) {
    return { hours: null, minutes: null }
  }

  const hours = totalMinutes / MINUTES_PER_HOUR
  const minutesRemainder = totalMinutes % MINUTES_PER_HOUR
  const hasHoursInput =
    hours >= MINIMUM_HOURS || (hours > DEFAULT_TIME && minutesRemainder === DEFAULT_TIME)

  return {
    hours,
    minutes: hasHoursInput ? totalMinutes : minutesRemainder,
  }
}

export function hoursAndMinutesToMinutes(
  hours: TodoFormValues["estimatedTime"],
  minutes: TodoFormValues["estimatedTime"],
) {
  const hoursValue = hours === null ? DEFAULT_TIME : hours
  const minutesValue = minutes === null ? DEFAULT_TIME : minutes
  const totalMinutes = hoursValue * MINUTES_PER_HOUR + minutesValue

  return totalMinutes === DEFAULT_TIME && hours === null && minutes === null ? null : totalMinutes
}

export function createTimeInputHandler(
  currentHours: TodoFormValues["estimatedTime"],
  onChange: (value: TodoFormValues["estimatedTime"]) => void,
) {
  return {
    onHoursChange: (e: ChangeEvent<HTMLInputElement>) => {
      const hoursValue = e.target.value === "" ? DEFAULT_TIME : Number(e.target.value)
      const minutesFromHours = hoursValue * MINUTES_PER_HOUR
      const totalMinutes = minutesFromHours

      onChange(totalMinutes === DEFAULT_TIME && e.target.value === "" ? null : totalMinutes)
    },
    onMinutesChange: (e: ChangeEvent<HTMLInputElement>) => {
      const minutesValue = e.target.value === "" ? DEFAULT_TIME : Number(e.target.value)
      onChange(minutesValue === DEFAULT_TIME && e.target.value === "" ? null : minutesValue)
    },
  }
}
