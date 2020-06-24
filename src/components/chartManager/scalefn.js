import * as d3Scale from "d3-scale";

/**
 * Helper functions related to scale
 */

export const scaleType = {
  // con -> con
  linear: 1,
  utc: 2,
  time: 4,
  point: 8,
  band: 16,
  log: 32,
  // power: "power",
  // log: "log",
  // radial: "radial",
  // time: "time",
  // sequential: "sequential"

  // dis
};

export const scaleClass = {
  continuous: scaleType.linear | scaleType.time | scaleType.utc | scaleType.log,
  ordinal: scaleType.point | scaleType.band,
};

export function getDefaultScaleType(sample) {
  const type = typeof sample;
  switch (type) {
    case "string":
      return scaleType.point;
    case "number":
      return scaleType.linear;
    case "object":
      if (sample instanceof Date) return scaleType.time;
      return null;
    default:
      return null;
  }
}

export function makeScale(type, domain, option = {}) {
  let scale;
  switch (type) {
    case scaleType.linear:
      scale = d3Scale.scaleLinear().domain(domain);
      break;
    case scaleType.log:
      scale = d3Scale.scaleLog().domain(domain).clamp(true);
      break;
    case scaleType.time:
      scale = d3Scale.scaleTime().domain(domain);
      break;
    case scaleType.utc:
      scale = d3Scale.scaleUtc().domain(domain);
      break;
    case scaleType.band:
      scale = d3Scale.scaleBand().domain(domain);
      break;
    case scaleType.point:
      scale = d3Scale.scalePoint().domain(domain);
      break;
    default:
      throw new Error("not implemented");
  }

  if (type & scaleClass.continuous && option.nice) {
    scale.nice();
  }

  if (type & scaleType.band) {
    if (option.padding != null) scale.padding(option.padding);
    if (option.paddingInner != null) scale.paddingInner(option.paddingInner);
    if (option.paddingOuter != null) scale.paddingOuter(option.paddingOuter);
  }

  return scale;
}
