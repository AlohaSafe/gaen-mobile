import { JsonDecoder } from "ts-data-json"
import env from "react-native-config"

import Logger from "../../logger"
import { CovidData, CovidDatum } from "../covidData"

// const API_KEY = env.ALOHASAFE_COVID_STATS_API_KEY

const BASE_URL = "https://covid-stats.alohasafe.org/api/v1/"
// const apiParam = `apiKey=${API_KEY}`

const statsEndpoint = () => {
  return BASE_URL + "stats"
}

const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type NetworkResponse = RequestSuccess | RequestFailure

export interface RequestSuccess {
  kind: "success"
  data: CovidData
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
}

type ActualsDatum = Actuals & WithDate

type WithDate = {
  date: string
}

type ActualsTimeseries = Array<ActualsDatum | null>

type StateCovidData = {
  State: Metrics,
  Hawaii: Metrics,
  Honolulu: Metrics,
  Kauai: Metrics,
  Maui: Metrics,
}

type Metrics = {
  positive_test_rate_last7days: number
  avg_cases_last7days: number
  date: string
  case_counts_last14days: ActualsTimeseries
}

const ActualsDecoder = JsonDecoder.object<Actuals>(
  {
    cases: JsonDecoder.number,
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
  const {
    State,
    Hawaii,
    Honolulu,
    Maui,
    Kauai,
  } = stateData

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
      positiveCasesTotal: actualsDatum.cases,
    }
  }

  return [
    {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: "State",
      population: 1415872,
      metrics: { testPositivityRatio: State.positive_test_rate_last7days, casesLast7Days: State.avg_cases_last7days },
      riskLevels: { "overall": 1, "testPositivityRatio": 1, "caseDensity": 1, "contactTracerCapacityRatio": 1, "infectionRate": 1, "icuHeadroomRatio": 1 },
      timeseries: compact(State.case_counts_last14days).map(toCovidDatum),
    },
    {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: "Honolulu",
      population: 974563,
      metrics: { testPositivityRatio: Honolulu.positive_test_rate_last7days, casesLast7Days: Honolulu.avg_cases_last7days },
      riskLevels: { "overall": 1, "testPositivityRatio": 1, "caseDensity": 1, "contactTracerCapacityRatio": 1, "infectionRate": 1, "icuHeadroomRatio": 1 },
      timeseries: compact(Honolulu.case_counts_last14days).map(toCovidDatum),
    },
    {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: "Hawaii",
      population: 201513,
      metrics: { testPositivityRatio: Hawaii.positive_test_rate_last7days, casesLast7Days: Hawaii.avg_cases_last7days },
      riskLevels: { "overall": 1, "testPositivityRatio": 1, "caseDensity": 1, "contactTracerCapacityRatio": 1, "infectionRate": 1, "icuHeadroomRatio": 1 },
      timeseries: compact(Hawaii.case_counts_last14days).map(toCovidDatum),
    },
    {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: "Maui",
      population: 167417,
      metrics: { testPositivityRatio: Maui.positive_test_rate_last7days, casesLast7Days: Maui.avg_cases_last7days },
      riskLevels: { "overall": 1, "testPositivityRatio": 1, "caseDensity": 1, "contactTracerCapacityRatio": 1, "infectionRate": 1, "icuHeadroomRatio": 1 },
      timeseries: compact(Maui.case_counts_last14days).map(toCovidDatum),
    },
    {
      source: "health.hawaii.gov",
      fips: "15",
      country: "USA",
      state: "HI",
      county: "Kauai",
      population: 72293,
      metrics: { testPositivityRatio: Kauai.positive_test_rate_last7days, casesLast7Days: Kauai.avg_cases_last7days },
      riskLevels: { "overall": 1, "testPositivityRatio": 1, "caseDensity": 1, "contactTracerCapacityRatio": 1, "infectionRate": 1, "icuHeadroomRatio": 1 },
      timeseries: compact(Kauai.case_counts_last14days).map(toCovidDatum),
    },
  ]
}

export const fetchStateTimeseries = async (
  // state: string,
): Promise<NetworkResponse> => {
  const endpointUrl = statsEndpoint()
  // try {
  const response = await fetch(endpointUrl, {
    method: "GET",
    headers: requestHeaders,
  })

  const json = await response.json()

  const stateData = await StateTimeseriesDecoder.decodePromise(json)

  return {
    kind: "success",
    data: toCovidData(stateData),
  }
  // } catch (e) {
  //   if (e.contains("decoder failed")) {
  //     Logger.error("Failed to desieralize covid api data", { url: endpointUrl })
  //     return { kind: "failure", error: "JsonDeserialization" }
  //   }
  //   switch (e.message) {
  //     case "Network request failed": {
  //       return { kind: "failure", error: "NetworkConnection" }
  //     }
  //     default: {
  //       return { kind: "failure", error: "Unknown" }
  //     }
  //   }
  // }
}
