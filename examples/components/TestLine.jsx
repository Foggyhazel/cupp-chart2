import React, { useState } from "react";
import covid from "../data/covid.json";
import { timeParse, timeFormat } from "d3-time-format";
import { timeMonth } from "d3-time";
import { View, Button } from "react-native";
import { Chart, Grid, LinePlot, Axis } from "../../src";

// moved outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const cols = ["confirmed", "recovered", "deaths"];
const xa = (d) => parseDate(d.date);
const ta = [timeMonth];
const tay = [6];
const tickFormat = timeFormat("%b");

export default function TestLine() {
  const [grid, setGrid] = useState(0);
  return (
    <View>
      <Chart data={mock} x={xa}>
        <Grid X={grid == 1 || grid == 3} Y={grid == 2 || grid == 3} />
        <LinePlot y={cols} />
        <Axis X orient="bottom" tickArguments={ta} tickFormat={tickFormat} />
        <Axis Y tickArguments={tay} />
      </Chart>
      <Button title="cycle Grid" onPress={() => setGrid((p) => (p + 1) % 4)} />
    </View>
  );
}
