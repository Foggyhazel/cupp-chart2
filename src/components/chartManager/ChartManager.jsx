import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { connect } from "react-redux";
import { commitChannel } from "./action/channelAction";

const CommitContext = createContext(null);
export const useScheduleCommit = () => useContext(CommitContext);

const ChartManager = connect()(({ children, dispatch }) => {
  const [, forceUpdate] = useState({});

  const scheduleCommit = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    dispatch(commitChannel());
  });
  return (
    <CommitContext.Provider value={scheduleCommit}>
      {children}
    </CommitContext.Provider>
  );
});

export default ChartManager;
