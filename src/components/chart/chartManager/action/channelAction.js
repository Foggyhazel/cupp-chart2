import { commitActionType, chType } from "../channel/utils";

export const COMMIT_CHANNEL = "COMMIT_CHANNEL";

export const commitChannel = (channel = null) => ({
  type: COMMIT_CHANNEL,
  _channel: channel,
});

export const commitActions = (channel, actions) => ({
  type: commitActionType(channel),
  actions: actions,
});

const COMMIT = "commit";

// these are kind of incomplete action types, intended to be called with channel name
export const chCOMMIT = (channel) => chType(channel, COMMIT);
