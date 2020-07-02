import scale from "../scale";
import { exportData, unexportData } from "../../action/exportData";
import { commitActions } from "../../action/channelAction";
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

describe("Scale reducer", () => {
  it("Return initial state", () => {
    expect(scale(undefined, {})).toEqual(initialState);
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
        },
        exportData("scale", 1, {
          id: "x",
          scaleType: scaleType.linear,
          domain: [0, 100],
        })
      )
    ).toEqual({
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
    });
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
        },
        unexportData("scale", 0)
      )
    ).toEqual({
      exportedScale: {
        1: {
          id: "x",
          scaleType: scaleType.linear,
          domain: [0, 100],
        },
      },
      map: new Map(),
    });
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
      },
      commitActions("scale", [
        exportData("scale", 0, {
          id: "x",
          scaleType: scaleType.linear,
          source: "data",
          domain: [0, 100],
        }),
        exportData("scale", 1, {
          id: "x",
          source: "axis",
          max: 50,
        }),
      ])
    );

    removeUnusedProperty(nextState);

    expect(nextState).toEqual({
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
    });
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
    const finalScale = scale(later, commitActions("scale", [newExportAction]));
    const finalX = finalScale.map.get("x");
    expect(finalX).toBe(startX);
    expect(finalScale.map.get("y").domain).toStrictEqual([100, 200]);
  });
});
