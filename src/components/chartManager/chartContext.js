import { createContext, useContext } from "react";

const ChartContext = createContext();

export const ChartContextProvider = ChartContext.Provider;

export const useChartContext = () => {
  return useContext(ChartContext);
};
