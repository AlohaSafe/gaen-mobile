import React, { FunctionComponent } from "react"
import {
  Svg,
  Path,
  G,
  Text,
  // Circle
} from "react-native-svg"

import * as SvgPath from "./SvgPath"
import { Colors } from "../styles"

interface LineChartProps {
  datesData: string[]
  lineData: number[]
  width: number
  height: number
  color: string
}

const NUMBER_OF_HORIZONTAL_LINES = 6

const LineChart: FunctionComponent<LineChartProps> = ({
  // datesData,
  lineData,
  width,
  height,
  color,
}) => {
  if (lineData.length < 2) {
    return null
  }
  // Scale Data
  const max = Math.max(...lineData)
  const min = Math.min(...lineData)
  const shrinkYScaleBy = 1.25
  const scaleFactor = height / (max - min) / shrinkYScaleBy
  const toScale = (datum: number) => {
    return (datum - min) * scaleFactor
  }

  // Fit Path
  const xPadding = 10
  const pathWidth = width - xPadding
  const xStepWidth = pathWidth / (lineData.length - 1)
  const firstXPosition = xPadding / 2
  const toCoordinate = (datum: number, idx: number): SvgPath.Coordinate => {
    const xCoordinate = idx === 0 ? firstXPosition : idx * xStepWidth
    return [xCoordinate, height - datum]
  }

  const viewBox = `0 0 ${width} ${height}`

  const scaledData = lineData.map(toScale)
  const coordinates = scaledData.map(toCoordinate)
  const trendLinePath = SvgPath.toSmoothBezier(coordinates)

  return (
    <Svg height={height} width="100%" viewBox={viewBox}>
      {/* ////// ALOHA SAFE wrap in G tag to shift content right ////// */}
      {/* <G translate="5, 0"> */}
      <HorizontalLines height={height} width={width} />
      <Path
        d={trendLinePath}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* ////// ALOHA SAFE add points on trend line ////// */}
      {/* <DataPoints
          height={height}
          coords={coordinates}
          datesData={datesData}
          lineData={lineData}
          dotColor={color}
        /> */}
      {/* </G> */}
    </Svg>
  )
}

interface HorizontalLinesProps {
  height: number
  width: number
}

const HorizontalLines: FunctionComponent<HorizontalLinesProps> = ({
  height,
  width,
}) => {
  const buildHorizontalLineYPositions = (
    currentYPosition: number,
  ): number[] => {
    const verticalSpacing = height / (NUMBER_OF_HORIZONTAL_LINES - 1)
    return currentYPosition > height
      ? []
      : buildHorizontalLineYPositions(
          currentYPosition + verticalSpacing,
        ).concat([currentYPosition])
  }

  interface HorizontalLineProps {
    start: SvgPath.Coordinate
    end: SvgPath.Coordinate
    strokeWidth: number
    color: string
    ////// ALOHA SAFE add prop type for line values //////
    // lineValue: string
  }

  const HorizontalLine: FunctionComponent<HorizontalLineProps> = ({
    start,
    end,
    strokeWidth,
    color,
    ////// ALOHA SAFE add prop type for line values //////
    // lineValue,
  }) => {
    const path = SvgPath.toLine(start, end)
    return (
      ////// ALOHA SAFE wrap in G tag and add Text for the line values //////
      <G>
        <Path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} />
        <Text
          fill={Colors.asSecondaryGray}
          stroke={Colors.asSecondaryGray}
          fontSize="12"
          x="-4"
          y={`${start[1]}`}
        >
          {/* {lineValue} */}
        </Text>
      </G>
    )
  }
  const lineColor = Colors.neutral.shade25
  const baseLineColor = Colors.neutral.shade75
  const horizontalLinesStartingYPosition = 0
  const [baseLineY, ...lineCoords] = buildHorizontalLineYPositions(
    horizontalLinesStartingYPosition,
  )
  const baseLineStart: SvgPath.Coordinate = [0, baseLineY]
  const baseLineEnd: SvgPath.Coordinate = [width, baseLineY]

  return (
    <>
      {lineCoords.map((yCoord: number, _index: number, _yCoords: number[]) => {
        const startPoint: SvgPath.Coordinate = [0, yCoord]
        const endPoint: SvgPath.Coordinate = [width, yCoord]
        return (
          <HorizontalLine
            start={startPoint}
            end={endPoint}
            color={lineColor}
            strokeWidth={1}
            key={`hline-${yCoord}`}
            // lineValue=""
          />
        )
      })}
      <HorizontalLine
        start={baseLineStart}
        end={baseLineEnd}
        color={lineColor}
        strokeWidth={1}
        ////// ALOHA SAFE label bottom line 0 //////
        // lineValue="0"
      />
    </>
  )
}

