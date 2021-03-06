import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import regression from "regression"

import * as CovidData from "../covidData"
import LineChart from "../LineChart"
import { Text } from "../../components"

import { Layout, Typography, Spacing, Colors } from "../../styles"

interface CovidDataInfoProps {
  data: CovidData.CovidData
  locationName: string
}

const CovidDataInfo: FunctionComponent<CovidDataInfoProps> = ({
  data,
  locationName,
}) => {
  const { t } = useTranslation()
  const newCasesData = CovidData.toLineChartCasesNew(data.timeseries)
  ////// ALOHA SAFE make date array for x-axis labels //////
  // const datesData = CovidData.toLineChartDatesNew(data.timeseries)
  const trendData = CovidData.toTrendNew(data.timeseries)
  const toPoint = (newCaseDatum: number, idx: number): [number, number] => {
    return [idx, newCaseDatum]
  }
  // const newCasesPoints = newCasesData.map(toPoint)
  // const result = regression.linear(newCasesPoints)
  // const trend = result.equation[0]

  const trendPoints = trendData.map(toPoint)
  const result = regression.linear(trendPoints)
  const trend = result.equation[0]

  const lineChartWidth =
    0.5 * (Layout.screenWidth - 2 * Spacing.medium - 2 * Spacing.medium)
  const lineChartHeight = 110

  const trendText =
    trend > 0 ? t("covid_data.trending_up") : t("covid_data.trending_down")
  const trendColor =
    trend > 0 ? Colors.accent.warning100 : Colors.accent.success100

  const source = data.source
  const sourceText = t("covid_data.source", { source })
  const labelText = t("covid_data.new_cases")

  return (
    <View testID={"covid-data"}>
      <Text style={style.headerText}>
        {t("covid_data.spread_of_the_virus_in", { locationName })}
      </Text>
      <View style={style.dataContainer}>
        <View style={style.trendContainer}>
          <Text style={{ ...style.trendText, color: trendColor }}>
            {trendText}
          </Text>
          <Text style={style.legendText}>{labelText}</Text>
          <Text style={style.legendExplanationText}>
            {t("covid_data.past_14_days")}, {t("covid_data.7_day_avg")}
          </Text>
        </View>
        <View style={style.chartContainer}>
          <LineChart
            lineData={newCasesData}
            width={lineChartWidth}
            height={lineChartHeight}
            color={trendColor}
            ////// ALOHA SAFE pass date and dot color props //////
            // datesData={datesData}
          />
        </View>
      </View>
      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.body.x20,
    marginBottom: 8,
  },
  dataContainer: {
    flexDirection: "row",
  },
  trendContainer: {
    flex: 4,
    justifyContent: "center",
    marginRight: 8,
  },
  chartContainer: {
    flex: 3,
  },
  legendText: {
    ...Typography.body.x30,
    marginTop: 4,
  },
  legendExplanationText: {
    ...Typography.body.x10,
  },
  trendText: {
    ...Typography.header.x40,
    ...Typography.style.semibold,
    lineHeight: Typography.lineHeight.x40,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x20,
    marginTop: 4,
  },
})

export default CovidDataInfo
