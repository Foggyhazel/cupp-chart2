import React, { useState } from "react";
import Chart from "../components/chart/Chart";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import AreaPlot from "../components/chart/AreaPlot";
import Grid from "../components/chart/Grid";
import randData from "./data/rand";

// moved outside to avoid re-render
const mock = randData;
const cols = ["hottest", "hot", "warm"];
const stack = {
  pos: ["hottest", "hot", "warm"],
  neg: ["freeze", "cold", "cool"],
};
const xa = "month";

export default function TestStack() {
  const [, setY] = useState(7000);
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa} height={200}>
        <Grid X Y />
        <AreaPlot y={cols} stack={stack} />
        <Axis X orient="bottom" />
        <Axis Y nice={false} />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
      <Button title="Inc. Y Max" onPress={() => setY((p) => p + 20)} />
    </View>
  );
}
