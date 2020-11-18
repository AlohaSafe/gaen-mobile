import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"

import { Text } from "../../components"
import * as CovidData from "../covidData"

import {
  Typography,
  Colors,
  Outlines,
  Spacing,
  Affordances,
} from "../../styles"

type StateDataProps = {
  data: CovidData.CovidData[]
}

const countyMetricsWidget: FunctionComponent<CovidData.CovidData> = ({
  county,
  metrics,
  source,
}) => {
  const { t } = useTranslation()
  const { casesLast7Days, testPositivityRatio } = metrics

  const positiveTestRateText = (testPositivityRatio * 100).toFixed(1) + "%"
  const sourceText = t("covid_data.source", { source })

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>
          {t(`covid_data.regions.${county}`)}
        </Text>
      </View>
      <View style={style.metricsContainer}>
        <View style={style.metricContainer}>
          <View style={style.labelContainer}>
            <Text style={style.labelText}>
              {t("covid_data.daily_new_cases")}
            </Text>
          </View>
          <View style={style.dataContainer}>
            <Text style={style.dataText}>{casesLast7Days}</Text>
            <View style={style.unitContainer}>
              <Text style={style.unitText}>{t("covid_data.7_day_avg")}</Text>
            </View>
          </View>
        </View>
        <View style={style.metricContainer}>
          <View style={style.labelContainer}>
            <Text style={style.labelText}>
              {t("covid_data.positive_test_rate")}
            </Text>
          </View>
          <View style={style.dataContainer}>
            <Text style={style.dataText}>{positiveTestRateText}</Text>
          </View>
        </View>
      </View>
      <Text style={style.sourceText}>{sourceText}</Text>
    </View>
  )
}

const StateData: FunctionComponent<StateDataProps> = ({ data }) => {
  return <View>{data.map((county) => countyMetricsWidget(county))}</View>
}

const style = StyleSheet.create({
  container: {
    ...Affordances.floatingContainer,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral.shade30,
  },
  headerText: {
    ...Typography.header.x30,
    ...Typography.style.bold,
    paddingBottom: Spacing.xSmall,
  },
  metricsContainer: {
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral.shade30,
    paddingBottom: Spacing.large,
  },
  metricContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.small,
  },
  labelContainer: {
    flex: 2,
  },
  labelText: {
    ...Typography.header.x20,
  },
  dataContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataText: {
    ...Typography.header.x40,
    marginRight: Spacing.xSmall,
  },
  unitContainer: {
    width: 40,
  },
  unitText: {
    ...Typography.body.x10,
  },
  sourceText: {
    ...Typography.body.x30,
    ...Typography.base.x10,
  },
})

export default StateData
