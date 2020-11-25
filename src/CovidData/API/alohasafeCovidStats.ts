import Logger from "../../logger"
import { JsonDecoder } from "ts-data-json"
import { CovidData, CovidDatum } from "../covidData"

const BASE_URL = "https://covid-stats.alohasafe.org/api/v1/"
const statsEndpoint = BASE_URL + "stats"
const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type NetworkResponse = RequestSuccess | RequestFailure

export interface RequestSuccess {
  kind: "success"
  data: CovidData[]
}

type NetworkError =
  | "BadRequest"
  | "InternalError"
  | "JsonDeserialization"
  | "NetworkConnection"
  | "Unknown"

export interface RequestFailure {
  kind: "failure"
  error: NetworkError
}

type Actuals = {
  cases: number
  cases_avg_last7days: number
}

type ActualsDatum = Actuals & WithDate

type WithDate = {
  date: string
}

type ActualsTimeseries = Array<ActualsDatum | null>

type StateCovidData = { [key: string]: Metrics }

type Metrics = {
  positive_test_rate_last7days: number
  avg_cases_last7days: number
  date: string
  case_counts_last14days: ActualsTimeseries
}

const ActualsDecoder = JsonDecoder.object<Actuals>(
  {
    cases: JsonDecoder.number,
    cases_avg_last7days: JsonDecoder.number,
  },
  "Actuals",
)

const DateDecoder = JsonDecoder.object<WithDate>(
  {
    date: JsonDecoder.string,
  },
  "WithDate",
)

const ActualsDatumDecoder = JsonDecoder.combine(ActualsDecoder, DateDecoder)

const MetricsDecoder = JsonDecoder.object<Metrics>(
  {
    positive_test_rate_last7days: JsonDecoder.number,
    avg_cases_last7days: JsonDecoder.number,
    date: JsonDecoder.string,
    case_counts_last14days: JsonDecoder.array(
      JsonDecoder.failover(null, ActualsDatumDecoder),
      "case_counts_last14days",
    ),
  },
  "Metrics",
)

const StateTimeseriesDecoder = JsonDecoder.object<StateCovidData>(
  {
    State: MetricsDecoder,
    Hawaii: MetricsDecoder,
    Honolulu: MetricsDecoder,
    Kauai: MetricsDecoder,
    Maui: MetricsDecoder,
  },
  "StateTimeseriesDecoder",
)

const toCovidData = (stateData: StateCovidData): CovidData[] => {
  const compact = <T>(arr: Array<T | null>): T[] => {
    return arr.reduce<T[]>((acc: T[], el: T | null) => {
      if (el) {
        return [el, ...acc]
      } else {
        return acc
      }
    }, [])
  }

  const toCovidDatum = (actualsDatum: ActualsDatum): CovidDatum => {
    return {
      date: actualsDatum.date,
      positiveCasesNew: actualsDatum.cases,
      positiveCasesNew7DayAvg: actualsDatum.cases_avg_last7days,
    }
  }

  // ordered by population, descending (more interested people = higher in the list)
  const countyList = ["State", "Honolulu", "Hawaii", "Maui", "Kauai"]
  const countyPopulations: { [key: string]: number } = {
    State: 1415872,
    Honolulu: 974563,
    Hawaii: 201513,
    Maui: 167417,
    Kauai: 72293,
  }

  return countyList.map((county) => {
    const testPositivityRatio = stateData[county].positive_test_rate_last7days
    const casesLast7Days = stateData[county].avg_cases_last7days

    return {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: county,
      population: countyPopulations[county],
      metrics: { testPositivityRatio, casesLast7Days },
      riskLevels: {
        overall: 1,
        testPositivityRatio: 1,
        caseDensity: 1,
        contactTracerCapacityRatio: 1,
        infectionRate: 1,
        icuHeadroomRatio: 1,
      },
      timeseries: compact(stateData[county].case_counts_last14days).map(
        toCovidDatum,
      ),
    }
  })
}

export const fetchStateTimeseries = async (): Promise<NetworkResponse> => {
  try {
    const response = await fetch(statsEndpoint, {
      method: "GET",
      headers: requestHeaders,
    })

    const json = await response.json()

    const stateData = await StateTimeseriesDecoder.decodePromise(json)

    return {
      kind: "success",
      data: toCovidData(stateData),
    }
  } catch (e) {
    if (e.contains("decoder failed")) {
      Logger.error("Failed to deserialize covid api data", {
        url: statsEndpoint,
      })
      return { kind: "failure", error: "JsonDeserialization" }
    }
    switch (e.message) {
      case "Network request failed": {
        return { kind: "failure", error: "NetworkConnection" }
      }
      default: {
        return { kind: "failure", error: "Unknown" }
      }
    }
  }
}
