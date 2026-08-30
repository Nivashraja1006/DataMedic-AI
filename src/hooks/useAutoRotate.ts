import { useState } from "react";

export function useAutoRotate(total: number) {
  const [index, setIndex] = useState(0);
  return { index, setIndex };
}
