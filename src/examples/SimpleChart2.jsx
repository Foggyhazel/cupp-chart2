import React, { useState } from "react";
import covid from "./data/covid.json";
import Chart from "../components/chart/Chart";
import { timeParse, timeFormat } from "d3-time-format";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";
import AreaPlot from "../components/chart/AreaPlot";
import Grid from "../components/chart/Grid";

// moved outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const cols = ["confirmed", "recovered", "deaths"];
const xa = (d) => parseDate(d.date);
const ta = [timeMonth];

export default function SimpleChart2() {
  const tickFormat = timeFormat("%b");
  const [y, setY] = useState(7000);
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa}>
        <Grid xAxis="_x" yAxis="_y" />
        <AreaPlot y={cols} stack yAxis="_y" />
        <Axis
          id="_x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={ta}
          nice={false}
        />
        <Axis id="_y" orient="left" max={y} nice={false} />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
      <Button title="Inc. Y Max" onPress={() => setY((p) => p + 20)} />
    </View>
  );
}
