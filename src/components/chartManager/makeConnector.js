import React from "react";
import { connect } from "react-redux";

const makeConnector = (factoryDict) => {
  const selectorDict = {};
  const keys = [];
  for (const [key, factory] of Object.entries(factoryDict)) {
    if (!key) continue;

    if (typeof factory === "function") {
      selectorDict[key] = factory();
    } else {
      selectorDict[key] = () => factory;
    }
    keys.push(key);
  }

  const msp = () => (state, props) => {
    const ctx = props._ctx;
    const resultProps = {};
    keys.forEach((k) => {
      resultProps[k] = selectorDict[k](state, props, ctx);
    });
    return resultProps;
  };

  const Connector = connect(msp)(({ Plot, ...props }) => {
    let pass = true;
    keys.forEach((k) => {
      if (props[k] == null) pass = false;
    });

    return pass ? <Plot {...props} /> : null;
  });

  return Connector;
};

export default makeConnector;
