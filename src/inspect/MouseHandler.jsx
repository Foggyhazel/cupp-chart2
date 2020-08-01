import React, { useMemo, useState } from "react";
import { getCoord } from "./getCoord";
import { HandlerContext } from "./handler";

export default function MouseHandler({ children, setCursor }) {
  const [ref, setRef] = useState(null);
  const handlers = useMemo(() => {
    if (ref == null) return { ref: setRef };
    return {
      ref: setRef,
      onMouseEnter(e) {
        const [x, y] = getCoord(ref, e);
        setCursor({
          x,
          y,
          active: true
        });
      },
      onMouseMove(e) {
        const [x, y] = getCoord(ref, e);
        setCursor({
          x,
          y,
          active: true
        });
      },
      onMouseLeave(e) {
        const [x, y] = getCoord(ref, e);
        setCursor({
          x,
          y,
          active: false
        });
      }
    };
  }, [ref, setCursor]);

  return (
    <HandlerContext.Provider value={handlers}>
      {children}
    </HandlerContext.Provider>
  );
}
