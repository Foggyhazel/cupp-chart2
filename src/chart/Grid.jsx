import React from "react";
import { Line, G, Rect } from "react-native-svg";
import compose from "../chartManager/compose";
import { useChartContext } from "../chartManager/chartContext";
import makeScaleFactory from "../configure/factory/makeScaleFactory";

function Grid({ scale, xAxis, yAxis, X, Y, noBorder }) {
  const { width, height, margin } = useChartContext();

  const xs = scale(X ? "_x" : xAxis, "h");
  const ys = scale(Y ? "_y" : yAxis, "v");

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

  if (xs) {
    if (xs.option.tickValues) {
      xTick = xs.option.tickValues;
    } else if (xs.option.tickArguments) {
      xTick = xs.ticks.apply(xs, xs.option.tickArguments);
    } else {
      xTick = (xs.ticks && xs.ticks()) || xs.domain();
    }
  }

  if (ys) {
    if (ys.option.tickValues) {
      yTick = ys.option.tickValues;
    } else if (ys.option.tickArguments) {
      yTick = ys.ticks.apply(ys, ys.option.tickArguments);
    } else {
      yTick = (ys.ticks && ys.ticks()) || ys.domain();
    }
  }

  return (
    <G>
      {!noBorder && (
        <Rect
          x={margin.left}
          y={margin.top}
          width={width - margin.right - margin.left}
          height={height - margin.top - margin.bottom}
          fill="none"
          stroke="#eee"
        />
      )}
      {xTick && xTick.map((t) => renderXLine(xs(t), t))}
      {yTick && yTick.map((t) => renderYLine(ys(t), t))}
    </G>
  );
}

export default compose((_, props) => ({
  setProps: {
    xAxis: props.X ? "_x" : props.xAxis || null,
    yAxis: props.Y ? "_y" : props.yAxis || null,
  },
  inject: () => ({
    scale: makeScaleFactory([(props) => props.xAxis, (props) => props.yAxis]),
  }),
}))(Grid);
