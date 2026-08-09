"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const SoftAurora = dynamic(() => import("@/components/effects/SoftAurora"), {
  ssr: false,
});

export type MenuItem = { label: string; href: string };

export const MENU_ITEMS: MenuItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#features" },
  { label: "Beneficios", href: "#benefits" },
  { label: "Estadísticas", href: "#stats" },
  { label: "El Portal", href: "#product" },
  { label: "Galería", href: "#gallery" },
  { label: "Valor Comercial", href: "#value" },
  { label: "Planes", href: "#pricing" },
  { label: "Testimonios", href: "#testimonials" },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: "0%",
    transition: { duration: 0.7, ease: [0.65, 0.01, 0.05, 0.99] },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.45, ease: [0.65, 0.01, 0.05, 0.99] },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const linkVariants: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
  exit: { x: 20, opacity: 0, transition: { duration: 0.2 } },
};

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z" fill="currentColor" transform="rotate(45 8 8)" />
      <path d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" transform="rotate(45 8 8)" />
    </svg>
  );
}

export default function FullscreenMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    // Función para cerrar con la tecla ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* AÑADIDO: cursor-none aquí para ocultar el cursor nativo en toda la pantalla */
        <div className="fixed inset-0 z-[100] flex justify-end cursor-none">
          
          {/* Overlay Izquierdo (Desktop) */}
          <motion.div
            initial="hidden" animate="visible" exit="exit"
            variants={overlayVariants}
            className="absolute inset-0 hidden sm:block bg-black/40 backdrop-blur-[2px] z-10"
            onClick={onClose}
          >
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
              <SoftAurora speed={0.3} color1="#C9A96A" color2="#E4CFA0" />
            </div>
          </motion.div>

          {/* Overlay Móvil (Fondo oscuro total para legibilidad) */}
          <motion.div
            initial="hidden" animate="visible" exit="exit"
            variants={overlayVariants}
            className="absolute inset-0 block sm:hidden bg-black/95 z-0"
            onClick={onClose}
          />

          {/* Panel del Menú */}
          <motion.div
            initial="hidden" animate="visible" exit="exit"
            variants={panelVariants}
            // AÑADIDO: cursor-none para asegurar que no reaparezca dentro del panel
            className="relative z-30 flex h-full w-full flex-col border-l border-white/5 bg-[#0A0806] sm:w-[450px] lg:w-[550px] shadow-2xl cursor-none"
          >
            {/* Textura de fondo */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
               <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[60%] rounded-full bg-[#C9A96A]/10 blur-[100px]" />
               <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[60%] rounded-full bg-[#C9A96A]/05 blur-[100px]" />
            </div>

            {/* Contenido con Scroll si es necesario */}
            <div className="relative z-10 flex h-full flex-col overflow-y-auto px-6 py-6 sm:px-12 sm:py-10 scrollbar-hide">
              
              {/* Header */}
              <div className="mb-8 flex items-center justify-between shrink-0">
                <span className="text-xl font-serif tracking-tight text-[#EFE6D2]">Áurea</span>
                <button
                  onClick={onClose}
                  // AÑADIDO: cursor-none a botones y links interactivos por seguridad
                  className="group flex items-center gap-3 text-[#B9AF9B] hover:text-[#C9A96A] transition-colors cursor-none"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em]">Cerrar</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 group-hover:border-[#C9A96A]/40 transition-all">
                    <CloseIcon />
                  </div>
                </button>
              </div>

              {/* Navegación */}
              <motion.nav
                variants={listVariants}
                className="flex flex-1 flex-col justify-center min-h-fit"
              >
                {MENU_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.href}
                    variants={linkVariants}
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item.href)}
                    // AÑADIDO: cursor-none
                    className="group relative flex items-baseline gap-4 border-b border-white/[0.03] py-4 sm:py-5 transition-colors cursor-none"
                  >
                    <span className="w-6 font-mono text-[9px] tracking-widest text-[#C9A96A]/40 group-hover:text-[#C9A96A]">
                      {ROMAN[i]}
                    </span>
                    <span className="text-2xl sm:text-4xl font-serif tracking-tight text-[#EFE6D2]/80 group-hover:text-[#EFE6D2] group-hover:translate-x-2 transition-all duration-300">
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#C9A96A] transition-all duration-500 group-hover:w-full" />
                  </motion.a>
                ))}
              </motion.nav>

              {/* Footer */}
              <div className="mt-8 flex flex-col gap-4 border-t border-white/5 pt-8 shrink-0 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#B9AF9B]">Velo · Gestión de Eventos</span>
                <a
                  href="/login"
                  // AÑADIDO: cursor-none
                  className="text-[10px] uppercase tracking-[0.15em] text-[#C9A96A] hover:text-white transition-colors cursor-none"
                >
                  Acceso clientes <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}