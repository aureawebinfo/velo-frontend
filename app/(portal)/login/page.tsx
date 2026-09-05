"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { apiFetch, API_URL, decodeJwt } from "@/utils/apiFetch";
import { AmbientLines } from "@/components/effects/FloatingPaths";
import SideRays from "@/components/effects/SideRays";

// 1. Añadimos la variante para toda la página (Fade + Blur)
const pageVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    filter: "blur(10px)", // Se desenfoca suavemente al salir
    transition: { duration: 0.4, ease: "easeIn" } 
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function LoginPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false); // Estado para controlar la salida
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Función que activa la animación y luego cambia de página
  const handleNavigateToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push("/register");
    }, 400); // 400ms = tiempo que dura la animación "exit"
  };

  // 3. Conexión real con la API (Plan M0)
  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
        }
        throw new Error("Error en el servidor al intentar iniciar sesión.");
      }

      const data = await response.json();
      
      // Guardar tokens reales emitidos por el backend
      if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      // Cookie para que el middleware de Next.js pueda verificar la sesión
      if (data.accessToken) {
        document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }

      // Guardar userId desde el JWT para chat y documentos
      if (data.accessToken) {
        const payload = decodeJwt(data.accessToken);
        if (payload?.sub) localStorage.setItem("userId", payload.sub);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    const googleWindow = window.open(
      `${API_URL}/auth/google`,
      "_blank",
      "width=500,height=600"
    );
    if (!googleWindow) {
      setError("Popup bloqueado. Permite popups para este sitio.");
    }
  }

  return (
    <motion.div 
      initial="hidden"
      animate={isExiting ? "exit" : "visible"} 
      variants={pageVariants}
      // AÑADIDO: cursor-none al contenedor principal
      className="flex min-h-[100dvh] w-full bg-background text-foreground overflow-hidden cursor-none"
    >
      
      {/* ===== Columna Izquierda: Contenido y Formulario ===== */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        
        {/* Botón de volver */}
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Volver"
          // AÑADIDO: cursor-none al botón de volver
          className="group absolute left-6 top-6 lg:left-10 lg:top-10 flex h-10 w-10 items-center justify-center border border-accent/20 bg-transparent text-accent transition-all duration-300 hover:bg-accent/10 rounded-sm cursor-none"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
        </button>

        <motion.div
          variants={containerVariants}
          className="relative z-10 w-full max-w-[380px]"
        >
          {/* Logo Minimalista */}
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <Image
              src="/images/Logo1.png"
              alt="Áurea"
              width={96}
              height={96}
              priority
              className="h-[72px] w-auto drop-shadow-md"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-accent">
            <span className="h-px w-10 bg-accent/40" />
            Velo
            <span className="h-px w-10 bg-accent/40" />
          </motion.div>

          {/* Formulario */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-widest text-muted">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  // AÑADIDO: cursor-none al input
                  className="w-full rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder-muted/30 transition-colors focus:border-accent/80 focus:bg-black/40 focus:outline-none cursor-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-widest text-muted">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  // AÑADIDO: cursor-none al input
                  className="w-full rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder-muted/30 transition-colors focus:border-accent/80 focus:bg-black/40 focus:outline-none cursor-none"
                  required
                />
              </div>

              {error && (
                <p className="text-left text-xs text-red-400/90">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                // AÑADIDO: cursor-none al botón principal
                className="mt-4 w-full rounded-sm bg-accent py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-accent/90 disabled:opacity-50 cursor-none"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="relative my-5 flex items-center gap-4 text-accent/30">
              <span className="h-px flex-1 bg-white/5" />
              <span className="text-[9px] uppercase tracking-widest text-muted">
                O continúa con
              </span>
              <span className="h-px flex-1 bg-white/5" />
            </div>

            <button
              onClick={handleGoogleLogin}
              // AÑADIDO: cursor-none al botón de Google
              className="group flex w-full items-center justify-center gap-3 rounded-sm border border-white/10 bg-transparent py-3 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.02] cursor-none"
            >
              <svg className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs tracking-wider text-muted group-hover:text-foreground">
                Google
              </span>
            </button>

          </motion.div>
        </motion.div>
      </div>

      {/* ===== Columna Derecha: Imagen Limpia ===== */}
      <div className="relative hidden w-1/2 lg:block border-l border-white/5 bg-black">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/images/Login.png"
            alt="Fondo mármol/ambiente"
            fill
            priority
            quality={100}
            className="object-cover" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent w-1/4" />

          <AmbientLines />
          <div className="pointer-events-none absolute inset-0">
            <SideRays
              speed={1.2}
              rayColor1="#C9A96A"
              rayColor2="#F1D97A"
              intensity={1}
              spread={1.1}
              origin="top-right"
              tilt={8}
              saturation={1.1}
              blend={0.45}
              falloff={1.4}
              opacity={0.4}
            />
          </div>
        </div>
      </div>

    </motion.div>
  );
}