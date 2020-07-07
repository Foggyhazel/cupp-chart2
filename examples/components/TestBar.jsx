import React from "react";
import lettersData from "../data/letters.json";
import { Chart, BarPlot, Axis } from "../../src";

export default function TestBar() {
  return (
    <Chart data={lettersData} x="name">
      <BarPlot y="value" padding={0.2} />
      <Axis X orient="bottom" />
      <Axis Y />
    </Chart>
  );
}
