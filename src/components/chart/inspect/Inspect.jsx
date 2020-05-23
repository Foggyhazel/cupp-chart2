import React, { useState, useCallback } from "react";
import TouchHandler from "./TouchHandler";
import MouseHandler from "./MouseHandler";
import { _defaultCursorInfo, CursorContext } from "./cursor";
import config from "../../../config";

export default function Inspect({ children, enable = true }) {
  const [cursor, setCursor] = useState(_defaultCursorInfo);
  const Handler = config.touch ? TouchHandler : MouseHandler;

  const doNothing = useCallback(() => {}, []);

  return (
    <Handler setCursor={enable ? setCursor : doNothing}>
      <CursorContext.Provider value={cursor}>{children}</CursorContext.Provider>
    </Handler>
  );
}
