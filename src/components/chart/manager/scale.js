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
  // power: "power",
  // log: "log",
  // radial: "radial",
  // time: "time",
  // sequential: "sequential"

  // dis
};

export const scaleClass = {
  continuous: scaleType.linear | scaleType.time | scaleType.utc,
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

export function makeScale(type, domain) {
  switch (type) {
    case scaleType.linear:
      return d3Scale.scaleLinear().domain(domain).nice();
    case scaleType.time:
      return d3Scale.scaleTime().domain(domain).nice();
    case scaleType.utc:
      return d3Scale.scaleUtc().domain(domain).nice();
    case scaleType.band:
      return d3Scale.scaleBand().domain(domain).nice();
    case scaleType.point:
      return d3Scale.scalePoint().domain(domain).nice();
    default:
      throw new Error("not implemented");
  }
}
