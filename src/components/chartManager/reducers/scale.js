import { chEXPORT, chUNEXPORT } from "../action/exportData";
import { chCOMMIT } from "../action/channelAction";
import { scaleClass, getDefaultScaleType } from "../../manager/scale";

const CH = "scale";

const SCALE_EXPORT = chEXPORT(CH);
const SCALE_UNEXPORT = chUNEXPORT(CH);
const SCALE_COMMIT = chCOMMIT(CH);

function scale(state = { exportedScale: {}, map: {} }, action) {
  switch (action.type) {
    case SCALE_EXPORT:
      console.log("EXPORT");
      return {
        ...state,
        exportedScale: { ...state.exportedScale, [action.key]: action.data },
      };
    case SCALE_UNEXPORT: {
      // eslint-disable-next-line no-unused-vars
      const { [action.key]: omit, ...rest } = state.exportedScale;
      return {
        ...state,
        exportedScale: rest,
      };
    }
    case SCALE_COMMIT:
      console.log("COMMIT", state.exportedScale);
      return state;
    default:
      return state;
  }
}

export default scale;

const checked = {
  scaleType: 1,
  domain: 2,
  option: 4,

  completed: 1 | 2 | 4,
};

function mergeInfo(dst, src) {
  // scaleType: fixed once set
  if (!(dst._progress & checked.scaleType) && src.scaleType) {
    dst.scaleType = src.scaleType;
    dst._progress |= checked.scaleType;
  }

  // domain
  const { min, max, domain } = src;

  if (!(dst._progress & checked.domain)) {
    if (dst.scaleType & scaleClass.continuous) {
      if (dst._expectType && !(dst._expectType & scaleClass.continuous)) {
        throw new Error(`Incompatible type specified. 
        Expected scale type for "${dst.id}" to be continuous`);
      } else {
        dst._expectType = null;
      }

      // assume domain.length = 2 for continuous type

      const tmp = dst.domain || [];
      const mm = [min, max];
      let d;
      if (min == null || max == null) {
        if (typeof domain === "function") d = domain();
        else if (Array.isArray(domain)) d = domain;
        else d = [];
      }
      // prettier-ignore
      const result = [
        tmp[0] != null ? tmp[0] : mm[0] != null ? mm[0]: d[0] != null ? d[0] : null,
        tmp[1] != null ? tmp[1] : mm[1] != null ? mm[1] : d[1] != null ? d[1] : null
      ]
      dst.domain = result;
      if (result[0] != null && result[1] != null) {
        dst._progress |= checked.domain;
      }
    } else if (dst.scaleType & scaleClass.ordinal) {
      if (dst._expectType && !(dst._expectType & scaleClass.ordinal)) {
        throw new Error(`Incompatible type specified. 
        Expected scale type for "${dst.id}" to be ordinal`);
      } else {
        dst._expectType = null;
      }
      if (!dst.domain || (Array.isArray(dst.domain) && dst.length == 0)) {
        let d;
        //console.log(domain);
        if (typeof domain === "function") {
          d = domain();
        } else {
          d = domain;
        }
        if (Array.isArray(d) && d.length > 0) {
          dst.domain = [...d];
          dst._progress |= checked.domain;
        }
      }
    } else {
      // scaleType is not set yet, ex axis entered before data
      // expect future type
      const d = Array.isArray(domain) ? domain : [];
      const ds = d[0] != null ? d[0] : d[1] != null ? d[1] : null;
      const ms = min != null ? min : max != null ? max : null;
      const t = getDefaultScaleType(ds != null ? ds : ms);

      const pt = dst._expectType;
      console.log(pt);
      if (pt & scaleClass.continuous && t & scaleClass.continuous) {
        // fill domain if matched, otherwise reject
        const pd = dst.domain || [];
        // prettier-ignore
        dst.domain = [
          pd[0] != null ? pd[0] : min != null ? min : d[0] != null ? d[0] : null,
          pd[1] != null ? pd[1] : max != null ? max : d[1] != null ? d[1] : null,
        ]
      } else if (pt & scaleClass.ordinal && t & scaleClass.ordinal) {
        const pd = dst.domain || [];
        if (pd.length == 0) {
          dst.domain = [...d];
        }
      } else if (!pt) {
        // no prev type and, thus, no domain data
        dst._expectType = t;
        console.log("set new", t);
        if (t & scaleClass.continuous) {
          dst.domain = [
            min != null ? min : d[0] != null ? d[0] : null,
            max != null ? max : d[1] != null ? d[1] : null,
          ];
        } else if (t & scaleClass.ordinal) {
          dst.domain = [...d];
        }
      }
    }
  }

  if (dst._progress == checked.completed) return true;
  else return false;
}

export function finalizeScale(exportedScale) {
  if (!exportedScale) return null;

  const infos = Object.values(exportedScale);
  if (infos.length == 0) return null;

  //triage
  const axis = [];
  const plot = [];
  const data = [];

  infos.forEach((info) => {
    switch (info.source) {
      case "axis":
        axis.push(info);
        break;
      case "plot":
        plot.push(info);
        break;
      case "data":
        data.push(info);
        break;
      default:
        throw new Error("Unrecognized source of scale info.");
    }
  });

  const sorted = data.concat(plot, axis);

  const results = new Map();
  const getOrSet = (id) => {
    const r = results.get(id);
    if (r) return r;
    else {
      const n = {};
      results.set(id, n);
      return n;
    }
  };

  // merging from last to first, according to priority: axis > plot > data

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const current = getOrSet(sorted[i].id);
    const isComplete = mergeInfo(current, sorted[i]);
    if (isComplete) break;
  }

  return results;
}
