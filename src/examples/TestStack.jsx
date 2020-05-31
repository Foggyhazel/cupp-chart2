import React, { useState } from "react";
import Chart from "../components/chart/Chart";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import AreaPlot from "../components/chart/AreaPlot";
import LinePlot from "../components/chart/LinePlot";
import Grid from "../components/chart/Grid";
import randData from "./data/rand";
import { curveMonotoneX } from "d3-shape";

// moved outside to avoid re-render
const mock = randData;
const cols = ["hottest", "hot", "warm"];
const stack = {
  pos: ["hottest", "hot", (d) => d.warm],
  neg: ["freeze", "cold", "cool"],
};
const xa = "x";

export default function TestStack() {
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa} height={200}>
        <Grid X />
        <AreaPlot y={cols} stack={stack} />
        <LinePlot y={cols} curve={curveMonotoneX} />
        <Axis X orient="bottom" />
        <Axis Y min={-3} max={3} />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
    </View>
  );
}
