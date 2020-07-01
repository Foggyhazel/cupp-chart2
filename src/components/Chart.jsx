import React, { useMemo } from "react";

import Svg, { Defs, ClipPath, Rect } from "react-native-svg";
import { computeDomain, parseAccessor, firstData } from "./helper";

import ChartManager from "./chartManager/ChartManager";
import ExportData from "./chartManager/ExportData";
import { scaleClass, getDefaultScaleType } from "./chartManager/scalefn";
import { ChartContextProvider } from "./chartManager/chartContext";

const defaultMargin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

const dw = 400;
const dh = 300;

//TODO: handle empty data and x accessor
export default function Chart({
  data = [],
  x,
  domain = null,
  scaleType = null,
  width = dw,
  height = dh,
  margin = defaultMargin,
  border = true,
  children,
}) {
  const _margin = { ...defaultMargin, ...margin };

  const xa = useMemo(() => parseAccessor(x), [x]);
  const _scaleType = scaleType || getDefaultScaleType(firstData(data, xa));

  const _domain = useMemo(() => {
    if (_scaleType & scaleClass.continuous) {
      // domain in the form of [v,v]
      const [min, max] = domain || [];
      if (min == null || max == null) {
        if (firstData(data) != null) {
          const [d_min, d_max] = computeDomain(data, xa);
          return [min != null ? min : d_min, max != null ? max : d_max];
        }
      }
      // domain will be completed by scale manager later
      return [min, max];
    } else {
      // ordinal data
      if (Array.isArray(data) && data.length > 0) {
        return computeDomain(data, xa);
      } else {
        return domain;
      }
    }
  }, [_scaleType, data, domain, xa]);

  const exportScaleX = useMemo(() => {
    return {
      id: "_x",
      domain: _domain,
      source: "data",
      scaleType: _scaleType,
    };
  }, [_domain, _scaleType]);

  const ctv = useMemo(
    () => ({
      data,
      width,
      height,
      margin: {
        top: _margin.top,
        right: _margin.right,
        bottom: _margin.bottom,
        left: _margin.left,
      },
      xa,
    }),
    [
      _margin.bottom,
      _margin.left,
      _margin.right,
      _margin.top,
      data,
      height,
      width,
      xa,
    ]
  );

  return (
    <ChartManager>
      <ChartContextProvider value={ctv}>
        <Svg width={width} height={height}>
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
          {border && (
            <Rect width={width} height={height} fill="none" stroke="#ddd" />
          )}
          {children}
          <ExportData channel="scale" data={exportScaleX} />
        </Svg>
      </ChartContextProvider>
    </ChartManager>
  );
}
