"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  t: number;
}

/* ============================================================================
   FEATHER CURSOR — cursor de pluma global para toda la aplicación.
   ============================================================================ */
export default function FeatherCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorEl = cursorRef.current;
    if (!canvas || !cursorEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    // Recorrido corto: la estela dura poco y no acumula demasiados puntos
    const TRAIL_LIFETIME_MS = 240;
    const MAX_POINTS = 16;

    const onMove = (e: MouseEvent) => {
      // Coordenadas absolutas respecto a la ventana completa
      const x = e.clientX;
      const y = e.clientY;

      cursorEl.style.transform = `translate(${x}px, ${y}px)`;

      const now = performance.now();
      const pts = pointsRef.current;
      pts.push({ x, y, t: now });
      while (pts.length > MAX_POINTS) pts.shift();
    };

    const onEnter = () => {
      cursorEl.style.opacity = "1";
    };
    const onLeave = () => {
      cursorEl.style.opacity = "0";
      pointsRef.current = [];
    };

    // Escuchamos a nivel global de ventana/documento
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      const pts = pointsRef.current.filter((p) => now - p.t < TRAIL_LIFETIME_MS);
      pointsRef.current = pts;

      if (pts.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const age = now - p1.t;
          const lifeRatio = Math.max(0, 1 - age / TRAIL_LIFETIME_MS);

          // Dorado, sutil: opacidad y grosor decrecen con la edad del punto
          ctx.strokeStyle = `rgba(201, 164, 106, ${lifeRatio * 0.5})`;
          ctx.lineWidth = Math.max(0.4, lifeRatio * 1.6);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Canvas fijo que cubre toda la pantalla por encima de todo (z-[9999]) */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-[9999]" 
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] opacity-0 transition-opacity duration-150"
        style={{ willChange: "transform" }}
      >
        {/* Pluma: trazo elegante y delgado, apunta hacia arriba-izquierda desde el punto del mouse */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          style={{ transform: "translate(-3px, -25px) rotate(-38deg)" }}
        >
          <path
            d="M15 2 C 10 8, 6 16, 9 26 C 9 26 4 24 3 18 C 3 18 10 12 15 2 Z"
            fill="#C9A46A"
            stroke="#F4F1EC"
            strokeWidth="0.4"
          />
          <path d="M9 15 C 8 17, 6.5 19, 5 20.5" stroke="#F4F1EC" strokeWidth="0.35" fill="none" opacity="0.6" />
          <path d="M9 26 L 4.5 29.5" stroke="#C9A46A" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}