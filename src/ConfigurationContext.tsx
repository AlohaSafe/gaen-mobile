import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

type MeasurementSystem = "Imperial" | "Metric"

export interface Configuration {
  appDownloadUrl: string | null
  appPackageName: string
  displayAcceptTermsOfService: boolean
  displayAppTransition: boolean
  displayCallbackForm: boolean
  displayCallEmergencyServices: boolean
  displayCovidData: boolean
  displayDebugMenu: boolean
  displaySymptomHistory: boolean
  displaySelfAssessment: boolean
  displayAgeVerification: boolean
  enableProductAnalytics: boolean
  emergencyPhoneNumber: string
  findATestCenterUrl: string | null
  healthAuthorityAdviceUrl: string
  healthAuthorityCovidDataUrl: string | null
  healthAuthorityEulaUrl: string | null
  healthAuthorityDataDashboardUrl: string
  healthAuthorityLearnMoreUrl: string
  healthAuthorityLegalPrivacyPolicyUrl: string | null
  healthAuthorityHealthCheckUrl: string | null
  healthAuthorityPrivacyPolicyUrl: string
  healthAuthorityVerificationCodeInfoUrl: string | null
  includeSymptomOnsetDate: boolean
  measurementSystem: MeasurementSystem
  minimumAge: string
  minimumPhoneDigits: number
  regionCodes: string[]
  remoteContentUrl: string | null
  stateAbbreviation: string | null
  verificationStrategy: VerificationStrategy
}

const initialState: Configuration = {
  appDownloadUrl: null,
  appPackageName: "",
  displayAcceptTermsOfService: false,
  displayAppTransition: false,
  displayCallbackForm: false,
  displayCallEmergencyServices: false,
  displayCovidData: false,
  displayDebugMenu: false,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  emergencyPhoneNumber: "",
  enableProductAnalytics: false,
  findATestCenterUrl: null,
  healthAuthorityAdviceUrl: "",
  healthAuthorityCovidDataUrl: null,
  healthAuthorityEulaUrl: null,
  healthAuthorityHealthCheckUrl: null,
  healthAuthorityLearnMoreUrl: "",
  healthAuthorityLegalPrivacyPolicyUrl: "",
  healthAuthorityPrivacyPolicyUrl: "",
  healthAuthorityVerificationCodeInfoUrl: null,
  includeSymptomOnsetDate: false,
  measurementSystem: "Imperial" as const,
  minimumAge: "18",
  minimumPhoneDigits: 0,
  regionCodes: [],
  remoteContentUrl: null,
  stateAbbreviation: "",
  verificationStrategy: "Simple",
}

type VerificationStrategy = "Simple" | "Escrow"

const toVerificationStrategy = (strategy: string): VerificationStrategy => {
  switch (strategy) {
    case "simple":
      return "Simple"
    case "escrow":
      return "Escrow"
    default:
      return "Simple"
  }
}

const ConfigurationContext = createContext<Configuration>(initialState)

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    EMERGENCY_PHONE_NUMBER: emergencyPhoneNumber,
    FIND_A_TEST_CENTER_URL: findATestCenterUrl,
    LEARN_MORE_URL: healthAuthorityLearnMoreUrl,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
  } = env

  const appDownloadUrl = env.SHARE_APP_LINK || null
  const healthAuthorityCovidDataUrl = env.AUTHORITY_COVID_DATA_URL || null
  const healthAuthorityDataDashboardUrl =
    env.AUTHORITY_DATA_DASHBOARD_URL || healthAuthorityCovidDataUrl || ""
  const healthAuthorityEulaUrl = env.EULA_URL || null
  const healthAuthorityHealthCheckUrl = env.HEALTH_CHECK_URL || null
  const healthAuthorityLegalPrivacyPolicyUrl =
    env.LEGAL_PRIVACY_POLICY_URL || null
  const healthAuthorityVerificationCodeInfoUrl =
    env.VERIFICATION_CODE_INFO_URL || null
  const remoteContentUrl = env.REMOTE_CONTENT_URL || null

  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displayAppTransition = env.DISPLAY_APP_TRANSITION === "true"
  const displayCallbackForm = env.DISPLAY_CALLBACK_FORM === "true"
  const displayCallEmergencyServices =
    env.DISPLAY_CALL_EMERGENCY_SERVICES === "true"
  const displayCovidData = env.DISPLAY_COVID_DATA === "true"
  const displayDebugMenu = env.DISPLAY_EN_DEBUG_MENU === "true"
  const displaySymptomHistory = env.DISPLAY_SYMPTOM_HISTORY === "true"
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"
  const displayAgeVerification = env.DISPLAY_AGE_VERIFICATION === "true"

  const enableProductAnalytics = env.ENABLE_PRODUCT_ANALYTICS === "true"

  const includeSymptomOnsetDate = env.INCLUDE_SYMPTOM_ONSET_DATE === "true"

  const measurementSystem =
    env.MEASUREMENT_SYSTEM === "metric" ? "Metric" : "Imperial"

  const minimumAge = env.MINIMUM_AGE
  const minimumPhoneDigits = parseInt(env.MINIMUM_PHONE_DIGITS) || 0

  const appPackageName = Platform.select({
    ios: env.IOS_BUNDLE_ID,
    android: env.ANDROID_APPLICATION_ID,
  }) as string
  const regionCodes = env.REGION_CODES.split(",")

  const stateAbbreviation =
    env.STATE_ABBREVIATION?.length > 0 ? env.STATE_ABBREVIATION : null

  const verificationStrategy: VerificationStrategy = toVerificationStrategy(
    env.VERIFICATION_STRATEGY,
  )

  return (
    <ConfigurationContext.Provider
      value={{
        appDownloadUrl,
        appPackageName,
        displayAcceptTermsOfService,
        displayAppTransition,
        displayCallbackForm,
        displayCallEmergencyServices,
        displayCovidData,
        displayDebugMenu,
        displaySymptomHistory,
        displaySelfAssessment,
        displayAgeVerification,
        enableProductAnalytics,
        emergencyPhoneNumber,
        findATestCenterUrl,
        healthAuthorityAdviceUrl,
        healthAuthorityCovidDataUrl,
        healthAuthorityDataDashboardUrl,
        healthAuthorityEulaUrl,
        healthAuthorityHealthCheckUrl,
        healthAuthorityLearnMoreUrl,
        healthAuthorityLegalPrivacyPolicyUrl,
        healthAuthorityPrivacyPolicyUrl,
        healthAuthorityVerificationCodeInfoUrl,
        includeSymptomOnsetDate,
        measurementSystem,
        minimumAge,
        minimumPhoneDigits,
        regionCodes,
        remoteContentUrl,
        stateAbbreviation,
        verificationStrategy,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  )
}

const useConfigurationContext = (): Configuration => {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error("ConfigurationContext must be used with a provider")
  }
  return context
}

export { ConfigurationContext, ConfigurationProvider, useConfigurationContext }
