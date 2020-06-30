import React from "react";
import { connect } from "react-redux";

function makeMapStateToProps(injectObj, ctx) {
  return () => {
    const built = {};
    Object.keys(injectObj).forEach((k) => {
      if (typeof injectObj[k] === "function") {
        // selector factory
        built[k] = injectObj[k](ctx);
      } else {
        built[k] = () => injectObj[k];
      }
    });
    return (state, props) => {
      const r = {};

      Object.keys(built).forEach((k) => {
        r[k] = built[k](state, props);
      });

      return r;
    };
  };
}

function Connector({ Plot, _require, ...innerProps }) {
  let pass = true;
  _require.forEach((r) => {
    if (innerProps[r] == null) pass = false;
  });

  if (!pass) return null;

  return <Plot {...innerProps} />;
}

export function makeConnector(injectObj, ctx) {
  const msp = makeMapStateToProps(injectObj, ctx);
  return connect(msp)(Connector);
}
