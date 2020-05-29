import { createSelector } from "reselect";
import { parseYAccessor, computeDomain, computeYDomain } from "./helper";
import { getDefaultScaleType } from "./manager/scale";
import { stack as d3Stack } from "d3-shape";
import { min as d3Min, max as d3Max } from "d3-array";

const getData = (d) => d;
// don't export _x by default. Because it's already done by <Chart>
const getXAxis = (_, props) => props.xAxis || null;
const getYAxis = (_, props) => props.yAxis || "_y";
const getXa = (_, __, ctx) => ctx.xa;
const getYa = (_, props) => props.y;

//stack
const getStack = (_, props) => props.stack || false;
const getStackOrder = (_, props) => props.stackOrder;
const getStackOffset = (_, props) => props.stackOffset;

export const CommonPlotConfigure = () => {
  return createSelector(
    [
      getData,
      getXAxis,
      getYAxis,
      getXa,
      getYa,
      getStack,
      getStackOrder,
      getStackOffset,
    ],
    (data, x, y, xa, _ya, do_stack, stackOrder, stackOffset) => {
      console.log("%c▓▓ run selector", "color: darkorange");
      const ya = parseYAccessor(_ya);
      const xDomain = x && computeDomain(data, xa);
      const xScaleType = x && getDefaultScaleType(xDomain[0]);

      let setProps = {};
      //stack data
      if (do_stack) {
        const stack = d3Stack()
          .keys(Object.values(ya))
          .value((d, k) => k(d));
        if (stackOrder) stack.order(stackOrder);
        if (stackOffset) stack.offset(stackOffset);
        const stackedData = stack(data);
        setProps.stackedData = stackedData;
      }

      // domain
      let yDomain;
      if (do_stack) {
        const stackedData = setProps.stackedData;
        yDomain = [
          d3Min(stackedData, (s) => d3Min(s, (d) => d[0])),
          d3Max(stackedData, (s) => d3Max(s, (d) => d[1])),
        ];
      } else {
        yDomain = computeYDomain(data, ya);
      }
      //TODO: lazy domain calculation
      const yScaleType = getDefaultScaleType(yDomain[0]);

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
        setProps,
      };
    }
  );
};
