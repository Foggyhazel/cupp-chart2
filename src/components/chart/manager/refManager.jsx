import React, { useState, useCallback, forwardRef, useContext } from "react";
import { createContext, useRef } from "react";
import MultiRef from "react-multi-ref";
import useKey from "./useKey";

export const RefContext = createContext();

export function RefManager({ children }) {
  const multiRef = useRef(new MultiRef());
  const getRef = useCallback((key) => {
    return multiRef.current.ref(key);
  }, []);
  const [ctv] = useState({
    getRef,
    refMap: multiRef.current.map,
  });

  return <RefContext.Provider value={ctv}>{children}</RefContext.Provider>;
}

export function useRefMap() {
  const { refMap } = useContext(RefContext);
  return refMap;
}

export function withRef(fnComponent) {
  const CompWithRef = forwardRef(fnComponent);
  const WithRef = (props) => {
    const key = useKey();
    const { getRef } = useContext(RefContext);
    // getRef seem to return different ref after fnComponent state change
    // eventhough the key did not change
    // so I put it in another ref
    const ref = useRef(getRef(key));
    return <CompWithRef ref={ref.current} {...props} />;
  };
  return WithRef;
}
