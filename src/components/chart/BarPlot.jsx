import React from "react";
import { Rect } from "react-native-svg";
import { compose } from "./manager/scaleManager";
import { BandPlotConfigure } from "./selectors";

function BarPlot({ data, scale, x, y, xAxis, yAxis }) {
  const sx = scale(xAxis, "h");
  const sy = scale(yAxis, "v");
  const y0 = sy.domain()[0];

  return (
    <>
      {[...y.values()].map((ya, yi) =>
        data.map((d, i) => (
          <Rect
            key={`${i}-${yi}`}
            x={sx(x(d))}
            y={sy(ya(d))}
            width={sx.bandwidth()}
            height={sy(y0) - sy(ya(d))}
            fill="steelblue"
          />
        ))
      )}
    </>
  );
}

export default compose(BandPlotConfigure)(BarPlot);
