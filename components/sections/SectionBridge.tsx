"use client";

import { motion } from "framer-motion";
import { generateFloatingPathD } from "@/components/effects/FloatingPaths";

/**
 * SectionBridge
 * ----------------
 * Continúa las líneas onduladas de AmbientLines (Hero) hacia dentro de
 * Features. Usa la MISMA función de curvas (generateFloatingPathD) que
 * el Hero, pero con un stroke en gradiente: dorado claro arriba (donde
 * se une con el Hero oscuro) → un dorado más oscuro/saturado abajo (para
 * que se note sobre el fondo blanco de Features).
 *
 * Vive como hermano entre <Hero /> y <Features />, anclado al borde
 * inferior del Hero con `bottom`, extendiéndose hacia abajo dentro de
 * Features.
 */
export default function SectionBridge() {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d1: generateFloatingPathD(i, 1),
    d2: generateFloatingPathD(i, -1),
    width: 0.6 + i * 0.035,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-20 overflow-visible"
      style={{
        bottom: "-260px",
        height: "420px",
      }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
        }}
      >
        <defs>
          <linearGradient id="bridge-gold-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4C892" />
            <stop offset="35%" stopColor="#C9A46A" />
            <stop offset="100%" stopColor="#8A6A3A" />
          </linearGradient>
        </defs>

        {paths.map((path) => (
          <motion.path
            key={`a-${path.id}`}
            d={path.d1}
            stroke="url(#bridge-gold-fade)"
            strokeWidth={path.width}
            strokeOpacity={0.35 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.4, 0.7, 0.4],
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
            stroke="url(#bridge-gold-fade)"
            strokeWidth={path.width}
            strokeOpacity={0.35 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.4, 0.7, 0.4],
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