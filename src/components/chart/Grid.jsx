import React from "react";
import { useChartContext } from "./manager/chartContext";
import { Line, G, Rect } from "react-native-svg";
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

  let xTick;
  let yTick;

  if (xs && xs.option.tickValues) {
    xTick = xs.option.tickValues;
  } else if (xs && xs.option.tickArguments) {
    xTick = xs.ticks.apply(xs, xs.option.tickArguments);
  } else {
    xTick = (xs && xs.ticks()) || null;
  }

  if (ys && ys.option.tickValues) {
    yTick = ys.option.tickValues;
  } else if (ys && ys.option.tickArguments) {
    yTick = ys.ticks.apply(ys, ys.option.tickArguments);
  } else {
    yTick = (ys && ys.ticks()) || null;
  }

  return (
    <G>
      <Rect
        x={margin.left}
        y={margin.top}
        width={width - margin.right - margin.left}
        height={height - margin.top - margin.bottom}
        fill="none"
        stroke="#eee"
      />
      {xTick && xTick.map((t) => renderXLine(xs(t), t))}
      {yTick && yTick.map((t) => renderYLine(ys(t), t))}
    </G>
  );
}

export default compose(null)(Grid);
