import { createSelector } from "reselect";
import { parseYAccessor, computeDomain, computeYDomain } from "./helper";
import { getDefaultScaleType } from "./manager/scale";
import { stack as d3Stack, stackOffsetDiverging } from "d3-shape";
import { min as d3Min, max as d3Max } from "d3-array";

const getData = (d) => d;
// don't export _x by default. Because it's already done by <Chart>
// X, Y = short hand for default x and y axis. Take priority over id
const getXAxis = (_, props) => (props.X ? "_x" : props.xAxis || null);
const getYAxis = (_, props) => (props.Y ? "_y" : props.yAxis || "_y");
const getXa = (_, __, ctx) => ctx.xa;
const getYa = (_, props) => props.y;

//stack
const getStack = (_, props) => props.stack || false;
const getStackOrder = (_, props) => props.stackOrder;
const getStackOffset = (_, props) => props.stackOffset;

// short hand
const getX = (_, props) => props.X;
const getY = (_, props) => props.Y;

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
      getX,
      getY,
    ],
    (data, x, y, xa, _ya, stack, stackOrder, stackOffset, X, Y) => {
      console.log("%c▓▓ run selector", "color: darkorange");
      const ya = parseYAccessor(_ya);
      const xDomain = x && computeDomain(data, xa);
      const xScaleType = x && getDefaultScaleType(xDomain[0]);

      let setProps = {};
      //stack data
      if (stack) {
        if (typeof stack === "object") {
          const { pos, neg } = stack;
          const sign = new Map([
            ...pos.map((k) => [k, 1]),
            ...neg.map((k) => [k, -1]),
          ]);
          const ya = { ...parseYAccessor(pos), ...parseYAccessor(neg) };
          const stacker = d3Stack()
            .keys(Object.keys(ya))
            .value((d, k) => ya[k](d) * sign.get(k))
            .offset(stackOffsetDiverging);
          if (stackOrder) stacker.order(stackOrder);
          const stackedData = stacker(data);
          setProps.stackedData = stackedData;
        } else {
          const stacker = d3Stack()
            .keys(Object.keys(ya))
            .value((d, k) => ya[k](d));
          if (stackOrder) stacker.order(stackOrder);
          if (stackOffset) stacker.offset(stackOffset);
          const stackedData = stacker(data);
          setProps.stackedData = stackedData;
        }
      }

      // domain
      let yDomain;
      if (stack) {
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

      // short hand set axis id
      if (X) setProps.xAxis = "_x";
      if (Y) setProps.yAxis = "_y";

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
