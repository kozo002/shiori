export type Plan = {
  title: string
  planDates: { [key in string]: PlanDate } | undefined
}

export type PlanDate = {
  title: string
  date: Date | string
  planEvents: { [key in string]: PlanEvent } | undefined
}

export type PlanEvent = {
  title: string
  time: Date | string
}
