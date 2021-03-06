import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

////// ALOHA SAFE import insets //////
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
////// ALOHA SAFE import insets //////
import { usePermissionsContext } from "../Device/PermissionsContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { Text } from "../components"
import { useActivationNavigation } from "./useActivationNavigation"
import { useRequestExposureNotifications } from "../useRequestExposureNotifications"

import { Icons } from "../assets"
import { Spacing, Typography, Buttons, Colors, Iconography } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  ////// ALOHA SAFE use imported insets //////
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)
  ////// ALOHA SAFE use imported insets //////
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()

  const isENActive = exposureNotifications.status === "Active"

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.content}>
          <Text style={style.header}>
            {t("onboarding.proximity_tracing_header")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader1")}
          </Text>
          <Text style={style.body}>
            {t("onboarding.proximity_tracing_body1")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader2")}
          </Text>
          <Text style={style.body}>
            {t("onboarding.proximity_tracing_body2")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader3")}
          </Text>
        </View>
      </ScrollView>
      {!isENActive ? (
        <EnableENButtons style={style} />
      ) : (
        <ENAlreadyEnabledButtons style={style} />
      )}
    </SafeAreaView>
  )
}

const EnableENButtons: FunctionComponent = ({ style }) => {
  const { t } = useTranslation()
  const { trackEvent } = useProductAnalyticsContext()
  const { goToNextScreenFrom } = useActivationNavigation()
  const requestExposureNotifications = useRequestExposureNotifications()

  const handleOnPressDontEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_denied")
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  const handleOnPressEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_accept")
    requestExposureNotifications()
  }

  return (
    <View style={style.buttonsContainer}>
      <TouchableOpacity onPress={handleOnPressEnable} style={style.button}>
        <Text style={style.buttonText}>
          {t("onboarding.proximity_tracing_button")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleOnPressDontEnable}
        style={style.secondaryButton}
      >
        <Text style={style.secondaryButtonText}>{t("common.no_thanks")}</Text>
      </TouchableOpacity>
      {/* ALOHA SAFE moved buttons outside of scroll view */}
      {/* <View style={style.buttonsContainer}>
        <TouchableOpacity onPress={handleOnPressEnable} style={style.button}>
          <Text style={style.buttonText}>
            {t("onboarding.proximity_tracing_button")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressDontEnable}
          style={style.secondaryButton}
        >
          <Text style={style.secondaryButtonText}>{t("common.no_thanks")}</Text>
        </TouchableOpacity>
      </View> */}
      {/* ALOHA SAFE moved buttons outside of scroll view */}
    </View>
  )
}

const ENAlreadyEnabledButtons: FunctionComponent = ({ style }) => {
  const { t } = useTranslation()
  const { goToNextScreenFrom } = useActivationNavigation()

  const handleOnPressContinue = () => {
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  return (
    <View style={style.alreadyActiveContainer}>
      <View style={style.alreadyActiveInfoContainer}>
        <View style={style.alreadyActiveIconContainer}>
          <SvgXml
            xml={Icons.CheckInCircle}
            fill={Colors.accent.success100}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
        </View>
        <View style={style.alreadyActiveTextContainer}>
          <Text style={style.alreadyActiveText}>
            {t("onboarding.proximity_tracing_already_active")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleOnPressContinue} style={style.button}>
        <Text style={style.buttonText}>{t("common.continue")}</Text>
      </TouchableOpacity>
    </View>
  )
}

////// ALOHA SAFE createStyle for insets //////
const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    safeArea: {
      ////// ALOHA SAFE justify and flex //////
      justifyContent: "space-between",
      flex: 1,
      ////// ALOHA SAFE justify and flex //////
      backgroundColor: Colors.background.primaryLight,
    },
    container: {
      backgroundColor: Colors.background.primaryLight,
      // height: "100%",
    },
    contentContainer: {
      paddingVertical: Spacing.large,
      paddingHorizontal: Spacing.medium,
    },
    content: {
      marginBottom: Spacing.medium,
    },
    header: {
      ...Typography.header.x60, // header1 ??
      marginBottom: Spacing.large,
      ////// ALOHA SAFE added color //////
      color: Colors.asBlue,
    },
    subheader: {
      ...Typography.header.x20, // header5 ???
      marginBottom: Spacing.xSmall,
      ////// ALOHA SAFE added color //////
      color: Colors.asBlue,
    },
    body: {
      ...Typography.body.x30, // body1 ???
      marginBottom: Spacing.xxLarge,
    },
    ////// ALOHA SAFE button styles //////
    buttonsContainer: {
      alignItems: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
    },
    nextButton: {
      width: "95%",
      alignSelf: "center",
      marginBottom: Spacing.small,
    },
    nextButtonGradient: {
      paddingTop: Spacing.xSmall,
      paddingBottom: Spacing.xSmall + 1,
      width: "95%",
      alignSelf: "center",
    },
    ////// ALOHA SAFE button styles //////
    button: {
      ...Buttons.primary.base,
    },
    buttonText: {
      ...Typography.button.primary,
    },
    secondaryButton: {
      ...Buttons.secondary.base,
    },
    secondaryButtonText: {
      ...Typography.button.secondary,
      ////// ALOHA SAFE added color //////
      color: Colors.asGray,
    },
    alreadyActiveContainer: {
      borderTopWidth: 1,
      borderTopColor: Colors.neutral.shade50,
      alignItems: "center",
      paddingBottom: insets.bottom + Spacing.small,
    },
    alreadyActiveInfoContainer: {
      flexDirection: "row",
      paddingVertical: Spacing.large,
    },
    alreadyActiveIconContainer: {
      flex: 1,
      justifyContent: "center",
    },
    alreadyActiveTextContainer: {
      flex: 8,
      justifyContent: "center",
    },
    alreadyActiveText: {
      ...Typography.body.x30,
    },
  })
}

export default ActivateExposureNotifications
