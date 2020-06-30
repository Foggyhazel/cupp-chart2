import { createSelector } from "reselect";

const makeScaleFn = (scaleDict, ctx) => (id, orient) => {
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
};

export function makeScaleFactory(scales) {
  const makeGetScale = (id) => (state) => state.scale.map.get(id);
  const filteredScales = scales.filter(
    (v) => typeof v === "string" && v.length > 0
  );
  const selectors = filteredScales.map((id) => makeGetScale(id));
  return (ctx) =>
    createSelector(selectors, (...d3Scales) => {
      const scaleDict = {};
      let pass = true;
      for (let i = 0; i < d3Scales.length; i++) {
        if (d3Scales[i] == null) {
          pass = false;
          break;
        }
        scaleDict[filteredScales[i]] = d3Scales[i];
      }

      if (!pass) return null;

      return makeScaleFn(scaleDict, ctx);
    });
}
