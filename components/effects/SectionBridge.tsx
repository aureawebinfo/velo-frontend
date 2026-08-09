"use client";

import { motion } from "framer-motion";
import { generateFloatingPathD } from "@/components/effects/FloatingPaths";

/**
 * SectionBridge
 * ----------------
 * Continúa las líneas onduladas de AmbientLines (Hero) hacia dentro de
 * Features. Usa la MISMA función de curvas (generateFloatingPathD) que
 * el Hero, para que se vea como una sola animación continua en vez de
 * dos efectos distintos pegados.
 *
 * Vive como hermano entre <Hero /> y <Features />, superpuesto sobre el
 * límite entre ambas secciones, con una máscara que desvanece las líneas
 * hacia abajo dentro de Features.
 */
export default function SectionBridge() {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d1: generateFloatingPathD(i, 1),
    d2: generateFloatingPathD(i, -1),
    width: 0.5 + i * 0.03,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-[5] overflow-hidden opacity-60"
      style={{
        top: "-160px",
        height: "420px",
      }}
    >
      <svg
        className="h-full w-full text-[#C9A46A]"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 88%)",
        }}
      >
        {paths.map((path) => (
          <motion.path
            key={`a-${path.id}`}
            d={path.d1}
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
        {paths.map((path) => (
          <motion.path
            key={`b-${path.id}`}
            d={path.d2}
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