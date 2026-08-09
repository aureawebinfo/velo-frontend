"use client";

import { motion } from "framer-motion";

export function generateFloatingPathD(i: number, position: number, xOffset = 0) {
  const startX = -380 + i * 5 * position + xOffset;
  const ctrl1X = -312 + i * 5 * position + xOffset;
  const ctrl2X = 152 - i * 5 * position + xOffset;
  const endX = 684 - i * 5 * position + xOffset;

  return `M${startX} -${189 + i * 6}C${startX} -${189 + i * 6} ${ctrl1X} ${216 - i * 6} ${ctrl2X} ${343 - i * 6}C${
    616 - i * 5 * position + xOffset
  } ${470 - i * 6} ${endX} ${875 - i * 6} ${endX} ${875 - i * 6}`;
}

/**
 * FloatingPaths
 * ----------------
 * Rayas ambientales doradas usadas en Hero.
 * Es un componente auxiliar reutilizable para separar la lógica de fondo.
 * Props:
 * - position: dirección lateral del conjunto de caminos.
 */
export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: generateFloatingPathD(i, position),
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-[#C9A46A]"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.16 + path.id * 0.015}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.45, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 22 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * AmbientLines
 * ----------------
 * Envuelve dos conjuntos de FloatingPaths para Hero.
 */
export function AmbientLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
