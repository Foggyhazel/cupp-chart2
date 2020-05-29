import React from "react";
import { area as d3Area } from "d3-shape";
import { useChartContext } from "./manager/chartContext";
import { parseYAccessor } from "./helper";
import { Path } from "react-native-svg";
import { compose } from "./manager/scaleManager";

import { CommonPlotConfigure } from "./selectors";

function AreaPlot({ scale, y, xAxis = "_x", yAxis = "_y" }) {
  const { data, xa } = useChartContext();
  const ya = parseYAccessor(y);
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");

  const area = d3Area()
    .x((d) => sx(xa(d)))
    .y0(() => sy(0));

  return (
    <>
      {Object.values(ya).map((a, i) => (
        <Path
          key={i}
          clipPath="url(#clip)"
          d={area.y1((d) => sy(a(d)))(data)}
          stroke="none"
          strokeWidth={1}
          fill="steelblue"
          fillOpacity={0.4}
        />
      ))}
    </>
  );
}

export default compose(CommonPlotConfigure)(AreaPlot);
