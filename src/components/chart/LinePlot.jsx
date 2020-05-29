import React from "react";
import { line as d3Line } from "d3-shape";
import { useChartContext } from "./manager/chartContext";
import { parseYAccessor } from "./helper";
import { Path } from "react-native-svg";
import { compose } from "./manager/scaleManager";

import { CommonPlotConfigure } from "./selectors";

function LinePlot({ scale, y, xAxis = "_x", yAxis = "_y" }) {
  const { data, xa } = useChartContext();
  const ya = parseYAccessor(y);
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");
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

export default compose(CommonPlotConfigure)(LinePlot);
