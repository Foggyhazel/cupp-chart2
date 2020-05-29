import React, {
  useEffect,
  useContext,
  useCallback,
  useState,
  useRef,
} from "react";
import { createContext, useImperativeHandle } from "react";
import { withRef, RefManager, useRefMap } from "./refManager";
import { useChartContext } from "./chartContext";
import { scaleClass, makeScale } from "./scale";
import { min as d3Min, max as d3Max } from "d3-array";

const ScaleContext = createContext(null);
const ScaleUpdateContext = createContext();
const SMContext = createContext({});

/**
 * Internal component.
 *
 * Intended to use inside compose HOC only.
 * Do not use, because it has specific use cases.
 * May cause unexpected result.

 * @type {React.FunctionComponent<{scaleId: string, domain: Array, scaleType: number, sourceType:"data"|"axis" }>} _Internal_ExportScale
 */
export const _Internal_ExportScale = withRef(
  ({ scaleId, domain, min, max, scaleType, sourceType = "data" }, ref) => {
    // domain is an array [number, number] or () => [number, number]
    const update = useContext(SMContext);

    useImperativeHandle(
      ref,
      () => {
        update();
        console.log("change export ");
        return {
          getScaleInfo: () => {
            return {
              scaleId,
              domain: domain || [
                (domain && domain[0]) || min || null,
                (domain && domain[1]) || max || null,
              ],
              sourceType,
              scaleType: scaleType || null,
            };
          },
        };
      },
      [domain, min, max, scaleId, scaleType, sourceType, update]
    );
  }
);

/**
 * combine many scale info eg. domain, type exported by data plot or
 * axis into single d3 scale foreach scale id
 *
 * Current implementation is overriding
 * later info with non null property and giving priority to info
 * exported from axis
 * @param {*} scaleInfo scale info
 */
function finalizeScale(scaleInfo) {
  const axisInfo = [];
  const dataInfo = [];

  scaleInfo.forEach((si) =>
    si.sourceType === "data" ? dataInfo.push(si) : axisInfo.push(si)
  );

  let map = {};
  const override = ({ scaleId, domain, scaleType, sourceType }) => {
    if (!map[scaleId]) map[scaleId] = {};
    const s = map[scaleId];

    const _do = domain || [];

    if (scaleType) {
      s.scaleType = scaleType;
    }

    if (!s.domain) {
      s.domain = [..._do] || [];
    } else {
      if (scaleClass.continuous & s.scaleType) {
        // extend domain if came from data
        if (sourceType == "data") {
          // d3 min, max can handle null just fine
          s.domain[0] = d3Min([s.domain[0], _do[0]]) || null;
          s.domain[1] = d3Max([s.domain[1], _do[1]]) || null;
        } else {
          s.domain[0] = _do[0] != null ? _do[0] : s.domain[0];
          s.domain[1] = _do[1] != null ? _do[1] : s.domain[1];
        }
      } else if (scaleClass.ordinal & s.scaleType) {
        if (s.domain.length == 0) s.domain = [..._do] || [];
        console.warn("replacing ordinal domain. May cause unexpected result");
      } else {
        // no scale type. eg. waiting for type from data
        // not exist since info from data is read first.
        throw new Error("It actually exist!!!");
      }
    }
  };

  dataInfo.forEach((i) => override(i));
  axisInfo.forEach((i) => override(i));

  const scaleMap = {};
  Object.keys(map).forEach((k) => {
    scaleMap[k] = {
      scale: makeScale(map[k].scaleType, map[k].domain),
      scaleType: map[k].scaleType,
    };
  });

  return scaleMap;
}

/**
 * scale computation happens in 2 stage, first entire chart
 * sub plot is partially rendered up to data processing step, each produce
 * scale info, e.g. domain. All scale info is collected and combined into single scale
 * for each scale id which is later used for drawing plot in the second stage.
 *
 * This is done by some internal state flipping to avoid unnecessary render.
 *
 * Double data processing is cached by reselect.
 **/

function ScaleManagerContent({ children }) {
  const refMap = useRefMap();
  const updateMap = useContext(ScaleUpdateContext);
  const [, setU] = useState();
  const prevGetInfo = useRef({});

  // this is super ugly and I'm not sure why it works.
  // it even works under strict mode!
  const __root = useRef(false);

  __root.current = true;

  const update = useCallback(() => {
    __root.current = false;
    setU({});
  }, []);

  useEffect(() => {
    //console.log("root", __root.current);
    // skip effect due to update() call by children,
    // originated from re-render of scale manager root component
    if (__root.current) {
      const result = [];
      let changed = false;
      let sync = {};
      refMap.forEach(({ getScaleInfo }, k) => {
        if (getScaleInfo) {
          result.push(getScaleInfo());
          if (prevGetInfo.current[k] != getScaleInfo) changed = true;
          sync[k] = getScaleInfo;
        }
      });
      prevGetInfo.current = sync;
      if (changed) {
        console.log("re-eval scale", result);
        const resultMap = finalizeScale(result);
        updateMap(resultMap);
      } else {
        console.log("no scale changed");
      }
    }
  });

  //return children;
  return <SMContext.Provider value={update}>{children}</SMContext.Provider>;
}

