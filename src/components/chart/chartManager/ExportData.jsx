import { useEffect } from "react";
import { connect } from "react-redux";
import { useScheduleCommit } from "./ChartManager";
import useKey from "../manager/useKey";
import { exportData, unexportData } from "./action/exportData";

/**
 * export data to central store to be processed by reducer
 */
const ExportData = connect()(({ channel, data, enabled = true, dispatch }) => {
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
});

export default ExportData;
