import { createSelector } from "reselect";
import makeScaleFactory from "./factory/makeScaleFactory";

export const getID = (_, props) => (props.X ? "_x" : props.Y ? "_y" : props.id);
const getDomain = (_, props) => props.domain;
const getMin = (_, props) => props.min;
const getMax = (_, props) => props.max;
const getNice = (_, props) => (props.nice != null ? props.nice : true);
const getTickValues = (_, props) => props.tickValues;
const getTickArguments = (_, props) => props.tickArguments;
const getScaleType = (_, props) => props.scaleType;

export default function axisConfigure() {
  return createSelector(
    [
      getID,
      getDomain,
      getMin,
      getMax,
      getNice,
      getTickValues,
      getTickArguments,
      getScaleType,
    ],
    (id, domain, min, max, nice, tickValues, tickArguments, scaleType) => ({
      exportData: {
        scale: {
          [id]: {
            id,
            domain,
            min,
            max,
            source: "axis",
            scaleType,
            option: {
              nice,
              tickValues,
              tickArguments,
            },
          },
        },
      },
      setProps: {
        id,
      },
      inject: () => ({
        scale: makeScaleFactory([(props) => props.id]),
      }),
    })
  );
}
