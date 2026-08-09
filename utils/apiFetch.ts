export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aurea-portal-novios-backend.onrender.com";

export function decodeJwt(token?: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = typeof window !== "undefined" ? window.atob(payload) : Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch {
    return null;
  }
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = API_URL;
  const url = path.startsWith("http") ? path : `${base}${path}`;
  
  const headers = new Headers(init?.headers);
  
  // 1. Evitar forzar JSON si estamos enviando archivos (FormData)
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 2. Inyectar Token Automáticamente
  let token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = { ...init, headers };
  let response = await fetch(url, config);

  // 3. Interceptor 401: Lógica de Refresh Token
  if (response.status === 401 && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          // Guardar nuevos tokens
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          
          // Reintentar la petición original con el nuevo token
          headers.set("Authorization", `Bearer ${data.accessToken}`);
          response = await fetch(url, { ...config, headers });
        } else {
          // Si el refresh falla (ej: expiró a los 7 días), matar sesión
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    } else {
      // Si no hay refresh token, mandar al login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  }

  return response;
}