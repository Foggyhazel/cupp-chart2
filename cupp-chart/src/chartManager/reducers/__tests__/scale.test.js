import scale from "../scale";
import { exportData, unexportData, chCOMMIT } from "../../action/exportData";
import _ from "lodash";
import { scaleType } from "../../scalefn";

const initialState = {
  exportedScale: {},
  map: new Map(),
};

const removeUnusedProperty = (nextState) => {
  nextState.map.forEach((v, k) =>
    nextState.map.set(k, _.omit(v, ["_expectType", "_progress", "scale"]))
  );
};

const omit = (state) => _.omit(state, "changed");

describe("Scale reducer", () => {
  it("Return initial state", () => {
    expect(omit(scale(undefined, {}))).toEqual(initialState);
  });

  it("Handle export scale action", () => {
    expect(
      scale(
        {
          exportedScale: {
            0: {
              id: "x",
              scaleType: scaleType.time,
            },
          },
          map: new Map(),
          changed: [],
        },
        exportData("scale", 1, {
          id: "x",
          scaleType: scaleType.linear,
          domain: [0, 100],
        })
      )
    ).toEqual(
      expect.objectContaining({
        exportedScale: {
          0: {
            id: "x",
            scaleType: scaleType.time,
          },
          1: {
            id: "x",
            scaleType: scaleType.linear,
            domain: [0, 100],
          },
        },
        map: new Map(),
      })
    );
  });

  it("Handle unexport scale action", () => {
    expect(
      scale(
        {
          exportedScale: {
            0: {
              id: "x",
              scaleType: scaleType.time,
            },
            1: {
              id: "x",
              scaleType: scaleType.linear,
              domain: [0, 100],
            },
          },
          map: new Map(),
          changed: [],
        },
        unexportData("scale", 0)
      )
    ).toEqual(
      expect.objectContaining({
        exportedScale: {
          1: {
            id: "x",
            scaleType: scaleType.linear,
            domain: [0, 100],
          },
        },
        map: new Map(),
      })
    );
  });

  it("Handle commit action, correctly finalize scale", () => {
    const nextState = scale(
      {
        exportedScale: {
          0: {
            id: "x",
            scaleType: scaleType.linear,
            source: "data",
            domain: [0, 100],
          },
          1: {
            id: "x",
            source: "axis",
            max: 50,
          },
        },
        map: new Map(),
        changed: [],
      },
      { type: chCOMMIT("scale") }
    );

    removeUnusedProperty(nextState);

    expect(nextState).toEqual(
      expect.objectContaining({
        exportedScale: {
          0: {
            id: "x",
            scaleType: scaleType.linear,
            source: "data",
            domain: [0, 100],
          },
          1: {
            id: "x",
            source: "axis",
            max: 50,
          },
        },
        map: new Map([
          [
            "x",
            {
              id: "x",
              scaleType: scaleType.linear,
              domain: [0, 50],
              option: {},
            },
          ],
        ]),
      })
    );
  });

  it("Does not change map.scale that is outside of commit", () => {
    const startState = scale(
      {
        exportedScale: {
          0: {
            id: "x",
            scaleType: scaleType.linear,
            source: "data",
            domain: [0, 100],
          },
          1: {
            id: "x",
            source: "axis",
            max: 50,
          },
          2: {
            id: "y",
            source: "axis",
            domain: [99, 199],
            scaleType: scaleType.linear,
          },
        },
        map: new Map([
          [
            "x",
            {
              domain: [0, 50],
              option: {},
              scaleType: 1,
            },
          ],
          [
            "y",
            {
              domain: [99, 199],
              option: {},
              scaleType: 1,
            },
          ],
        ]),
        changed: [],
      },
      {}
    );

    const startX = startState.map.get("x");

    const newExportAction = exportData("scale", 3, {
      id: "y",
      domain: [100, 200],
      source: "axis",
    });

    const later = scale(startState, newExportAction);
    const finalScale = scale(later, { type: chCOMMIT("scale") });
    const finalX = finalScale.map.get("x");
    expect(finalX).toBe(startX);
    expect(finalScale.map.get("y").domain).toStrictEqual([100, 200]);
  });
});
