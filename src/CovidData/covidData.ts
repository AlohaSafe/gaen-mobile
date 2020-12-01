export type CovidData = {
  source: string
  fips: string
  country: string
  state: string
  county: string
  population: number
  metrics: Metrics
  riskLevels: RiskLevels
  timeseries: Timeseries
}

type Timeseries = CovidDatum[]

type Date = string

export type CovidDatum = {
  date: Date
  positiveCasesNew: number
  positiveCasesNew7DayAvg: number
}

export type Metrics = {
  casesLast7Days: number
  testPositivityRatio: number
}

type RiskLevels = {
  overall: number
  testPositivityRatio: number
  caseDensity: number
  contactTracerCapacityRatio: number
  infectionRate: number
  icuHeadroomRatio: number
}

export const emptyMetrics = {
  casesLast7Days: 0,
  testPositivityRatio: 0,
}

export const emptyRiskLevels = {
  overall: 0,
  testPositivityRatio: 0,
  caseDensity: 0,
  contactTracerCapacityRatio: 0,
  infectionRate: 0,
  icuHeadroomRatio: 0,
}

export const empty: CovidData = {
  source: "",
  fips: "",
  country: "",
  state: "",
  county: "",
  population: 0,
  metrics: emptyMetrics,
  riskLevels: emptyRiskLevels,
  timeseries: [],
}

export const emptyDatum: CovidDatum = {
  date: "2020-01-01",
  positiveCasesNew: 0,
  positiveCasesNew7DayAvg: 0,
}

export const toNewCasesPercentage = (data: Timeseries): number | null => {
  if (!(data.length > 1)) {
    return null
  }

  const positiveNew = data.map(toPositiveNew)
  const [today, ...previous] = positiveNew
  const sumPrevious = previous.reduce((a, b) => a + b, 0)
  const average = sumPrevious / (data.length - 1)

  return percentDifference(today, average)
}

const toPositiveNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}

const percentDifference = (a: number, b: number) => {
  const result = Math.round(((a - b) / b) * 100)
  return result
}

type TrendData = number[]

export const toLineChartCasesNew = (data: Timeseries): TrendData => {
  return data.map(toCasesNew).slice(0, 14).reverse()
}

export const toCasesNew = (datum: CovidDatum): number => {
  return Math.round(datum.positiveCasesNew7DayAvg)
}

export const toTrendNew = (data: Timeseries): TrendData => {
  return data.map(toCasesNew).slice(0, 7).reverse()
}

// export const toLineChartDatesNew = (data: Timeseries): string[] => {
//   return data.map(toDatesNew).slice(0, 14).reverse()
// }

// export const toDatesNew = (datum: CovidDatum): string => {
//   return datum.date.substring(0, datum.date.length - 5)
// }
