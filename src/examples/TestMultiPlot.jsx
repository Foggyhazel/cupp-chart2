import React, { useState } from "react";
import { View } from "react-native";

import randData from "./data/rand";
import { curveMonotoneX } from "d3-shape";
import Chart from "../components/Chart";
import Grid from "../components/Grid";
import AreaPlot from "../components/AreaPlot";
import LinePlot from "../components/LinePlot";
import Marker from "../components/Marker";
import ScatterPlot from "../components/ScatterPlot";
import Axis from "../components/Axis";

// moved outside to avoid re-render
const mock = randData;
const cols = ["hottest", "hot", "warm"];
const stack = {
  pos: ["hottest", "hot", (d) => d.warm],
  neg: ["freeze", "cold", "cool"],
};
const xa = "month";
const ta = [5];

export default function TestMultiPlot() {
  return (
    <View>
      <Chart data={mock} x={xa} height={250}>
        <Grid X />
        <AreaPlot y={cols} stack={stack} curve={curveMonotoneX} />
        <LinePlot y={cols} curve={curveMonotoneX} yAxis="y2" />
        <Marker x="Mar" y={2.8} dot={2} line="y" />
        <ScatterPlot y={cols} yAxis="y2" />
        <Axis X orient="bottom" nice={false} />
        <Axis Y min={-3.5} max={3.5} tickArguments={ta} tickSizeOuter={0} />
        <Axis id="y2" orient="right" max={3} />
      </Chart>
    </View>
  );
}
