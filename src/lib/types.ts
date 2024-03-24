export type Plan = {
  title: string
  planDates: { [key in string]: PlanDate } | undefined
}

export type PlanDate = {
  title: string
  date: Date | string
}
