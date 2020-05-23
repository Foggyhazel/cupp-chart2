import React, { useState } from "react";
import TouchHandler from "./TouchHandler";
import MouseHandler from "./MouseHandler";
import { _defaultCursorInfo, CursorContext } from "./cursor";
import config from "../../../config";

export default function Inspect({ children, enable = true }) {
  const [cursor, setCursor] = useState(_defaultCursorInfo);
  const Handler = config.touch ? TouchHandler : MouseHandler;

  return (
    <Handler setCursor={setCursor}>
      <CursorContext.Provider value={cursor}>{children}</CursorContext.Provider>
    </Handler>
  );
}
