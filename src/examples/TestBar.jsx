import React from "react";
import lettersData from "./data/letters.json";
import Axis from "../components/chart/Axis";
import Chart from "../components/chart/Chart";
import BarPlot from "../components/chart/BarPlot";

export default function TestBar() {
  return (
    <Chart data={lettersData} x="name">
      <BarPlot y="value" padding={0.2} />
      <Axis X orient="bottom" />
      <Axis Y />
    </Chart>
  );
}
