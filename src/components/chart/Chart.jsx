import React, { useMemo } from "react";
import { ChartContextProvider } from "./manager/chartContext";
import Svg, { Defs, ClipPath, Rect } from "react-native-svg";
import { computeDomain, parseAccessor, firstData } from "./helper";
import { ScaleManager, _Internal_ExportScale } from "./manager/scaleManager";
import { getDefaultScaleType, scaleClass } from "./manager/scale";

const defaultMargin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

const dw = 400;
const dh = 300;

function InnerChart({
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
      if (!Array.isArray(data) || data.length == 0) {
        return computeDomain(data, xa);
      } else {
        return domain;
      }
    }
  }, [_scaleType, data, domain, xa]);

  const ctv = {
    data,
    width,
    height,
    margin: _margin,
    xa,
  };

  return (
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
        <_Internal_ExportScale
          scaleId="_x"
          domain={_domain}
          scaleType={_scaleType}
          sourceType="data"
        />
      </Svg>
    </ChartContextProvider>
  );
}
/**
 * @typedef {Object} Props
 * @property {Array} data
 * @property {string | number | function} x Accessor
 * @property {any} domain default x domain
 * @property {number} scaleType
 * @property {number} width
 * @property {number} height
 * @property {{top: number, right: number, bottom: number, left: number}} margin
 * @property {boolean} border
 * @param {Props} param0
 */
export default function Chart({ ...props }) {
  return (
    <ScaleManager>
      <InnerChart {...props} />
    </ScaleManager>
  );
}
