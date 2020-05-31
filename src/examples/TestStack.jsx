import React, { useState } from "react";
import Chart from "../components/chart/Chart";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import AreaPlot from "../components/chart/AreaPlot";
import LinePlot from "../components/chart/LinePlot";
import Grid from "../components/chart/Grid";
import randData from "./data/rand";
import { curveMonotoneX } from "d3-shape";
import ScatterPlot from "../components/chart/ScatterPlot";
import Marker from "../components/chart/Marker";

// moved outside to avoid re-render
const mock = randData;
const cols = ["hottest", "hot", "warm"];
const stack = {
  pos: ["hottest", "hot", (d) => d.warm],
  neg: ["freeze", "cold", "cool"],
};
const xa = "month";
const ta = [5];

export default function TestStack() {
  const [, update] = useState({});

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
      {/*<Button title="Update" onPress={() => update({})} />*/}
    </View>
  );
}