////// ALOHA SAFE create data point component with labels and date on x-axis //////
// interface DataPointsProps {
//   coords: SvgPath.Coordinate[]
//   dotColor: string
//   lineData: number[]
//   height: number
//   datesData: string[]
// }

// const DataPoints: FunctionComponent<DataPointsProps> = ({
//   coords,
//   dotColor,
//   lineData,
//   // height,
//   // datesData,
// }) => {
//   ////// ALOHA SAFE label position variables //////
//   const radius = 4

//   let xOffsetLow = radius + 3.5
//   let xOffsetHigh = radius + 3.5

//   const yOffsetLow = radius + 9
//   const yOffsetHigh = radius + 1

//   ////// ALOHA SAFE create a y-coodinates array, find the index of the min and max for comparisions later //////
//   const coordsY = coords.map((coordArray: number[]) => {
//     return coordArray[1]
//   })

//   const lowIndex = coordsY.reduceRight(
//     (lowIdx: number, y: number, idx: number, arr: number[]) => {
//       return y > arr[lowIdx] ? idx : lowIdx
//     },
//     0,
//   )

//   const highIndex = coordsY.reduceRight(
//     (highIdx: number, y: number, idx: number, arr: number[]) => {
//       return y < arr[highIdx] ? idx : highIdx
//     },
//     0,
//   )
//   const lastIndex = coords.length - 1

//   ////// ALOHA SAFE change offset if 3 digit new cases to keep label centered on data point //////
//   const lowMoreThanTwoDigits = lineData[lowIndex].toString().length > 2
//   const highMoreThanTwoDigits = lineData[highIndex].toString().length > 2

//   xOffsetLow = lowMoreThanTwoDigits ? xOffsetLow + 1.5 : xOffsetLow
//   xOffsetHigh = highMoreThanTwoDigits ? xOffsetHigh + 1.5 : xOffsetHigh

//   return (
//     <>
//       {coords.map((point: number[], idx: number) => {
//         const xCoord = point[0]
//         const yCoord = point[1]
//         const highY = highIndex === idx
//         const lowY = lowIndex === idx

//         return (
//           <G key={`coord-${point}`}>
//             <Circle cx={xCoord} cy={yCoord} r={radius} fill={dotColor} />
//             {highY ? (
//               ////// ALOHA SAFE add label to the highest value data point //////
//               <Text
//                 fill={Colors.asSecondaryGray}
//                 stroke={Colors.asSecondaryGray}
//                 fontSize="12"
//                 ////// ALOHA SAFE shift x offset if last dot to prevent cutoff from end of canvas //////
//                 x={
//                   lastIndex && lowMoreThanTwoDigits
//                     ? xCoord - xOffsetHigh - 4
//                     : xCoord - xOffsetHigh
//                 }
//                 y={yCoord - yOffsetHigh}
//               >
//                 {lineData[idx]}
//               </Text>
//             ) : null}
//             {lowY ? (
//               ////// ALOHA SAFE add label to the lowest value data point //////
//               <Text
//                 fill={Colors.asSecondaryGray}
//                 stroke={Colors.asSecondaryGray}
//                 fontSize="12"
//                 ////// ALOHA SAFE shift x offset if last dot to prevent cutoff from end of canvas //////
//                 x={
//                   lastIndex && lowMoreThanTwoDigits
//                     ? xCoord - xOffsetLow - 4
//                     : xCoord - xOffsetLow
//                 }
//                 y={yCoord + yOffsetLow}
//               >
//                 {lineData[idx]}
//               </Text>
//             ) : null}
//             {/* <Text
//               fill="red"
//               stroke="red"
//               fontSize="8"
//               fontWeight="bold"
//               x={xCoord}
//               y={height + 10}
//               transform={`rotate(-30, ${xCoord}, ${height + 10})`}
//             >
//               {datesData[idx]}
//             </Text> */}
//           </G>
//         )
//       })}
//     </>
//   )
// }

export default LineChart
