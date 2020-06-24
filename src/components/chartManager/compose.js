import React, { useRef } from "react";
import { useChartContext } from "./chartContext";
import ExportData from "./ExportData";

/**
 * compose plot
 */
const compose = (config) => (Plot) => {
  const ComposedPlot = (ownProps) => {
    const ctx = useChartContext();
    const selectorRef = useRef(null);

    let data, exportData, setProps;
    let Connector;

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
      ({ data, exportData, setProps } = configObj);
      Connector = configObj.connector;
    }

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
          <Connector Plot={Plot} {...ownProps} {...setProps} data={data} />
        ) : (
          <Plot {...ownProps} {...setProps} data={data} />
        )}
      </React.Fragment>
    );
  };

  return ComposedPlot;
};

export default compose;
