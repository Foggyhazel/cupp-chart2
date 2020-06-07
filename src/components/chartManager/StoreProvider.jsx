import React, { useState } from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import scale from "./reducers/scale";
import { createChannelMiddleware } from "./channel";

const rootReducer = combineReducers({ scale });

export default function StoreProvider({ children }) {
  const [store] = useState(() =>
    createStore(rootReducer, applyMiddleware(createChannelMiddleware()))
  );
  return <Provider store={store}>{children}</Provider>;
}
