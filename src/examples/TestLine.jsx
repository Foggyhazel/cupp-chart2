import React from "react";
import covid from "./data/covid.json";
import Chart from "../components/chart/Chart";
import { timeParse, timeFormat } from "d3-time-format";
import Axis from "../components/chart/Axis";
import { timeMonth } from "d3-time";
import Grid from "../components/chart/Grid";
import LinePlot from "../components/chart/LinePlot";

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
    <Chart data={mock} x={xa}>
      <Grid Y noBorder />
      <LinePlot y={cols} />
      <Axis
        id="_x"
        orient="bottom"
        tickFormat={tickFormat}
        tickArguments={ta}
        nice={false}
      />
      <Axis Y orient="left" tickArguments={tay} />
    </Chart>
  );
}
