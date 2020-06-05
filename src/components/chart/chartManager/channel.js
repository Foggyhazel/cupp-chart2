import { commitActions } from "./action/channelAction";
import { COMMIT_CHANNEL } from "./action/channelAction";

export function chAction(channel, action) {
  action._channel = channel;
  action.type = channel + "." + action.type;
  return action;
}

export function chType(channel, actionType) {
  return channel + "." + actionType;
}

export function createChannelMiddleware() {
  const channel = {};
  const commitChannel = (next, ch) => {
    if (channel[ch] && channel[ch].length > 0) {
      const results = [];
      channel[ch].forEach((a) => {
        const r = next(a);
        results.push(r);
      });
      // commit action
      const last = next(commitActions(ch, channel[ch]));
      results.push(last);
      // flush
      delete channel[ch];
      return results;
    }
  };
  return () => (next) => (action) => {
    if (action.type === COMMIT_CHANNEL) {
      if (action._channel) {
        return commitChannel(next, action._channel);
      } else {
        const result = [];
        Object.keys(channel).forEach((k) => {
          const r = commitChannel(next, k);
          result.push(...r);
        });
        return result;
      }
    }

    if (!action._channel) {
      return next(action);
    }

    // add to buffer
    const ch = action._channel;
    if (!channel[ch]) channel[ch] = [];
    channel[ch].push(action);
    return null;
  };
}
