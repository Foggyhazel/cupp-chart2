import { useContext, createContext } from "react";
import { parseYAccessor } from "./helper";

export const ChartContext = createContext({});

export const useChartContext = ({ y, xAxis, yAxis }) => {
  const ctv = useContext(ChartContext);
  const scale = ctv.scale;

  if (yAxis == null || !scale[yAxis])
    throw new Error(`scale "${yAxis}" not found`);
  if (xAxis != null && !scale[xAxis])
    throw new Error("x scale ${xAxis} not found");

  const sx = xAxis == null ? scale._x : scale[xAxis];
  const sy = scale[yAxis];

  const ya = parseYAccessor(y);

  return {
    ...ctv,
    sx,
    sy,
    ya,
  };
};

export const useScale = (id) => {
  const ctv = useContext(ChartContext);
  return [ctv.scale[id] || null, ctv];
};
