import { createContext, useContext } from "react";

export const _defaultCursorInfo = { active: false, x: 0, y: 0 };

export const CursorContext = createContext(_defaultCursorInfo);

export function useCursor() {
  return useContext(CursorContext);
}
