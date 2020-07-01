import { createSelector } from "reselect";

const makeScaleFactory = (scales) => {
  const getCtx = (_, __, ctx) => ctx;
  // selector return false if id is empty-ish and null if not exist in store
  const scaleObjSelectors = scales.map((s) => (state, props) => {
    switch (typeof s) {
      case "string":
        return s.length > 0 ? state.scale.map.get(s) || null : false;
      case "function": {
        const id = s(props);
        return id ? state.scale.map.get(id) || null : false;
      }
      default:
        return false;
    }
  });
  return () =>
    createSelector([getCtx, ...scaleObjSelectors], (ctx, ...storedScales) => {
      let pass = true;
      const scaleDict = {};
      for (const r of storedScales) {
        if (r === false) continue;
        if (r === null) {
          pass = false;
          break;
        }

        scaleDict[r.id] = r;
      }

      if (!pass) return null;

      return (id, orient) => {
        if (id == null) return null;

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
    });
};

export default makeScaleFactory;
