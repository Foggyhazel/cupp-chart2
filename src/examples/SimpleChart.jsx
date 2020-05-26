import React, { useState } from "react";
import covid from "./data/covid.json";
import { timeParse, timeFormat } from "d3-time-format";
import { Circle } from "react-native-svg";
import Chart from "../components/chart/Chart";
import LineChart from "../components/chart/LineChart";
import { useCursor } from "../components/chart/inspect/cursor";
import Axis from "../components/chart/Axis";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";

const cols = ["confirmed", "deaths", "recovered"];

const Pointer = () => {
  const mi = useCursor();
  return !mi.active ? null : (
    <Circle cx={mi.x} fillOpacity={0.2} cy={mi.y} r={10} fill="black" />
  );
};

export default function SimpleChart() {
  const [w, setW] = useState(400);
  const parse = timeParse("%Y-%m-%d");
  const tickFormat = timeFormat("%b");
  return (
    <View>
      <Chart data={covid["Thailand"]} x={(d) => parse(d.date)} width={w}>
        <LineChart y={cols} yAxis="y" xAxis="x" />

        <Axis scale="linear" id="y" />
        <Axis
          scale="time"
          id="x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={[timeMonth]}
        />
        <Pointer />
      </Chart>
      <Button title="update" onPress={() => setW((p) => p + 50)} />
    </View>
  );
}
