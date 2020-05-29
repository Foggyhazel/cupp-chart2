import { useRef } from "react";

let nextKey = 0;

export default function useKey() {
  const ref = useRef(null);
  if (ref.current == null) {
    ref.current = nextKey;
    nextKey++;
  }
  return ref.current;
}
