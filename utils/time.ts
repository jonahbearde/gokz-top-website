import { format } from "date-fns"

export function toLocal(date: string) {
  return format(new Date(date), "yyyy-MM-dd")
}