import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

////// ALOHA SAFE import insets //////
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
////// ALOHA SAFE import insets //////
import { usePermissionsContext } from "../PermissionsContext"
import { Text, Button } from "../components"
import { useSystemServicesContext } from "../SystemServicesContext"
import { nextScreenFromExposureNotifications } from "./activationStackController"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  ////// ALOHA SAFE use imported insets //////
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)
  ////// ALOHA SAFE use imported insets //////
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { locationPermissions, isBluetoothOn } = useSystemServicesContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const { exposureNotifications } = usePermissionsContext()

  const navigateToNextScreen = () => {
    navigation.navigate(
      nextScreenFromExposureNotifications({
        isLocationRequiredAndOff,
        isBluetoothOn,
      }),
    )
  }

  const handleOnPressActivateExposureNotifications = async () => {
    await exposureNotifications.request()
    navigateToNextScreen()
  }

  const handleOnPressDontEnable = () => {
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
        <Button
          customButtonStyle={style.nextButton}
          customButtonInnerStyle={style.nextButtonGradient}
          onPress={handleOnPressActivateExposureNotifications}
          label={t("onboarding.proximity_tracing_button")}
        />
        <TouchableOpacity
          onPress={handleOnPressDontEnable}
          // style={style.secondaryButton}
          >
          <Text style={style.secondaryButtonText}>
            {t("common.no_thanks")}
          </Text>
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
      backgroundColor: Colors.primaryLightBackground,
    },
    container: {
      backgroundColor: Colors.primaryLightBackground,
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
      ...Typography.header1,
      marginBottom: Spacing.large,
      ////// ALOHA SAFE added color //////
      color: Colors.asBlue,
    },
    subheader: {
      ...Typography.header5,
      marginBottom: Spacing.xSmall,
      ////// ALOHA SAFE added color //////
      color: Colors.asBlue,
    },
    body: {
      ...Typography.body1,
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
    secondaryButton: {
      ...Buttons.secondary,
    },
    secondaryButtonText: {
      ...Typography.buttonSecondary,
      ////// ALOHA SAFE added color //////
      color: Colors.asGray,
    },
  })
////// ALOHA SAFE createStyle for insets //////
}
export default ActivateExposureNotifications
