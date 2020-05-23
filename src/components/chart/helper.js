import * as d3Scale from "d3-scale";
import { extent, min, max } from "d3-array";
import _ from "lodash";

export function getDefaultScale(sample) {
  const type = typeof sample;
  switch (type) {
    case "string":
      return d3Scale.scalePoint();
    case "number":
      return d3Scale.scaleLinear();
    case "object":
      if (sample instanceof Date) return d3Scale.scaleUtc();
      throw new Error("Cannot compute default scale");
    default:
      throw new Error("Cannot compute default scale");
  }
}

export function parseAccessor(accessor) {
  switch (typeof accessor) {
    case "string":
      const paths = accessor.split(".");
      if (paths.length === 1) {
        return d => d[accessor];
      } else {
        return d => paths.reduce((p, c) => p[c], d);
      }
    case "number":
      return d => d[accessor];
    case "function":
      return accessor;
    default:
      throw new Error("invalid data accessor");
  }
}

function parseYAccessor(y) {
  let _y;
  switch (typeof y) {
    case "string":
      _y = { [y]: parseAccessor(y) };
      break;
    case "object":
      _y = {};
      if (Array.isArray(y)) {
        y.forEach(ya => (_y[ya] = parseAccessor(ya)));
      } else {
        Object.keys(y).forEach(k => (_y[k] = parseAccessor(y[k])));
      }
      break;
    default:
      throw new Error("Invalid y accessor(s)");
  }
  return _y;
}

const epsilon = 1e-5;

export function computeDomain(data, accessor) {
  if (data.length === 0) return [0, epsilon];
  const d0 = accessor(data[0]);
  switch (typeof d0) {
    case "number":
      return extent(data, accessor);
    case "string":
      return data.map(d => accessor(d));
    case "object":
      if (d0 instanceof Date) return extent(data, accessor);
      else throw new Error("Cannot compute domain");
    default:
      throw new Error("Cannot compute domain");
  }
}

const DH = 300;
const DW = 400;
const DM = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
};

/**
 * @typedef {Object} Margin
 * @property {number} top
 * @property {number} right
 * @property {number} bottom
 * @property {number} left
 *
 * @typedef {Object} ChartCtxOverride
 * @property {Array<Object>} data
 * @property {number} width
 * @property {number} height
 * @property {Margin} margin
 * @property {string|function|number} x
 * @property {string[] | Object<string, string|number|function>} y
 * @property {any} xs d3 scale
 * @property {any} ys d3 scale
 * @property {[number, number]} xd domain
 * @property {[number, number]} xr range
 * @property {[number, number]} yd domain
 * @property {[number, number]} yr range
 * @param {ChartCtxOverride} param0
 * @param {Object} ctv chart context value
 * @param {boolean} isChartRoot
 */
export function computeChartContext(
  { data, width, height, margin = {}, x, xs, xd, xr, y, ys, yd, yr },
  ctv = {},
  isChartRoot = false
) {
  if (data == null && ctv.data == null) throw new Error("No data specified");
  const _data = data != null ? data : ctv.data;

  const _width = width != null ? width : ctv.width ? ctv.width : DW;
  const _height = height != null ? height : ctv.height ? ctv.height : DH;
  const _margin = _.defaults({}, margin, ctv.margin, DM);

  let _x;
  if (x == null && ctv.x == null) throw new Error("No x accessor specified");
  _x = x != null ? parseAccessor(x) : ctv.x;
  if (_data[0] && _x(_data[0]) === undefined) {
    throw new Error("Invalid X accessor");
  }

  let _y;
  if (y == null) {
    if (isChartRoot) {
      _y = null;
    } else if (ctv.y) {
      _y = ctv.y;
    } else {
      throw new Error("No y accessor specified");
    }
  } else {
    _y = parseYAccessor(y);
  }

  if (_data[0] && _y != null) {
    // console.log(_y);
    Object.values(_y).forEach(a => {
      if (a(_data[0]) === undefined) {
        throw new Error("Invalid Y accessor");
      }
    });
  }

  let _xs;
  if (xs == null) {
    _xs = ctv.xs
      ? ctv.xs.copy()
      : _data.length > 0
      ? getDefaultScale(_x(_data[0]))
          .domain(xd ? xd : computeDomain(_data, _x))
          .range(xr ? xr : [_margin.left, _width - _margin.right])
      : getDefaultScale(0);
  } else {
    _xs = xs.copy();
    _xs
      .domain(xd ? xd : computeDomain(_data, _x))
      .range(xr ? xr : [_margin.left, _width - _margin.right]);
  }

  const getDefaultYs = (s = null) => {
    const k = Object.keys(_y);
    const scale = s ? s.copy() : getDefaultScale(_y[k[0]](_data[0]));
    const allExtent = k.map(k => extent(_data, _y[k]));
    scale
      .domain(yd ? yd : [min(allExtent, e => e[0]), max(allExtent, e => e[1])])
      .range(yr ? yr : [_height - _margin.bottom, _margin.top]);
    return scale;
  };

  let _ys;
  if (ys == null) {
    if (ctv.ys) _ys = ctv.ys.copy();
    else if (isChartRoot) {
      _ys = null;
    } else {
      _ys = getDefaultYs();
    }
  } else {
    _ys = getDefaultYs(ys);
  }

  return {
    data: _data,
    width: _width,
    height: _height,
    margin: _margin,
    x: _x,
    y: _y,
    xs: _xs,
    ys: _ys
  };
}
