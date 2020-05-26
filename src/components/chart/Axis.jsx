import React from "react";
import ChartAxis from "./ChartAxis";
import { useScale } from "./context";

/**
 * @typedef {Object} Props
 * @property {'linear' | 'time'} scale
 * @param {Props} param0
 */
export default function Axis({
  // eslint-disable-next-line no-unused-vars
  scale,
  // eslint-disable-next-line no-unused-vars
  min,
  // eslint-disable-next-line no-unused-vars
  max,
  orient = "left",
  draw = true,
  id,
  ...rest
}) {
  const [s, ctv] = useScale(id);
  const { width, height, margin } = ctv;
  const offsetX = {
    left: margin.left,
    top: 0,
    bottom: 0,
    right: width - margin.right,
  }[orient];
  const offsetY = {
    top: margin.top,
    bottom: height - margin.bottom,
    left: 0,
    right: 0,
  }[orient];
  return draw ? (
    <ChartAxis
      orient={orient}
      scale={s}
      offsetX={offsetX}
      offsetY={offsetY}
      {...rest}
    />
  ) : null;
}
