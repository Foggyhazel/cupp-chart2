import { finalizeScale } from "../scale";
import { scaleType } from "../../../manager/scale";

describe("finalizeScale function", () => {
  test("Given null or undefined -> return null.", () => {
    expect(finalizeScale()).toBeNull();
  });

  test("Given empty object -> return null", () => {
    expect(finalizeScale({})).toBeNull();
  });
  describe("How it compute scaleType", () => {
    // test for scaleType override
    const t_linear_data = {
      id: "x",
      scaleType: scaleType.linear,
      source: "data",
    };
    const t_log_data = { id: "x", scaleType: scaleType.log, source: "data" };
    const t_log_axis = { id: "x", scaleType: scaleType.log, source: "axis" };
    const t_time_axis = { id: "x", scaleType: scaleType.time, source: "axis" };
    const t_linear_other = {
      id: "x",
      scaleType: scaleType.linear,
      source: "other",
    };
    const t_linear_undef = { id: "x", scaleType: scaleType.linear };
    const t_band_plot = { id: "x", scaleType: scaleType.band, source: "plot" };

    test("Given invalid source or undefined -> throw error", () => {
      expect(() => finalizeScale([t_linear_data, t_linear_undef])).toThrow();
      expect(() => finalizeScale([t_linear_data, t_linear_other])).toThrow();
    });

    test("Scale type from axis override from data and plot", () => {
      expect(
        finalizeScale([t_log_axis, t_linear_data, t_band_plot]).get("x")
      ).toMatchObject({ scaleType: scaleType.log });
    });

    test("Latest take priority", () => {
      expect(
        finalizeScale([t_log_axis, t_time_axis, t_linear_data]).get("x")
      ).toMatchObject({ scaleType: scaleType.time });
    });

    test("Latest data source take priority", () => {
      expect(
        finalizeScale([t_linear_data, t_log_data]).get("x")
      ).toMatchObject({ scaleType: scaleType.log });
    });

    test("Plot take over data", () => {
      expect(
        finalizeScale([t_band_plot, t_linear_data]).get("x")
      ).toMatchObject({ scaleType: scaleType.band });
    });
  });

  describe("How it compute domain", () => {
    const t_data_fnDomainHalfNull = {
      id: "x",
      domain: () => [null, 9],
      source: "data",
      scaleType: scaleType.linear,
    };

    test("Given domain as a function, correctly call domain callback", () => {
      const d = jest.fn(() => [0, 10]);
      const t_data_fnDomain = {
        id: "x",
        domain: d,
        source: "data",
        scaleType: scaleType.linear,
      };
      expect(finalizeScale([t_data_fnDomain]).get("x")).toMatchObject({
        domain: [0, 10],
      });
      expect(d.mock.calls.length).toBe(1);
    });

    test("Latest domain override ", () => {
      const d = jest.fn(() => [0, 10]);
      const t_data_fnDomain = {
        id: "x",
        domain: d,
        source: "data",
        scaleType: scaleType.linear,
      };
      expect(
        finalizeScale([t_data_fnDomainHalfNull, t_data_fnDomain]).get("x")
      ).toMatchObject({ domain: [0, 10] });
    });

    test("Null domain elem cannot override ", () => {
      const d = jest.fn(() => [0, 10]);
      const t_data_fnDomain = {
        id: "x",
        domain: d,
        source: "data",
        scaleType: scaleType.linear,
      };
      expect(
        finalizeScale([t_data_fnDomain, t_data_fnDomainHalfNull]).get("x")
      ).toMatchObject({ domain: [0, 9] });
    });

    test("Once latest domain is complete, prior domain callback is not called", () => {
      const d = jest.fn(() => [0, 10]);
      const d2 = jest.fn(() => [100, 200]);
      const t_data_fnDomain = {
        id: "x",
        domain: d,
        source: "data",
        scaleType: scaleType.linear,
      };
      const t_data_fnDomain2 = {
        id: "x",
        domain: d2,
        source: "data",
        scaleType: scaleType.linear,
      };
      expect(
        finalizeScale([t_data_fnDomain, t_data_fnDomain2]).get("x")
      ).toMatchObject({ domain: [100, 200] });
      expect(d2.mock.calls.length).toBe(1);
      expect(d.mock.calls.length).toBe(0);
    });

    // test ordinal domain
    test("Ordinal domain correctly override, and called", () => {
      const i1 = {
        id: "x",
        source: "axis",
        scaleType: scaleType.point,
        domain: ["a", "b"],
      };
      const i2 = {
        id: "x",
        source: "axis",
        scaleType: scaleType.point,
        domain: ["1x", "2x", "3x"],
      };
      expect(finalizeScale([i1, i2]).get("x")).toMatchObject({
        domain: ["1x", "2x", "3x"],
      });
    });

    test("Ordinal scale correctly call and null domain is override", () => {
      const inull = { id: "x", source: "axis", scaleType: scaleType.band };
      const d3 = jest.fn(() => ["1f", "2f", "3f"]);
      const i3 = {
        id: "x",
        source: "data",
        scaleType: scaleType.point,
        domain: d3,
      };
      const d4 = jest.fn(() => ["ax", "bx"]);
      const i4 = {
        id: "x",
        source: "data",
        scaleType: scaleType.point,
        domain: d4,
      };
      expect(finalizeScale([i4, i3, inull]).get("x")).toMatchObject({
        domain: ["1f", "2f", "3f"],
      });
      expect(d3.mock.calls.length).toBe(1);
      expect(d4.mock.calls.length).toBe(0);
    });

    describe("Override with unknown scaleType", () => {
      const a1 = { id: "x", domain: ["a", "b", "c"], source: "axis" };
      const a2 = { id: "x", domain: [10, 20], source: "axis" };
      const a3 = { id: "x", domain: [9, null], source: "axis" };

      const d1 = {
        id: "x",
        domain: ["a", "b", "c", "d"],
        scaleType: scaleType.point,
        source: "data",
      };
      const d2 = {
        id: "x",
        domain: [1, 5],
        scaleType: scaleType.linear,
        source: "data",
      };

      test("Null cannot override", () => {
        expect(finalizeScale([a2, a3]).get("x")).toMatchObject({
          domain: [9, 20],
        });
      });

      test("axis(cont) -> axis(ord)", () => {
        expect(finalizeScale([a1, a2]).get("x")).toMatchObject({
          domain: [10, 20],
        });
      });
      test("axis(ord) -> axis(cont)", () => {
        expect(finalizeScale([a2, a1]).get("x")).toMatchObject({
          domain: ["a", "b", "c"],
        });
      });

      test("axis(ord) -> data(ord)", () => {
        expect(finalizeScale([d1, a1]).get("x")).toMatchObject({
          domain: ["a", "b", "c"],
        });
      });

      test("axis(cont) -> data(cont)", () => {
        expect(finalizeScale([d2, a2]).get("x")).toMatchObject({
          domain: [10, 20],
        });
      });

      test("axis(cont) -> data(ord): throw error", () => {
        expect(() => finalizeScale([d1, a2])).toThrow();
      });

      test("axis(ord) -> data(cont): throw error", () => {
        expect(() => finalizeScale([d2, a1])).toThrow();
      });
    });
  });
});
