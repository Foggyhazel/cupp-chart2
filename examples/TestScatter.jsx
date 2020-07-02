import React from "react";
import houseData from "./data/train.json";
import { Chart } from "../components/Chart";
import Grid from "../components/Grid";
import Axis from "../components/Axis";
import ScatterPlot from "../components/ScatterPlot";

export default function TestHousePrice() {
  return (
    <Chart data={houseData} x={(d) => parseFloat(d["GrLivArea"])} height={200}>
      <Grid Y noBorder />
      <ScatterPlot
        y={{ price: (d) => parseFloat(d["SalePrice"]) }}
        color="#69b3a2"
        radius={1}
      />
      <Axis X orient="bottom" tickArguments={[3]} max={4000} />
      <Axis
        Y
        tickFormat={(t) => `${Math.round(t / 1000)}k`}
        tickArguments={[3]}
        noLine
      />
    </Chart>
  );
}
