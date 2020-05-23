import React from "react";
import Svg, { Rect, Text } from "react-native-svg";

export default function NoData({
  width,
  height,
  message = "No data.",
  children,
  border = true,
}) {
  return (
    <Svg width={width} height={height}>
      {border && <Rect height="100%" width="100%" fill="none" stroke="#ddd" />}
      {message != null && (
        <Text
          fill="#bbb"
          fontSize={14}
          y={height / 2}
          x={width / 2}
          textAnchor="middle"
        >
          {message}
        </Text>
      )}
      {children}
    </Svg>
  );
}
