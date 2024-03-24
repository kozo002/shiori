export function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0]
}
