import React from "react";
import { line as d3Line } from "d3-shape";
import { Path } from "react-native-svg";
import { useChartContext } from "./context";

export default function LineChart({ y, xAxis = null, yAxis }) {
  const { data, xa, ya, sx, sy } = useChartContext({ y, xAxis, yAxis });
  console.log("draw line");
  const line = d3Line().x((d) => sx(xa(d)));
  return (
    <>
      {Object.values(ya).map((a, i) => (
        <Path
          key={i}
          clipPath="url(#clip)"
          d={line.y((d) => sy(a(d)))(data)}
          stroke="steelblue"
          strokeWidth={1}
          fill="none"
        />
      ))}
    </>
  );
}

LineChart.info = {
  defaultScale: "linear",
};
