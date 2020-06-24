import commonPlotConfigure from "./commonPlotConfigure";
import { createSelector } from "reselect";
import _ from "lodash";
import { scaleType } from "../chartManager/scalefn";

const getXAxis = (_, props) =>
  props.X ? "_x" : props.xAxis ? props.xAxis : "_x";
const getPadding = (_, props) => props.padding;
const getPaddingInner = (_, props) => props.paddingInner;
const getPaddingOuter = (_, props) => props.paddingOuter;

export default function bandPlotConfigure() {
  const commonConfigure = commonPlotConfigure();

  return createSelector(
    [commonConfigure, getXAxis, getPadding, getPaddingInner, getPaddingOuter],
    (common, xAxis, padding, paddingInner, paddingOuter) => {
      const band = {
        exportData: {
          scale: {
            [xAxis]: {
              id: xAxis,
              source: "plot",
              scaleType: scaleType.band,
              option: {
                padding,
                paddingInner,
                paddingOuter,
              },
            },
          },
        },
      };

      return _.merge(common, band);
    }
  );
}
