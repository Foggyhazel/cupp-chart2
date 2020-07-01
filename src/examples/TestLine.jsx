import React from "react";
import covid from "./data/covid.json";
import { timeParse, timeFormat } from "d3-time-format";
import { timeMonth } from "d3-time";
import Chart from "../components/Chart";

import LinePlot from "../components/LinePlot";
import { View } from "react-native";
import Axis from "../components/Axis";
import Grid from "../components/Grid";

// moved outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const cols = ["confirmed", "recovered", "deaths"];
const xa = (d) => parseDate(d.date);
const ta = [timeMonth];
const tay = [6];
const tickFormat = timeFormat("%b");

export default function TestLine() {
  return (
    <View>
      <Chart data={mock} x={xa}>
        <Grid Y />
        <LinePlot y={cols} />
        <Axis X orient="bottom" tickArguments={ta} tickFormat={tickFormat} />
        <Axis Y tickArguments={tay} />
      </Chart>
    </View>
  );
}
