import React, { FunctionComponent } from "react"
import { Svg, Path, G, Text, Circle } from "react-native-svg"

import * as SvgPath from "./SvgPath"
import { Colors } from "../styles"

interface LineChartProps {
  datesData: string[]
  lineData: number[]
  width: number
  height: number
  color: string
  dotColor: string
}

const NUMBER_OF_HORIZONTAL_LINES = 6

const LineChart: FunctionComponent<LineChartProps> = ({
  datesData,
  lineData,
  width,
  height,
  color,
  dotColor,
}) => {
  if (lineData.length < 2) {
    return null
  }

  // Scale Data
  const max = Math.max(...lineData)
  const min = 0 // Math.min(...lineData)
  const shrinkYScaleBy = 1.25
  const scaleFactor = height / (max - min) / shrinkYScaleBy
  const toScale = (datum: number) => {
    return (datum - min) * scaleFactor
  }

  ////// ALOHA SAFE add top line value //////
  const topLine = (max / 4) * 5

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
      <G translate="5, 0">
        <HorizontalLines height={height} width={width} topLine={topLine} />
        <Path
          d={trendLinePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* ////// ALOHA SAFE add points on trend line ////// */}
        <DataPoints
          height={height}
          coords={coordinates}
          datesData={datesData}
          lineData={lineData}
          dotColor={dotColor}
        />
      </G>
    </Svg>
  )
}

interface HorizontalLinesProps {
  height: number
  width: number
  ////// ALOHA SAFE add prop type for top line value //////
  topLine: number
}

const HorizontalLines: FunctionComponent<HorizontalLinesProps> = ({
  height,
  width,
  ////// ALOHA SAFE add prop type for top line value //////
  topLine,
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
    ////// ALOHA SAFE add prop type for top line value //////
    lineValue: string
  }

  const HorizontalLine: FunctionComponent<HorizontalLineProps> = ({
    start,
    end,
    strokeWidth,
    color,
    ////// ALOHA SAFE add prop type for top line value //////
    lineValue,
  }) => {
    const path = SvgPath.toLine(start, end)
    return (
      ////// ALOHA SAFE wrap in G tag and add Text for the line values //////
      <G>
        <Path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} />
        <Text
          fill={Colors.asBlue}
          stroke={Colors.asBlue}
          fontSize="10"
          fontWeight="bold"
          x="-4"
          y={`${start[1]}`}
        >
          {lineValue}
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
      {lineCoords.map((yCoord: number, index: number, yCoords: number[]) => {
        const startPoint: SvgPath.Coordinate = [0, yCoord]
        const endPoint: SvgPath.Coordinate = [width, yCoord]
        ////// ALOHA SAFE render top line value if line is last index //////
        const lastIndex: boolean = index === yCoords.length - 1
        return lastIndex ? (
          <HorizontalLine
            start={startPoint}
            end={endPoint}
            color={lineColor}
            strokeWidth={1}
            key={`hline-${yCoord}`}
            lineValue={`${topLine}`}
          />
        ) : (
          <HorizontalLine
            start={startPoint}
            end={endPoint}
            color={lineColor}
            strokeWidth={1}
            key={`hline-${yCoord}`}
            lineValue=""
          />
        )
      })}
      <HorizontalLine
        start={baseLineStart}
        end={baseLineEnd}
        color={baseLineColor}
        strokeWidth={2}
        ////// ALOHA SAFE label bottom line 0 //////
        lineValue="0"
      />
    </>
  )
}

////// ALOHA SAFE create data point component with labels and date on x-axis //////
interface DataPointsProps {
  coords: SvgPath.Coordinate[]
  dotColor: string
  height: number
  lineData: number[]
  datesData: string[]
}

const DataPoints: FunctionComponent<DataPointsProps> = ({
  coords,
  dotColor,
  height,
  lineData,
  datesData,
}) => {
  const radius = 4
  return (
    <>
      {coords.map((point: number[], index: number) => {
        // let xCoord = point[0] - 5
        // let yCoord = point[1] - 5
        return (
          <G key={`coord-${point}`}>
            <Circle cx={point[0]} cy={point[1]} r={radius} fill={dotColor} />
            {/* <Text
              fill="blue"
              stroke="blue"
              fontSize="10"
              fontWeight="bold"
              x={xCoord}
              y={yCoord}
            >
              {lineData[index]}
            </Text> */}
            {/* <Text
              fill="red"
              stroke="red"
              fontSize="8"
              fontWeight="bold"
              x={xCoord}
              y={height + 10}
              transform={`rotate(-30, ${xCoord}, ${height + 10})`}
            >
              {datesData[index]}
            </Text> */}
          </G>
        )
      })}
    </>
  )
}

export default LineChart
