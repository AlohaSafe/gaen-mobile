import React, { FunctionComponent } from "react"
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"

import { StatusBar, Text } from "../components"
import { useStatusBarEffect } from "../navigation"

import { Images } from "../assets"
import { Buttons, Colors, Layout, Spacing, Typography } from "../styles"
import { useAffectedUserContext } from "./AffectedUserContext"

export const AffectedUserComplete: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { navigateOutOfStack } = useAffectedUserContext()

  const handleOnPressDone = navigateOutOfStack

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.innerContainer}>
          <View style={style.topContainer}>
            <Image source={Images.CheckInCircle} style={style.image} />
            <Text style={style.header}>{t("export.complete_title")}</Text>
            <Text style={style.contentText}>
              {t("export.complete_body_bluetooth")}
            </Text>
            <TouchableOpacity
              style={style.button}
              onPress={handleOnPressDone}
              accessibilityLabel={t("common.done")}
            >
              <Text style={style.buttonText}>{t("common.done")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Layout.oneTwentiethHeight,
    paddingBottom: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 230,
    height: 150,
    marginBottom: Spacing.medium,
    resizeMode: "cover",
  },
  header: {
    ...Typography.header.x60,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.body.x30,
    textAlign: "center",
    marginBottom: Spacing.xxxLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
})

export default AffectedUserComplete
