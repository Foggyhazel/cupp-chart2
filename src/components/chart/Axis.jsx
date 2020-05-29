import React from "react";
import { compose } from "./manager/scaleManager";
import { useChartContext } from "./manager/chartContext";
import ChartAxis from "./ChartAxis";

function Axis({ id, scale, orient = "left", draw = true, ...rest }) {
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
  return draw ? (
    <ChartAxis
      orient={orient}
      scale={scale(id, orient === "left" || orient === "right" ? "v" : "h")}
      offsetX={offsetX}
      offsetY={offsetY}
      {...rest}
    />
  ) : null;
}

export default compose((_, props) => ({
  exportScale: {
    [props.id]: {
      domain: props.domain,
      min: props.min,
      max: props.max,
      sourceType: "axis",
      scaleType: props.scaleType,
    },
  },
}))(Axis);
