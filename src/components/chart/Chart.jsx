import React, { createContext, useContext, useMemo } from "react";
import Inspect from "./inspect/Inspect";
import { useHandler } from "./inspect/handler";
import { computeChartContext } from "./helper";
import NoData from "./NoData";
import Svg, { Rect } from "react-native-svg";

const defaultMargin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

const dw = 400;
const dh = 300;

const ChartContext = createContext({});
/**
 * @param {import("./helper").ChartCtxOverride} override override
 */
export const useChartContext = (override) => {
  const ctv = useContext(ChartContext);
  return computeChartContext(override, ctv);
};

function InnerChart({
  data = [],
  x = null,
  xs = null,
  y = null,
  ys = null,
  width = dw,
  height = dh,
  margin = defaultMargin,
  domain = null,
  border = true,
  children,
}) {
  const handlers = useHandler();
  const ctv = useMemo(
    () =>
      computeChartContext(
        { data, width, height, margin, x, xs, xd: domain, y, ys },
        {},
        true
      ),
    [data, width, height, margin, x, xs, domain, y, ys]
  );

  if (data.length === 0)
    return <NoData width={width} height={height} border={border} />;

  return (
    <ChartContext.Provider value={ctv}>
      <Svg width={width} height={height} {...handlers}>
        <Rect height="100%" width="100%" fill="none" stroke="#ddd" />
        {children}
      </Svg>
    </ChartContext.Provider>
  );
}

export default function Chart(props) {
  return (
    <Inspect>
      <InnerChart {...props} />
    </Inspect>
  );
}
/*
const chartProps = {
  data: PropTypes.object.isRequired,
  xcol: PropTypes.string.isRequired,
  xs: PropTypes.any.isRequired,
  ys: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  })
};

Chart.propTypes = chartProps;
InnerChart.propTypes = chartProps;
*/
