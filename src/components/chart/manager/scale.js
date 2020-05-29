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
