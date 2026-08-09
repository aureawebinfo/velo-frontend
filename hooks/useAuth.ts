"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, decodeJwt } from "@/utils/apiFetch";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "COUPLE";
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Pedimos los datos del perfil a la API
        const res = await apiFetch("/users/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // El token es inválido o falló la conexión
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("selectedEventId");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}