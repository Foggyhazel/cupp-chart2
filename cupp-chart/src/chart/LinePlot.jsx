import React from "react";
import { line as d3Line, curveLinear } from "d3-shape";
import { Path } from "react-native-svg";
import compose from "../chartManager/compose";
import commonPlotConfigure from "../configure/commonPlotConfigure";

function LinePlot({
  data,
  scale,
  x,
  y,
  xAxis = "_x",
  yAxis = "_y",
  curve = curveLinear,
}) {
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");
  const line = d3Line()
    .x((d) => sx(x(d)))
    .curve(curve);
  return (
    <>
      {[...y.values()].map((a, i) => (
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

export default compose(commonPlotConfigure)(LinePlot);
