import { createSelector } from "reselect";
import { parseYAccessor, computeDomain, computeYDomain } from "./helper";
import { getDefaultScaleType } from "./manager/scale";

const getData = (d) => d;
const getXAxis = (_, props) => props.xAxis || "_x";
const getYAxis = (_, props) => props.yAxis || "_y";
const getXa = (_, __, ctx) => ctx.xa;
const getYa = (_, props) => props.y;

export const CommonPlotConfigure = () => {
  return createSelector(
    [getData, getXAxis, getYAxis, getXa, getYa],
    (data, x, y, xa, _ya) => {
      const ya = parseYAccessor(_ya);
      const xDomain = computeDomain(data, xa);
      const yDomain = computeYDomain(data, ya);
      const xScaleType = getDefaultScaleType(xDomain[0]);
      const yScaleType = getDefaultScaleType(yDomain[0]);
      console.log("%crun selector", "color: coral");
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
