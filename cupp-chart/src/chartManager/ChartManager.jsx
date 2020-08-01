import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { connect } from "react-redux";
import StoreProvider from "./StoreProvider";
import { commitChannel } from "./action/exportData";

const CommitContext = createContext(null);
export const useScheduleCommit = () => useContext(CommitContext);

const CommitProvider = connect()(({ children, dispatch }) => {
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

const ChartManager = ({ children }) => {
  return (
    <StoreProvider>
      <CommitProvider>{children}</CommitProvider>
    </StoreProvider>
  );
};

export default ChartManager;
