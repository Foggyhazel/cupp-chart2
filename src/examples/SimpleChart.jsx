import React from "react";
import covid from "./data/covid.json";
import { timeParse } from "d3-time-format";
import { Circle } from "react-native-svg";
import Chart from "../components/chart/Chart";
import LineChart from "../components/chart/LineChart";
import { useCursor } from "../components/chart/inspect/cursor";

const cols = ["confirmed", "deaths", "recovered"];

const Pointer = () => {
  const mi = useCursor();
  return !mi.active ? null : (
    <Circle cx={mi.x} fillOpacity={0.2} cy={mi.y} r={10} fill="black" />
  );
};

export default function SimpleChart() {
  const parse = timeParse("%Y-%m-%d");
  return (
    <Chart data={covid["Thailand"]} x={(d) => parse(d.date)}>
      <LineChart y={cols} />
      <Pointer />
    </Chart>
  );
}
