import React, { useState } from "react";
import covid from "./data/covid.json";
import Chart from "../components/chart/Chart";
import { timeParse, timeFormat } from "d3-time-format";
import Axis from "../components/chart/Axis";
import LinePlot from "../components/chart/LinePlot";
import { Button, View } from "react-native";
import { timeMonth } from "d3-time";
import AreaPlot from "../components/chart/AreaPlot";
import { scaleType } from "../components/chart/manager/scale";
import Grid from "../components/chart/Grid";

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
      <Chart data={mock} x={xa} margin={{ right: 40 }}>
        <Grid xAxis="_x" yAxis="_y" />
        <AreaPlot y={cols} />
        <LinePlot y={cols} yAxis="y2" />
        <Axis
          id="_x"
          orient="bottom"
          tickFormat={tickFormat}
          tickArguments={ta}
        />
        <Axis id="_y" orient="left" />
        <Axis id="y2" orient="right" scaleType={scaleType.log} min={1} />
      </Chart>
      <Button title="Update" onPress={() => update({})} />
      <Button title="Increase" onPress={() => setY(y + 100)} />
    </View>
  );
}
