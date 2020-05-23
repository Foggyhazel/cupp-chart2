import React, { createContext, useRef, useCallback, useState } from "react";

export const RegistryContext = createContext({});

export default function QueryRegistry({ children }) {
  //warning: This is really against the way of react!!
  const store = useRef({ nextId: 0, queryMap: {} });
  const register = useCallback((query) => {
    const id = store.current.nextId;
    store.current.queryMap[id] = query;
    store.current.nextId += 1;
    return id;
  }, []);

  const deregister = useCallback((id) => {
    if (Object.prototype.hasOwnProperty.call(store.current.queryMap, id)) {
      // any performance impact ?
      delete store.current.queryMap[id];
      return true;
    }
    return false;
  }, []);

  const allQueries = useCallback(() => {
    return { ...store.current.queryMap };
  }, []);

  const [cvalue] = useState({ register, deregister, allQueries });

  return (
    <RegistryContext.Provider value={cvalue}>
      {children}
    </RegistryContext.Provider>
  );
}
