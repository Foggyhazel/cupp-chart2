import React from "react";
import { area as d3Area } from "d3-shape";
import { useChartContext } from "./manager/chartContext";
import { parseYAccessor } from "./helper";
import { Path } from "react-native-svg";
import { compose } from "./manager/scaleManager";

import { CommonPlotConfigure } from "./selectors";

const color = ["red", "green", "blue"];

function AreaPlot({
  scale,
  y,
  xAxis = "_x",
  yAxis = "_y",
  stack,
  stackedData,
}) {
  const { data, xa } = useChartContext();
  const ya = parseYAccessor(y);
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");

  const commonProps = {
    clipPath: "url(#clip)",
    stroke: "none",
    strokeWidth: 1,
    fillOpacity: 1,
  };

  let area;
  if (stack) {
    area = d3Area()
      .x((d) => sx(xa(d.data)))
      .y0((d) => sy(d[0]))
      .y1((d) => sy(d[1]));

    return stackedData.map((s, i) => (
      <Path key={i} d={area(s)} {...commonProps} fill={color[i]} />
    ));
  } else {
    area = d3Area()
      .x((d) => sx(xa(d)))
      .y0(() => sy(0));

    return Object.values(ya).map((a, i) => (
      <Path
        key={i}
        d={area.y1((d) => sy(a(d)))(data)}
        {...commonProps}
        fill={color[i]}
      />
    ));
  }
}

export default compose(CommonPlotConfigure)(AreaPlot);
