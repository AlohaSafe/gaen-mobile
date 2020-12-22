import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadUrl: "appDownloadUrl",
  appPackageName: "appPackageName",
  displayAcceptTermsOfService: false,
  displayAppTransition: false,
  displayCallbackForm: false,
  displayCallEmergencyServices: false,
  displayCovidData: false,
  displayDebugMenu: false,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  enableProductAnalytics: false,
  emergencyPhoneNumber: "emergencyPhoneNumber",
  findATestCenterUrl: "findATestCenterUrl",
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityCovidDataUrl: "authorityCovidDataUrl",
  healthAuthorityHealthCheckUrl: "healthAuthorityHealthCheckUrl",
  healthAuthorityLearnMoreUrl: "authorityLearnMoreUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  healthAuthorityLegalPrivacyPolicyUrl: "authorityLegalPrivacyPolicyUrl",
  healthAuthorityVerificationCodeInfoUrl: "authorityVerificationCodeInfoUrl",
  includeSymptomOnsetDate: false,
  measurementSystem: "Imperial",
  minimumAge: "18",
  minimumPhoneDigits: 0,
  regionCodes: ["REGION"],
  remoteContentUrl: null,
  stateAbbreviation: null,
  verificationStrategy: "Simple",
}))