/**
 * Read data from scale context.
 * For internal use only as it contains internal data
 * for to determining re-render.
 *
 * For general use of scale data, it is passed to
 * scale prop by default
 */
function _Internal_useScale() {
  const ctv = useContext(ScaleContext);
  const prev = useRef(null);

  const prevStage = prev.current != null ? prev.current : true;
  const currStage = ctv != null ? ctv._stage : true;

  //must be called inside useEffect so that it works with strict mode
  useEffect(() => {
    prev.current = currStage;
  });

  if (ctv != null) ctv._render = prevStage != currStage;
  return ctv;
}

function ScaleStore({ children }) {
  const [scaleMap, setScaleMap] = useState(null);
  const updateScaleMap = useCallback((newMap) => {
    console.log("set new map", newMap);
    setScaleMap((p) =>
      p == null
        ? { map: newMap, _stage: false }
        : { map: newMap, _stage: !p._stage }
    );
  }, []);

  return (
    <ScaleUpdateContext.Provider value={updateScaleMap}>
      <ScaleContext.Provider value={scaleMap}>{children}</ScaleContext.Provider>
    </ScaleUpdateContext.Provider>
  );
}

export function ScaleManager({ children }) {
  return (
    <RefManager>
      <ScaleStore>
        <ScaleManagerContent>{children}</ScaleManagerContent>
      </ScaleStore>
    </RefManager>
  );
}

//TODO: skip if other's scale change
/**
 * A function passed as second argument to React.memo.
 * Determine if plot need to be re-render by inspect __scale._render
 */
function doSkip(prevProps, nextProps) {
  if (nextProps.__scale != null && nextProps.__scale._render) return false;
  if (nextProps.__scale != null && !nextProps.__scale._render) return true;

  if (prevProps.__scale != nextProps.__scale) return false;

  return false;
}
/**
 * HOC that wrap any plot to handle scale info export
 * and prevent unnecessary  re-rendering.
 *
 * @typedef {{domain: [number, number]|function, sourceType:"axis"|"data"}} ExportScaleProps
 * @typedef {{data, exportScale: Object.<string, ExportScaleProps>}} PreComputeResult
 * @typedef {(data, props, ctx) => PreComputeResult} PreComputeFn
 * @typedef {() => PreComputeFn} Selector
 *
 * @param {PreComputeFn | Selector} config
 */
export const compose = (config) => (Plot) => {
  // memoized scale, auto bail out if scale==null
  const PlotWithScale = ({ scale, ...props }) => {
    if (scale) {
      console.log(
        "%c render ",
        "background: orange; color: black; border-radius: 4px",
        `<${Plot.name} ${props.id || ""}>`
      );
      return <Plot {...props} scale={scale} />;
    }
    return null;
  };

  const MemoizedPlot = React.memo(PlotWithScale, doSkip);

  const ComposedPlot = (innerProps) => {
    const ctx = useChartContext();
    const selectorRef = useRef(null);

    let exportScale, data;

    if (config) {
      let configObj;
      if (selectorRef.current != null) {
        configObj = selectorRef.current(ctx.data, innerProps, ctx);
      } else {
        const r = config(ctx.data, innerProps, ctx);
        if (typeof r === "function") {
          selectorRef.current = r;
          configObj = selectorRef.current(ctx.data, innerProps, ctx);
        } else {
          configObj = r;
        }
      }
      ({ exportScale, data } = configObj);
    }

    return (
      <React.Fragment>
        {exportScale &&
          Object.keys(exportScale)
            .filter((k) => !!k && k != "undefined")
            .map((k) => (
              <_Internal_ExportScale key={k} {...exportScale[k]} scaleId={k} />
            ))}
        <ForwardScale
          data={data}
          ctx={ctx}
          Elem={MemoizedPlot}
          innerProps={innerProps}
        />
      </React.Fragment>
    );
  };
  return ComposedPlot;
};

/**
 * The sole purpose of this component is to separate
 * useScale call from HOC composed plot to break the infinite loop
 * which otherwise will be made by update() call from
 * child ExportScale component and the HOC containing useScale.
 */
const ForwardScale = ({ data, ctx, Elem, innerProps }) => {
  const scale = _Internal_useScale();
  const getScale = useCallback(
    /** @param {"h"|"v"} orient */
    (id, orient) => {
      if (id == null) return null;

      const s = (scale && scale.map[id] && scale.map[id].scale) || null;
      if (s) {
        const _s = s.copy();
        const {
          margin: { left, right, bottom, top },
          width,
          height,
        } = ctx;
        if (orient === "h") _s.range([left, width - right]);
        if (orient === "v") _s.range([height - bottom, top]);

        _s.scaleType = scale.map[id].scaleType;
        return _s;
      }
      return null;
    },
    [ctx, scale]
  );
  //console.log("_hoc_useScale", scale);
  return (
    <Elem
      {...innerProps}
      scale={scale && getScale}
      data={data || ctx.data}
      __scale={scale}
    />
  );
};
