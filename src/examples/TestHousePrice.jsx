import React from "react";
import Chart from "../components/chart/Chart";
import houseData from "./data/train.json";
import ScatterPlot from "../components/chart/ScatterPlot";
import Axis from "../components/chart/Axis";
import Grid from "../components/chart/Grid";

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
