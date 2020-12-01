import React from "react"
import { Alert } from "react-native"
import {
  cleanup,
  // fireEvent,
  render,
  // waitFor,
} from "@testing-library/react-native"
// import { showMessage } from "react-native-flash-message"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"
// import { ExposureContext } from "../../ExposureContext"
// import * as NativeModule from "../../gaen/nativeModule"

import History from "./index"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

afterEach(cleanup)

describe("History", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("when there are no exposures", () => {
    it("shows a no exposure reports message", () => {
      const exposures: ExposureDatum[] = []

      const { queryByText } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(queryByText("No Exposure Reports")).not.toBeNull()
    })
  })

  // describe("when the check for exposures button is tapped", () => {
  //   it("checks for new exposures", async () => {
  //     const exposures: ExposureDatum[] = []
  //     const checkForNewExposuresSpy = jest
  //       .fn()
  //       .mockResolvedValueOnce({ kind: "success" })

  //     const { getByTestId } = render(
  //       <ExposureContext.Provider
  //         value={factories.exposureContext.build({
  //           detectExposures: checkForNewExposuresSpy,
  //         })}
  //       >
  //         <History exposures={exposures} lastDetectionDate={null} />
  //       </ExposureContext.Provider>,
  //     )

  //     fireEvent.press(getByTestId("check-for-exposures-button"))

  //     await waitFor(() => {
  //       expect(checkForNewExposuresSpy).toHaveBeenCalled()
  //     })
  //   })

  //   describe("when exposure check returns rate limiting error", () => {
  //     it("displays a success message", async () => {
  //       const showMessageSpy = showMessage as jest.Mock
  //       const response: NativeModule.DetectExposuresResponse = {
  //         kind: "failure",
  //         error: "RateLimited",
  //       }
  //       const checkForNewExposuresSpy = jest
  //         .fn()
  //         .mockResolvedValueOnce(response)

  //       const { getByTestId } = render(
  //         <ExposureContext.Provider
  //           value={factories.exposureContext.build({
  //             detectExposures: checkForNewExposuresSpy,
  //           })}
  //         >
  //           <History exposures={[]} lastDetectionDate={null} />
  //         </ExposureContext.Provider>,
  //       )

  //       fireEvent.press(getByTestId("check-for-exposures-button"))

  //       await waitFor(() => {
  //         expect(showMessageSpy).toHaveBeenCalledWith(
  //           expect.objectContaining({
  //             message: "Success",
  //           }),
  //         )
  //       })
  //     })
  //   })

  //   describe("when exposure check is successful", () => {
  //     it("displays a success message", async () => {
  //       const checkForNewExposuresSpy = jest.fn()
  //       const showMessageSpy = showMessage as jest.Mock
  //       const response: NativeModule.DetectExposuresResponse = {
  //         kind: "success",
  //       }
  //       checkForNewExposuresSpy.mockResolvedValueOnce(response)

  //       const { getByTestId } = render(
  //         <ExposureContext.Provider
  //           value={factories.exposureContext.build({
  //             detectExposures: checkForNewExposuresSpy,
  //           })}
  //         >
  //           <History exposures={[]} lastDetectionDate={null} />
  //         </ExposureContext.Provider>,
  //       )

  //       fireEvent.press(getByTestId("check-for-exposures-button"))

  //       await waitFor(() => {
  //         expect(showMessageSpy).toHaveBeenCalledWith(
  //           expect.objectContaining({
  //             message: "Success",
  //           }),
  //         )
  //       })
  //     })
  //   })

  //   describe("when exposure check is not successful", () => {
  //     it("displays a failure message", async () => {
  //       const checkForNewExposuresSpy = jest.fn()
  //       const response: NativeModule.DetectExposuresResponse = {
  //         kind: "failure",
  //         error: "Unknown",
  //       }
  //       checkForNewExposuresSpy.mockResolvedValueOnce(response)
  //       const alertSpy = jest.fn()
  //       Alert.alert = alertSpy

  //       const { getByTestId } = render(
  //         <ExposureContext.Provider
  //           value={factories.exposureContext.build({
  //             detectExposures: checkForNewExposuresSpy,
  //           })}
  //         >
  //           <History exposures={[]} lastDetectionDate={null} />
  //         </ExposureContext.Provider>,
  //       )

  //       fireEvent.press(getByTestId("check-for-exposures-button"))

  //       await waitFor(() => {
  //         expect(alertSpy).toHaveBeenCalledWith(
  //           "Something Went Wrong",
  //           "Something unexpected happened. Please close and reopen the app and try again.",
  //           [{ text: "Okay" }],
  //         )
  //       })
  //     })
  //   })
  // })

  describe("when given an exposure history that has a possible exposure", () => {
    it("shows a list of the exposures", async () => {
      const twoDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
      const datum1 = factories.exposureDatum.build({
        date: twoDaysAgo,
      })

      const exposures = [datum1]

      const { getByTestId } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(getByTestId("exposure-list")).toBeDefined()
    })
  })
})
