import { createSelector } from "reselect";
import {
  parseAccessor,
  parseYAccessor,
  computeDomain,
  firstData,
  computeYDomain,
} from "../chart/helper";
import { stack as d3Stack, stackOffsetDiverging } from "d3-shape";
import { min as d3Min, max as d3Max } from "d3-array";
import { getDefaultScaleType } from "../chartManager/scalefn";
import makeScaleFactory from "./factory/makeScaleFactory";

const getData = (data, props) => props.data || data;
const getXAxis = (_, props) =>
  props.X ? "_x" : props.xAxis ? props.xAxis : "_x";
const getYAxis = (_, props) =>
  props.Y ? "_y" : props.yAxis ? props.yAxis : "_y";
const getXA = (_, props, ctx) => props.x || ctx.xa;
const getYA = (_, props) => props.y;

// stack
const getStack = (_, props) => props.stack || false;
const getStackOrder = (_, props) => props.stackOrder;
const getStackOffset = (_, props) => props.stackOffset;

export default function commonPlotConfigure() {
  return createSelector(
    [
      getData,
      getXAxis,
      getYAxis,
      getXA,
      getYA,
      getStack,
      getStackOrder,
      getStackOffset,
    ],
    (data, xAxis, yAxis, xa, ya, stack, stackOrder, stackOffset) => {
      console.log("run configure...");
      const pXa = parseAccessor(xa);
      const pYa = parseYAccessor(ya);

      const exportScale = {};
      const setProps = {};

      // set default x, y axis name
      setProps.xAxis = xAxis;
      setProps.yAxis = yAxis;

      // replace accessor with the parsed one
      setProps.x = pXa;
      setProps.y = pYa;

      // stack data
      if (stack) {
        if (typeof stack === "object") {
          // stack up/down
          const { pos, neg } = stack;

          const ya = new Map([...parseYAccessor(pos), ...parseYAccessor(neg)]);
          console.log(ya);
          const sign = new Map([
            ...pos.map((k) => [k, 1]),
            ...neg.map((k) => [k, -1]),
          ]);

          const stacker = d3Stack()
            .keys([...ya.keys()])
            .value((d, k) => {
              return ya.get(k)(d) * sign.get(k);
            })
            .offset(stackOffsetDiverging);
          if (stackOrder) stacker.order(stackOrder);
          const stackedData = stacker(data);
          setProps.stackedData = stackedData;
        } else {
          // simple stack
          const stacker = d3Stack()
            .keys([...pYa.keys()])
            .value((d, k) => pYa.get(k)(d));
          if (stackOrder) stacker.order(stackOrder);
          if (stackOffset) stacker.offset(stackOffset);
          const stackedData = stacker(data);
          setProps.stackedData = stackedData;
        }
      }

      // compute y domain. lazy evaluation
      let yDomain;
      if (stack) {
        const stackedData = setProps.stackedData;
        yDomain = () => [
          d3Min(stackedData, (s) => d3Min(s, (d) => d[0])),
          d3Max(stackedData, (s) => d3Max(s, (d) => d[1])),
        ];
      } else {
        yDomain = () => computeYDomain(data, pYa);
      }

      // only export x if it's not the default "_x"
      if (xAxis !== "_x") {
        exportScale[xAxis] = {
          id: xAxis,
          domain: () => computeDomain(data, pXa),
          source: "data",
          scaleType: getDefaultScaleType(firstData(data, pXa)),
        };
      }

      // always export y
      exportScale[yAxis] = {
        id: yAxis,
        domain: yDomain,
        source: "data",
        scaleType: getDefaultScaleType(
          firstData(data, pYa.values().next().value)
        ),
      };

      return {
        data,
        exportData: {
          scale: exportScale,
        },
        setProps,
        inject: () => ({
          scale: makeScaleFactory([
            (props) => props.xAxis,
            (props) => props.yAxis,
          ]),
        }),
      };
    }
  );
}
