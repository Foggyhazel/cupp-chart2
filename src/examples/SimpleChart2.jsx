import React, { useState } from "react";
import covid from "./data/covid.json";
import Chart from "../components/chart/Chart";
import { timeParse, timeFormat } from "d3-time-format";
import Axis from "../components/chart/Axis";
import LinePlot from "../components/chart/LinePlot";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";

// move outside to avoid re-render
const mock = covid["Thailand"];
const parseDate = timeParse("%Y-%m-%d");
const xa = (d) => parseDate(d.date);
const cols = ["confirmed", "recovered", "deaths"];

export default function SimpleChart2() {
  const tickFormat = timeFormat("%b");
  const [y, setY] = useState(100);
  const [, update] = useState({});

  return (
    <View>
      <Chart data={mock} x={xa}>
        <LinePlot y={cols} />
        <Axis
          id="_x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={[timeMonth]}
        />
        <Axis id="_y" orient="left" />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
      <Button title="Increase" onPress={() => setY(y + 100)} />
    </View>
  );
}
