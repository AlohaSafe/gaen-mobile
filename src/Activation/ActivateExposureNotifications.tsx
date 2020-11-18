import React, { FunctionComponent, useCallback } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

////// ALOHA SAFE import insets //////
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
////// ALOHA SAFE import insets //////
import {
  ENPermissionStatus,
  usePermissionsContext,
} from "../Device/PermissionsContext"
import { openAppSettings } from "../Device"
import { useApplicationName } from "../Device/useApplicationInfo"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { nextScreenFromExposureNotifications } from "./activationStackController"
import { Text } from "../components"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  ////// ALOHA SAFE use imported insets //////
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)
  ////// ALOHA SAFE use imported insets //////
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    locationPermissions,
    isBluetoothOn,
    exposureNotifications,
  } = usePermissionsContext()
  const { applicationName } = useApplicationName()
  const { trackEvent } = useProductAnalyticsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const navigateToNextScreen = useCallback(() => {
    navigation.navigate(
      nextScreenFromExposureNotifications({
        isLocationRequiredAndOff,
        isBluetoothOn,
      }),
    )
  }, [isBluetoothOn, isLocationRequiredAndOff, navigation])

  useFocusEffect(
    useCallback(() => {
      if (exposureNotifications.status === ENPermissionStatus.ENABLED) {
        navigateToNextScreen()
      }
    }, [exposureNotifications.status, navigateToNextScreen]),
  )

  const showNotAuthorizedAlert = () => {
    const errorMessage = Platform.select({
      ios: t("home.proximity_tracing.unauthorized_error_message_ios", {
        applicationName,
      }),
      android: t("home.proximity_tracing.unauthorized_error_message_android", {
        applicationName,
      }),
    })

    Alert.alert(
      t("home.proximity_tracing.unauthorized_error_title"),
      errorMessage,
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t("common.settings"),
          onPress: () => openAppSettings(),
        },
      ],
    )
  }

  const handleOnPressEnable = async () => {
    try {
      const response = await exposureNotifications.request()
      if (response.kind === "success") {
        if (response.status !== ENPermissionStatus.ENABLED) {
          showNotAuthorizedAlert()
        }
      } else {
        showNotAuthorizedAlert()
      }
      trackEvent("product_analytics", "onboarding_en_permissions_accept")
    } catch (e) {
      showNotAuthorizedAlert()
    }
  }

  const handleOnPressDontEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_denied")
    navigateToNextScreen()
  }

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
      {/* ALOHA SAFE moved buttons outside of scroll view */}
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
      </View>
      {/* ALOHA SAFE moved buttons outside of scroll view */}
    </SafeAreaView>
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
  })
}
export default ActivateExposureNotifications
