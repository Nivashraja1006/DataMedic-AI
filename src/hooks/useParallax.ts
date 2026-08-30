import { useEffect, useState } from "react";

export function useParallax(intensity = 18) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x: x * intensity, y: y * intensity });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [intensity]);

  return {
    pointer,
    transform: {
      rotateX: `${-pointer.y}deg`,
      rotateY: `${pointer.x}deg`,
    },
  };
}
