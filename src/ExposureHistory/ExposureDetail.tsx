import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ExposureHistoryStackParamList } from "../navigation"
import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"
import * as Exposure from "../exposure"

import { Colors, Iconography, Spacing, Typography } from "../styles"
import { Icons } from "../assets"
import ExposureActions from "./detail/ExposureActions"

const ExposureDetail: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<ExposureHistoryStackParamList, "ExposureDetail">
  >()
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()

  const { exposureDatum } = route.params

  return (
    <ScrollView style={style.container} alwaysBounceVertical={false}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>
          {t("exposure_history.exposure_detail.header")}
        </Text>
        <View style={style.exposureWindowContainer}>
          <SvgXml
            xml={Icons.ExposureIcon}
            accessible
            accessibilityLabel={t("exposure_history.possible_exposure")}
            fill={Colors.asOrange}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
          />
          <Text style={style.exposureWindowText}>
            {Exposure.toDateRangeString(exposureDatum)}
          </Text>
        </View>
      </View>
      <View style={style.bottomContainer}>
        <ExposureActions />
      </View>
    </ScrollView>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.shade10,
  },
  headerContainer: {
    backgroundColor: Colors.secondary.shade10,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.massive,
    paddingTop: Spacing.large,
    paddingBottom: Spacing.small,
  },
  exposureWindowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  exposureWindowText: {
    ...Typography.header.x10,
    color: Colors.neutral.shade110,
    marginLeft: Spacing.xSmall,
  },
  headerText: {
    ...Typography.header.x50,
    color: Colors.primary.shade125,
    marginBottom: Spacing.medium,
  },
  bottomContainer: {
    backgroundColor: Colors.background.primaryLight,
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xLarge,
    marginTop: Spacing.xxSmall,
  },
})

export default ExposureDetail
