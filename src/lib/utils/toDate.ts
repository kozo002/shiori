export function toDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date
}
