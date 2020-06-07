import React, { useMemo } from "react";
import { HandlerContext } from "./handler";

export default function TouchHandler({ children, setCursor }) {
  const handlers = useMemo(() => {
    return {
      onTouchStart(e) {
        setCursor({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
          active: true,
        });
      },
      onTouchMove(e) {
        setCursor({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
          active: true,
        });
      },
      onTouchEnd(e) {
        setCursor({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
          active: false,
        });
      },
    };
  }, [setCursor]);

  return (
    <HandlerContext.Provider value={handlers}>
      {children}
    </HandlerContext.Provider>
  );
}
