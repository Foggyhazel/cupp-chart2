import React, { useState } from "react";
import covid from "./data/covid.json";
import { timeParse, timeFormat } from "d3-time-format";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";
import { Chart } from "../components/Chart";
import Grid from "../components/Grid";
import AreaPlot from "../components/AreaPlot";
import Axis from "../components/Axis";

// moved outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const cols = ["confirmed", "recovered", "deaths"];
const xa = (d) => parseDate(d.date);
const ta = [timeMonth];
const tay = [6];

export default function StackArea() {
  const tickFormat = timeFormat("%b");
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa} height={200}>
        <Grid xAxis="_x" yAxis="_y" />
        <AreaPlot y={cols} stack yAxis="_y" />
        <Axis
          id="_x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={ta}
          nice={false}
        />
        <Axis Y orient="left" nice={false} tickArguments={tay} />
      </Chart>
      {/*<Button title="Update" onPress={() => update({})} />*/}
    </View>
  );
}
