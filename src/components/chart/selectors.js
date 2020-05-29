import { createSelector } from "reselect";
import { parseYAccessor, computeDomain, computeYDomain } from "./helper";
import { getDefaultScaleType } from "./manager/scale";

const getData = (d) => d;
// don't export _x by default. Because it's already done by <Chart>
const getXAxis = (_, props) => props.xAxis || null;
const getYAxis = (_, props) => props.yAxis || "_y";
const getXa = (_, __, ctx) => ctx.xa;
const getYa = (_, props) => props.y;

export const CommonPlotConfigure = () => {
  return createSelector(
    [getData, getXAxis, getYAxis, getXa, getYa],
    (data, x, y, xa, _ya) => {
      const ya = parseYAccessor(_ya);
      const xDomain = x && computeDomain(data, xa);
      const yDomain = computeYDomain(data, ya);
      const xScaleType = x && getDefaultScaleType(xDomain[0]);
      const yScaleType = getDefaultScaleType(yDomain[0]);
      console.log("%c▓▓ run selector", "color: darkorange");
      return {
        exportScale: {
          [x]: {
            domain: xDomain,
            sourceType: "data",
            scaleType: xScaleType,
          },
          [y]: {
            domain: yDomain,
            sourceType: "data",
            scaleType: yScaleType,
          },
        },
      };
    }
  );
};
