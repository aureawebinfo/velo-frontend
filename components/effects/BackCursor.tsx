"use client";

import { useEffect, useRef, useState } from "react";

/* Cursor personalizado para la franja izquierda: una flecha + "Volver"
   que sigue al mouse. Se activa solo cuando el mouse entra al área que
   lo contiene (pásale un containerRef). */
export default function BackCursor({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [containerRef]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[110] flex items-center gap-2 text-accent"
      style={{ left: pos.x, top: pos.y, transform: "translate(-8px, -8px)" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M19 12H5" />
        <path d="M11 6l-6 6 6 6" />
      </svg>
      <span className="translate-y-3 text-[10px] uppercase tracking-[0.2em] text-accent/90">Volver</span>
    </div>
  );
}