import React, { useState } from "react";
import covid from "./data/covid.json";
import Chart from "../components/chart/Chart";
import { timeParse, timeFormat } from "d3-time-format";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";
import AreaPlot from "../components/chart/AreaPlot";
import Grid from "../components/chart/Grid";
import { stackOffsetExpand } from "d3-shape";

// moved outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const cols = ["confirmed", "recovered", "deaths"];
const xa = (d) => parseDate(d.date);
const ta = [timeMonth];

export default function SimpleChart2() {
  const tickFormat = timeFormat("%b");
  const [y, setY] = useState(100);
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa}>
        <Grid xAxis="_x" yAxis="_y" />
        <AreaPlot y={cols} stack stackOffset={stackOffsetExpand} />
        <Axis
          id="_x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={ta}
          nice={false}
        />
        <Axis id="_y" orient="left" />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
    </View>
  );
}
