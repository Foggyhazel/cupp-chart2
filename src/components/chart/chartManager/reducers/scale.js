import { chEXPORT, chUNEXPORT } from "../action/exportData";
import { chCOMMIT } from "../action/channelAction";

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

function finalizeScale(exportedScale) {
  return {};
}
