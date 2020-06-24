import React from "react";
import lettersData from "./data/letters.json";
import { Chart } from "../components/Chart";
import BarPlot from "../components/BarPlot";
import Axis from "../components/Axis";

export default function TestBar() {
  return (
    <Chart data={lettersData} x="name">
      <BarPlot y="value" padding={0.2} />
      <Axis X orient="bottom" />
      <Axis Y />
    </Chart>
  );
}
