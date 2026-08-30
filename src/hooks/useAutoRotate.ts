import { useEffect, useState } from "react";

export function useAutoRotate(total: number, intervalMs = 4000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (total <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, total]);

  return { index, setIndex };
}
