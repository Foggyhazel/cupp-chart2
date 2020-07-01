import React from "react";
import { Line, Circle, G } from "react-native-svg";
import { useChartContext } from "./chartManager/chartContext";
import compose from "./chartManager/compose";
import makeScaleFactory from "./configure/factory/makeScaleFactory";

function Marker({ scale, xAxis, yAxis, dot = false, line = "both", x, y }) {
  const { width, height, margin } = useChartContext();
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");

  const commonLineProps = {
    stroke: "black",
    strokeWidth: 1,
    strokeOpacity: 0.5,
  };

  const renderXLine = () => (
    <Line
      x1={sx(x)}
      x2={sx(x)}
      y1={height - margin.bottom}
      y2={margin.top}
      {...commonLineProps}
    />
  );
  const renderYLine = () => (
    <Line
      y1={sy(y)}
      y2={sy(y)}
      x1={margin.left}
      x2={width - margin.right}
      {...commonLineProps}
    />
  );
  const renderDot = () => (
    <Circle cx={sx(x)} cy={sy(y)} r={typeof dot === "number" ? dot : 2} />
  );

  return (
    <G>
      {xAxis && (line === "both" || line === "x") && renderXLine()}
      {yAxis && (line === "both" || line === "y") && renderYLine()}
      {xAxis && yAxis && dot && renderDot()}
    </G>
  );
}

export default compose((_, props) => {
  const setProps = {};
  if (props.x) setProps.xAxis = props.xAxis || "_x";
  if (props.y) setProps.yAxis = props.yAxis || "_y";
  return {
    setProps,
    inject: () => ({
      scale: makeScaleFactory([(props) => props.xAxis, (props) => props.yAxis]),
    }),
  };
})(Marker);
