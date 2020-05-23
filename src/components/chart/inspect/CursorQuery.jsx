import React from "react";
import { useCursor } from "./cursor";
/**
 * @typedef {Object} Props
 * @property {function} Props.query fn
 * @param {Props} param0
 */
export default function CursorQuery({ query, compare }) {
  const { x, y, active } = useCursor();
  const queryInfo = { x, y, active, compare };
}
