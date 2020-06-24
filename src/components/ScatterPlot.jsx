import React from "react";
import { Circle, G } from "react-native-svg";
import compose from "./chartManager/compose";
import commonPlotConfigure from "./configure/commonPlotConfigure";

function ScatterPlot({
  data,
  x,
  y,
  xAxis,
  yAxis,
  scale,
  radius = 1,
  color = "black",
  opacity = 1,
}) {
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");

  return (
    <G clipPath="url(#clip)">
      {[...y.values()].map((yi, iy) =>
        data.map((d, i) => (
          <Circle
            key={`${iy}-${i}`}
            cx={sx(x(d))}
            cy={sy(yi(d))}
            r={radius}
            fill={color}
            fillOpacity={opacity}
          />
        ))
      )}
    </G>
  );
}

export default compose(commonPlotConfigure)(ScatterPlot);
