// código nuevo edición — Archivo nuevo: AuthContext.tsx
// Qué es: Un componente que protege las páginas del dashboard.
// Por qué existe: Sin esto, cualquiera que escriba /dashboard en el navegador entra sin haber iniciado sesión.
// Cómo funciona: Al montarse, revisa si hay un token de acceso guardado en localStorage.
//   - Si hay token → deja pasar al dashboard.
//   - Si no hay token → redirige a /login.
// Cómo modificarlo: Si en el futuro se necesita proteger otras rutas aparte de /dashboard,
//   se puede envolver con <AuthProvider> en el layout de esas rutas.
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthContextShape = {
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextShape>({
  isAuthenticated: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // código nuevo edición — Este useEffect se ejecuta una vez al montar el componente.
  // Paso a paso:
  // 1. Busca "accessToken" en localStorage (el login lo guarda ahí).
  // 2. Si existe, significa que el usuario se autenticó → pone isAuthenticated en true.
  // 3. Si no existe, significa que no hay sesión → redirige a /login con router.replace.
  //    Se usa replace en vez de push para que el usuario no pueda volver atrás con el botón del navegador.
  // 4. Siempre pone loading en false al final para que la UI deje de mostrar el spinner.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.replace("/login");
    }
    setLoading(false);
  }, [router]);

  // Mientras se verifica el token, mostramos un spinner para que la pantalla no parpadee.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#D9D1C5] border-t-[#C9A96A] rounded-full animate-spin" />
          <p className="text-[#7A7167] text-xs font-semibold tracking-widest uppercase">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado y ya terminó de cargar, no muestra nada (está redirigiendo a /login).
  if (!isAuthenticated) return null;

  // Si está autenticado, deja pasar a los hijos (el dashboard).
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth es un hook que otros componentes pueden usar para saber si hay sesión activa.
// Ejemplo: const { isAuthenticated } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
