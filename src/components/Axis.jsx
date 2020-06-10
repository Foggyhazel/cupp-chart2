import React from "react";
import ChartAxis from "./ChartAxis";
import { useChartContext } from "./chartManager/chartContext";
import compose from "./chartManager/compose";
import axisConfigure from "./configure/axisConfigure";
//TODO: auto orient axis
function Axis({ id, scale, orient = "left", hide = false, ...rest }) {
  const { width, height, margin } = useChartContext();
  const offsetX = {
    left: margin.left,
    top: 0,
    bottom: 0,
    right: width - margin.right,
  }[orient];
  const offsetY = {
    top: margin.top,
    bottom: height - margin.bottom,
    left: 0,
    right: 0,
  }[orient];
  return !hide ? (
    <ChartAxis
      orient={orient}
      rawScale={scale(id, orient === "left" || orient === "right" ? "v" : "h")}
      offsetX={offsetX}
      offsetY={offsetY}
      {...rest}
    />
  ) : null;
}

export default compose(axisConfigure)(Axis);
