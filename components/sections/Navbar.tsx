"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import FullscreenMenu from "@/components/ui/FullscreenMenu";

/* ============================================================================
   VELO — NAVBAR
   Sin barra sólida arriba: solo el botón hamburguesa flotando en la esquina
   superior derecha, para dejar libre el espacio del Hero (donde va la
   lámpara). Al hacer click abre el FullscreenMenu.

   El botón dispara los eventos globales "feather-enter" / "feather-leave"
   para que FeatherCursor (montado dentro del Hero) se mantenga activa al
   pasar por aquí, aunque el navbar sea `fixed` y no sea hijo del DOM del
   Hero.
   ============================================================================ */

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
      <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed right-6 top-6 z-50 sm:right-10 lg:right-16"
      >
        <button
          onClick={() => setIsMenuOpen(true)}
          onMouseEnter={() => window.dispatchEvent(new CustomEvent("feather-enter"))}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent("feather-leave"))}
          aria-label="Abrir menú"
          className="flex items-center gap-3 cursor-none force-cursor-none text-foreground/90 transition-colors hover:text-accent"
        >
          
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-background/40 backdrop-blur-sm">
            <HamburgerIcon />
          </span>
        </button>
      </motion.div>

      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}