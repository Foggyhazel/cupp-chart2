import React from "react";
import { Circle } from "react-native-svg";
import { compose } from "./manager/scaleManager";
import { CommonPlotConfigure } from "./selectors";

function ScatterPlot({ data, x, y, xAxis, yAxis, scale, radius = 1 }) {
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");

  return [...y.values()].map((yi, iy) =>
    data.map((d, i) => (
      <Circle key={`${iy}-${i}`} cx={sx(x(d))} cy={sy(yi(d))} r={radius} />
    ))
  );
}

export default compose(CommonPlotConfigure)(ScatterPlot);
