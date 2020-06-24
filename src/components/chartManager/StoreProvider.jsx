import React, { useState } from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import scale from "./reducers/scale";
import { createChannelMiddleware } from "./channel";

const rootReducer = combineReducers({ scale });
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function StoreProvider({ children }) {
  const [store] = useState(() =>
    //createStore(rootReducer, applyMiddleware(createChannelMiddleware()))
    createStore(
      rootReducer,
      /* preloadedState, */ composeEnhancers(
        applyMiddleware(createChannelMiddleware())
      )
    )
  );
  return <Provider store={store}>{children}</Provider>;
}
