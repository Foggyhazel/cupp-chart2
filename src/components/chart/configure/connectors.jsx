import React, { useCallback } from "react";
import { connect } from "react-redux";
import { useChartContext } from "../chartManager/chartContext";
import { createSelector } from "reselect";

const getXAxis = (_, props) => props.innerProps.xAxis;
const getYAxis = (_, props) => props.innerProps.YAxis;
const getXScale = (state, props) => state.scale.map[props.innerProps.xAxis];
const getYScale = (state, props) => state.scale.map[props.innerProps.yAxis];

function makeScaleXYSelector() {
  return createSelector(
    [getXAxis, getYAxis, getXScale, getYScale],
    (xAxis, yAxis, xScale, yScale) => {
      if (!xScale || !yScale) return null;

      return {
        [xAxis]: xScale,
        [yAxis]: yScale,
      };
    }
  );
}

function makeMapStateToProps() {
  const scaleSelector = makeScaleXYSelector();
  return (state, props) => ({
    scaleMap: scaleSelector(state, props),
  });
}

export const PassScaleXY = connect(makeMapStateToProps)(
  ({ scaleMap, Elem, innerProps }) => {
    const ctx = useChartContext();

    const scale = useCallback(
      (id, orient) => {
        if (id == null) return null;
        if (scaleMap == null) return null;

        const s = (scaleMap[id] && scaleMap[id].scale) || null;
        if (s) {
          const _s = s.copy();
          const {
            margin: { left, right, bottom, top },
            width,
            height,
          } = ctx;
          if (orient === "h") _s.range([left, width - right]);
          if (orient === "v") _s.range([height - bottom, top]);
          _s.scaleType = scale.map[id].scaleType;
          _s.option = scale.map[id].option;
          return _s;
        }
        return null;
      },
      [ctx, scaleMap]
    );

    if (!scaleMap) return null;

    return <Elem {...innerProps} scale={scale} />;
  }
);
