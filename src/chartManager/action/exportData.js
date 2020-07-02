import { chAction, chType } from "./channelAction";

const EXPORT = "export";
const UNEXPORT = "unexport";

export const exportData = (channel, key, data) =>
  chAction(channel, {
    type: EXPORT,
    key: key,
    data: data,
  });

export const unexportData = (channel, key) =>
  chAction(channel, {
    type: UNEXPORT,
    key: key,
  });

// these are kind of incomplete action types, intended to be called with channel name
export const chEXPORT = (channel) => chType(channel, EXPORT);
export const chUNEXPORT = (channel) => chType(channel, UNEXPORT);
