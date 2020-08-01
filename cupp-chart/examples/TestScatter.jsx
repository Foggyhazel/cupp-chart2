import React from "react";
import houseData from "./data/train.json";
import { Chart, Grid, ScatterPlot, Axis } from "../src";

const ta = [3];
const ya = { price: (d) => parseFloat(d["SalePrice"]) };
const xa = (d) => parseFloat(d["GrLivArea"]);
const tf = (t) => `${Math.round(t / 1000)}k`;

export default function TestHousePrice() {
  return (
    <Chart data={houseData} x={xa} height={200}>
      <Grid Y noBorder />
      <ScatterPlot y={ya} color="#69b3a2" radius={1} />
      <Axis X orient="bottom" tickArguments={ta} max={4000} />
      <Axis Y tickFormat={tf} tickArguments={ta} noLine />
    </Chart>
  );
}
