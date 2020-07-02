import React, { useRef } from "react";
import { useChartContext } from "./chartContext";
import ExportData from "./ExportData";
import makeConnector from "./makeConnector";

/**
 * compose plot
 */
const compose = (config) => (Plot) => {
  const ComposedPlot = (ownProps) => {
    const ctx = useChartContext();
    const selectorRef = useRef(null);

    let data, exportData, setProps, inject, connector;
    const connectorRef = useRef(null);

    if (config) {
      let configObj;
      if (selectorRef.current != null) {
        configObj = selectorRef.current(ctx.data, ownProps, ctx);
      } else {
        const r = config(ctx.data, ownProps, ctx);
        if (typeof r === "function") {
          selectorRef.current = r;
          configObj = selectorRef.current(ctx.data, ownProps, ctx);
        } else {
          configObj = r;
        }
      }
      ({ data, exportData, setProps, inject, connector } = configObj);

      // connector is intended to be made only once
      // so that memoization can do the work.
      if (connector && connectorRef.current == null) {
        connectorRef.current = connector;
      } else if (inject && connectorRef.current == null) {
        connectorRef.current = makeConnector(inject());
      }
    }

    const Connector = connectorRef.current;

    return (
      <React.Fragment>
        {exportData &&
          Object.keys(exportData).map((channel) => {
            let data = exportData[channel];
            if (typeof data === "object" && !Array.isArray(data)) {
              data = Object.values(data);
            }
            return data.map((d, i) => (
              <ExportData key={i} channel={channel} data={d} />
            ));
          })}
        {Connector ? (
          <Connector
            Plot={Plot}
            {...ownProps}
            {...setProps}
            data={data}
            _ctx={ctx}
          />
        ) : (
          <Plot {...ownProps} {...setProps} data={data} />
        )}
      </React.Fragment>
    );
  };

  return ComposedPlot;
};

export default compose;
