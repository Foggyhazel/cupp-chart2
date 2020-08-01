import { useEffect } from "react";
import { connect } from "react-redux";
import { useScheduleCommit } from "./ChartManager";
import { exportData, unexportData } from "./action/exportData";
import useKey from "./useKey";

/**
 * export data to central store to be processed by reducer
 */
function ExportData({ channel, data, enabled = true, dispatch }) {
  const myKey = useKey();
  const scheduleCommit = useScheduleCommit();

  useEffect(() => {
    if (!enabled) return;

    dispatch(exportData(channel, myKey, data));
    scheduleCommit();
    return () => {
      dispatch(unexportData(channel, myKey));
      scheduleCommit();
    };
  }, [channel, data, dispatch, myKey, scheduleCommit, enabled]);

  return null;
}

export default connect()(ExportData);
