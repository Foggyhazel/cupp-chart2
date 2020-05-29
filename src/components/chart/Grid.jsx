import React from "react";
import { useChartContext } from "./manager/chartContext";
import { Line, G } from "react-native-svg";
import { compose } from "./manager/scaleManager";

function Grid({ scale, xAxis, yAxis }) {
  const { width, height, margin } = useChartContext();

  const xs = scale(xAxis, "h");
  const ys = scale(yAxis, "v");

  const dy = height - margin.bottom;
  const dx = margin.left;
  const renderXLine = (x, key) => (
    <Line key={key} x1={x} y1={dy} x2={x} y2={margin.top} stroke="#eee" />
  );

  const renderYLine = (y, key) => (
    <Line
      key={key}
      x1={dx}
      y1={y}
      x2={width - margin.right}
      y2={y}
      stroke="#eee"
    />
  );

  const xTick = (xs && xs.ticks()) || null;
  const yTick = (ys && ys.ticks()) || null;

  return (
    <G>
      {xTick && xTick.map((t) => renderXLine(xs(t), t))}
      {yTick && yTick.map((t) => renderYLine(ys(t), t))}
    </G>
  );
}

export default compose(null)(Grid);
