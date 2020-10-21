import * as BrandColors from "../configuration/brandColors"

const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16)
  const green = parseInt(hexColor.slice(3, 5), 16)
  const blue = parseInt(hexColor.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

// AlohaSafe Colors
export const asAlertRed = "#cc0000"
export const asRed = "#ff4444"
export const asOrange = "#ff8800"
export const asStoryOrange = "#ffbb33"
export const asGreen = "#007e33"
export const asTravelGreen = "#00c851"
export const asLightBlue = "#0099cc"
export const asWorkplaceBlue = "#33b5e5"
export const asDarkGreen = "#00695c"
export const asLightGreen = "#2bbbad"
export const asBlue = "#1a4267"
export const asSecondaryBlue = "#4285f4"
export const asGray = "#414042"
export const asSecondaryGray = "#808285"

export const asStatusBar = "#cc0000a0"

export const asGradientBlue = [asSecondaryBlue, "#ffffff", "#ffffff"]

// Neutrals
export const white = "#ffffff"
export const neutral5 = "#edeef3"
export const neutral10 = "#e9eaf0"
export const neutral25 = "#d8d8de"
export const neutral30 = "#d6d6da"
export const neutral50 = "#c5c5c9"
export const neutral75 = "#9ba0aa"
export const neutral100 = "#3c475b"
export const neutral110 = "#374357"
export const neutral125 = "#252f42"
export const neutral140 = "#1c2537"
export const black = "#000000"

// Primary
export const primary100 = BrandColors.primary100
export const primary110 = BrandColors.primary110
export const primary125 = BrandColors.primary125
export const primary150 = BrandColors.primary150

// Secondary
export const secondary10 = BrandColors.secondary10
export const secondary50 = BrandColors.secondary50
export const secondary75 = BrandColors.secondary75
export const secondary100 = BrandColors.secondary100

// Accents
export const danger10 = "#fff0f0"
export const danger25 = "#ffe0e0"
export const danger75 = "#ff7d7d"
// export const danger100 = "#ff5656"
export const danger100 = asAlertRed
export const success10 = "#f2fcf4"
export const success25 = "#deffe4"
export const success50 = "#5bd9a2"
export const success100 = "#24a36c"
export const warning25 = "#f9edcc"
export const warning50 = "#ffdc6f"
export const warning100 = "#ffc000"

// Backgrounds
export const primaryLightBackground = white
export const primaryDarkBackround = primary125

// Gradients
export const gradient10Dark = "#ececff"
export const gradient10Light = primaryLightBackground
export const gradient10 = [gradient10Dark, gradient10Dark]

export const gradient100Dark = BrandColors.gradient100Dark
export const gradient100Light = BrandColors.gradient100Light
export const gradient100 = [
  asSecondaryBlue,
  primaryLightBackground
]

// Old Gradients
export const gradientPrimary20 = ["#f4edfe", secondary10]
export const gradientPrimary20Lighter = secondary10
export const gradientPrimary100Lighter = "#cc0000a0"
export const gradientMainButton = ["#ff7700", `${asAlertRed}`, `${asAlertRed}`]
export const gradientNeutral75 = [neutral75, neutral100]

// Transparent
export const transparent = "rgba(0, 0, 0, 0)"
export const transparentNeutral30 = applyOpacity(neutral30, 0.4)

// Headers
export const headerBackground = primary125
export const headerText = white

// Buttons
export const disabledButton = neutral100
export const disabledButtonText = secondary50

// Text
export const primaryText = neutral140
export const anchorLinkText = primary100
export const errorText = danger100
export const placeholderText = neutral75
