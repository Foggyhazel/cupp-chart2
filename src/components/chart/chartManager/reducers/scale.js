import { chEXPORT, chUNEXPORT } from "../action/exportData";
import { chCOMMIT } from "../action/channelAction";

const CH = "scale";

const SCALE_EXPORT = chEXPORT(CH);
const SCALE_UNEXPORT = chUNEXPORT(CH);
const SCALE_COMMIT = chCOMMIT(CH);

function scale(state = { getScales: {}, map: {} }, action) {
  switch (action.type) {
    case SCALE_EXPORT:
      console.log("EXPORT");
      return {
        ...state,
        getScales: { ...state.getScales, [action.key]: action.data },
      };
    case SCALE_UNEXPORT: {
      // eslint-disable-next-line no-unused-vars
      const { [action.key]: omit, ...rest } = state.getScales;
      return {
        ...state,
        getScales: rest,
      };
    }
    case SCALE_COMMIT:
      console.log("COMMIT", state.getScales);
      return state;
    default:
      return state;
  }
}

export default scale;
