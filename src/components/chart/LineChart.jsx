import React from "react";
import { useChartContext } from "./Chart";
import { line as d3Line } from "d3-shape";
import { Path } from "react-native-svg";

export default function LineChart({ stack = false, ...override }) {
  const { data, ys, y, xs, x } = useChartContext({ ...override });
  const line = d3Line().x((d) => xs(x(d)));
  return (
    <>
      {Object.values(y).map((y, i) => (
        <Path
          key={i}
          d={line.y((d) => ys(y(d)))(data)}
          stroke="steelblue"
          strokeWidth={1}
          fill="none"
        />
      ))}
    </>
  );
}
