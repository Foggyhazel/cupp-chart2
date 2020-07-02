import { COMMIT_CHANNEL, chCOMMIT } from "./action/exportData";
import { batch } from "react-redux";

/**
 * create a middleware that detect any action with _channel property
 * to collect all channels that are changed between commit
 */
export function createChannelMiddleware() {
  const changedChannel = new Set();

  return () => (next) => (action) => {
    // unrelated
    if (!Object.prototype.hasOwnProperty.call(action, "_channel")) {
      return next(action);
    }

    const channel = action._channel;

    // commit action
    if (action.type === COMMIT_CHANNEL) {
      if (channel) {
        // commit the specified channel
        next({
          type: chCOMMIT(channel),
        });
        changedChannel.delete(channel);
        return [channel];
      } else {
        // commit all changed channel
        batch(() => {
          changedChannel.forEach((ch) => {
            next({
              type: chCOMMIT(ch),
            });
          });
        });
        const r = [...changedChannel];
        changedChannel.clear();
        return r;
      }
    }

    // data passing through channel: pass it but record which channel changed
    changedChannel.add(channel);
    return next(action);
  };
}
