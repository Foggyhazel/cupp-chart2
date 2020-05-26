import React, { useMemo, useCallback } from "react";
import Inspect from "./inspect/Inspect";
import { useHandler } from "./inspect/handler";
import { parseAccessor, computeDomain, parseYAccessor } from "./helper";
import NoData from "./NoData";
import Svg, { Rect, Defs, ClipPath } from "react-native-svg";
import Axis from "./Axis";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import { ChartContext } from "./context";

const defaultMargin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

const dw = 400;
const dh = 300;

export function getDefaultScaleType(sample) {
  const type = typeof sample;
  switch (type) {
    case "string":
      return "point";
    case "number":
      return "linear";
    case "object":
      if (sample instanceof Date) return "time";
      throw new Error("Cannot compute default scale");
    default:
      throw new Error("Cannot compute default scale");
  }
}

function makeScale(scale, min, max, r0, r1) {
  switch (scale) {
    case "linear":
      return d3Scale.scaleLinear().domain([min, max]).range([r0, r1]).nice();
    case "time":
      return d3Scale.scaleUtc().domain([min, max]).range([r0, r1]).nice();
    default:
      throw new Error(`unrecognized scale: "${scale}"`);
  }
}

function getDeclaredScale(children, getRange, data, xa) {
  const childArr = React.Children.toArray(children);

  // map, plot using each axis id
  const axisUser = {};
  const addUser = (id, info, props, dim) => {
    if (axisUser[id] === undefined) axisUser[id] = [];
    axisUser[id].push({
      info,
      props,
      dim,
    });
  };
  childArr
    .filter((c) => c.type != Axis)
    .forEach((c) => {
      const { xAxis, yAxis } = c.props;
      if (xAxis == null && yAxis == null) return;
      const info = c.type.info || {};

      if (xAxis) {
        addUser(xAxis, info, c.props, "x");
      }

      if (yAxis) {
        addUser(yAxis, info, c.props, "y");
      }
    });

  const scaleMap = {};
  childArr
    .filter((c) => c.type == Axis)
    .forEach((c) => {
      let { id, scale, min, max, orient } = c.props;
      const user =
        (axisUser[id] && axisUser[id].length > 0 && axisUser[id][0]) || null;

      // range
      const [r0, r1] = getRange(orient === "top" || orient === "bottom");

      // handle scale = auto
      // TODO: scale by data type
      if (scale === "auto") {
        scale = (user && user.info.defaultScale) || "linear";
      }

      // handle auto min or max
      if (min == null || max == null) {
        let domain;
        const dim = (user && user.dim) || null;
        switch (dim) {
          case "x": {
            domain = computeDomain(data, xa);
            break;
          }
          case "y": {
            const ya =
              (user &&
                user.props &&
                user.props.y != null &&
                parseYAccessor(user.props.y)) ||
              null;
            const allExtent = ya
              ? Object.values(ya).map((a) => computeDomain(data, a))
              : [[0, 1]];
            domain = [
              d3Array.min(allExtent, (e) => e[0]),
              d3Array.max(allExtent, (e) => e[1]),
            ];
            break;
          }
          default:
            domain = [0, 1];
        }

        if (min == null) min = domain[0];
        if (max == null) max = domain[1];
      }

      scaleMap[id] = makeScale(scale, min, max, r0, r1);
    });

  return scaleMap;
}

function InnerChart({
  data = [],
  x,
  min = null,
  max = null,
  scale = null,
  width = dw,
  height = dh,
  margin = defaultMargin,
  border = true,
  children,
}) {
  const handlers = useHandler();

  console.log("render chart");

  // final margin
  const _margin = { ...defaultMargin, ...margin };

  const getRange = useCallback(
    (horizontal) => {
      if (horizontal) {
        return [_margin.left, width - _margin.right];
      } else {
        return [height - _margin.bottom, _margin.top];
      }
    },
    [_margin.bottom, _margin.left, _margin.right, _margin.top, height, width]
  );

  // TODO: multiple x-axis
  //determine x axis
  const xa = parseAccessor(x);
  let domain;
  if (min == null || max == null) {
    domain = computeDomain(data, xa);
  }
  const xs = makeScale(
    scale || getDefaultScaleType(xa(data[0])),
    min != null ? min : domain[0],
    max != null ? max : domain[1],
    _margin.left,
    width - _margin.right
  );

  // get scale map declared by Axis component
  const scaleMap = useMemo(
    () => getDeclaredScale(children, getRange, data, xa),
    [children, getRange, data, xa]
  );

  const ctv = {
    data,
    width,
    height,
    margin: _margin,
    xa,
    scale: {
      _x: xs,
      ...scaleMap,
    },
  };

  if (data.length === 0)
    return <NoData width={width} height={height} border={border} />;

  return (
    <ChartContext.Provider value={ctv}>
      <Svg width={width} height={height} {...handlers}>
        <Defs>
          <ClipPath id="clip">
            <Rect
              x={_margin.left}
              y={_margin.top}
              width={width - _margin.left - _margin.right}
              height={height - _margin.top - _margin.bottom}
            />
          </ClipPath>
        </Defs>
        <Rect width={width} height={height} fill="none" stroke="#ddd" />
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
