import React, { useCallback } from "react";
import { connect } from "react-redux";
import { useChartContext } from "../chartManager/chartContext";
import { createSelector } from "reselect";

const getXAxis = (_, props) => props.xAxis;
const getYAxis = (_, props) => props.yAxis;
const getXScale = (state, props) => state.scale.map.get(props.xAxis);
const getYScale = (state, props) => state.scale.map.get(props.yAxis);

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
    scaleDict: scaleSelector(state, props),
  });
}

export const PassScaleXY = connect(makeMapStateToProps)(
  ({ scaleDict, Plot, ...innerProps }) => {
    const ctx = useChartContext();

    const scale = useCallback(
      (id, orient) => {
        if (id == null) return null;
        if (scaleDict == null) return null;

        const s = (scaleDict[id] && scaleDict[id].scale) || null;
        if (s) {
          const _s = s.copy();
          const {
            margin: { left, right, bottom, top },
            width,
            height,
          } = ctx;
          if (orient === "h") _s.range([left, width - right]);
          if (orient === "v") _s.range([height - bottom, top]);
          _s.scaleType = scaleDict[id].scaleType;
          _s.option = scaleDict[id].option;
          return _s;
        }
        return null;
      },
      [ctx, scaleDict]
    );

    if (!scaleDict) return null;

    console.log(
      "%c render ",
      "background: orange; color: black; border-radius: 4px",
      `<${Plot.name} ${innerProps.id || ""}>`
    );

    return <Plot {...innerProps} scale={scale} />;
  }
);
