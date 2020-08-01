const EXPORT = "export";
const UNEXPORT = "unexport";
const COMMIT = "commit";

export const COMMIT_CHANNEL = "COMMIT_CHANNEL";

export const exportData = (channel, key, data) => ({
  type: channel + "." + EXPORT,
  key,
  data,
  _channel: channel,
});

export const unexportData = (channel, key) => ({
  type: channel + "." + UNEXPORT,
  key,
  _channel: channel,
});

export const commitChannel = (channel = null) => ({
  type: COMMIT_CHANNEL,
  _channel: channel,
});

// these are kind of incomplete action types, intended to be called with channel name
export const chEXPORT = (channel) => channel + "." + EXPORT;
export const chUNEXPORT = (channel) => channel + "." + UNEXPORT;
export const chCOMMIT = (channel) => channel + "." + COMMIT;
