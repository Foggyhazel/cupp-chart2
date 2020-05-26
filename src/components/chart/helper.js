import * as d3Scale from "d3-scale";
import { extent } from "d3-array";

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
    case "string": {
      const paths = accessor.split(".");
      if (paths.length === 1) {
        return (d) => d[accessor];
      } else {
        return (d) => paths.reduce((p, c) => p[c], d);
      }
    }
    case "number":
      return (d) => d[accessor];
    case "function":
      return accessor;
    default:
      throw new Error("invalid data accessor");
  }
}

export function parseYAccessor(y) {
  let _y;
  switch (typeof y) {
    case "string":
      _y = { [y]: parseAccessor(y) };
      break;
    case "object":
      _y = {};
      if (Array.isArray(y)) {
        y.forEach((ya) => (_y[ya] = parseAccessor(ya)));
      } else {
        Object.keys(y).forEach((k) => (_y[k] = parseAccessor(y[k])));
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
      return data.map((d) => accessor(d));
    case "object":
      if (d0 instanceof Date) return extent(data, accessor);
      else throw new Error("Cannot compute domain");
    default:
      throw new Error("Cannot compute domain");
  }
}
