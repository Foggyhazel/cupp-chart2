import { extent, min as d3Min, max as d3Max } from "d3-array";

/*
export function getDefaultScale(sample) {
  const type = typeof sample;
  switch (type) {
    case "string":
      return d3Scale.scalePoint();
    case "number":
      return d3Scale.scaleLinear();
    case "object":
      if (sample instanceof Date) return d3Scale.scaleTime();
      return null;
    default:
      return null;
  }
}
*/

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
  let _y = new Map();
  switch (typeof y) {
    case "string":
      _y.set(y, parseAccessor(y));
      break;
    case "object":
      if (Array.isArray(y)) {
        y.forEach((ya) => _y.set(ya, parseAccessor(ya)));
      } else {
        Object.keys(y).forEach((k) => _y.set(k, parseAccessor(y[k])));
      }
      break;
    default:
      throw new Error("Invalid y accessor(s)");
  }
  return _y;
}

const epsilon = 1e-5;

export function computeDomain(data, accessor) {
  if (!Array.isArray(data) || data.length === 0) return [0, epsilon];
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

export function computeYDomain(data, accessorObj) {
  const allExtent = Object.values(accessorObj).map((ya) =>
    computeDomain(data, ya)
  );
  return [d3Min(allExtent, (e) => e[0]), d3Max(allExtent, (e) => e[1])];
}

export function firstData(data, accessor = null) {
  if (Array.isArray(data) && data.length > 0) {
    return accessor ? accessor(data[0]) : data[0];
  }

  return null;
}
