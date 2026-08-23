// código nuevo edición — Layout del dashboard (app/(portal)/dashboard/layout.tsx)
// Qué es: El archivo que envuelve todas las páginas dentro de /dashboard.
// Por qué existe: En Next.js App Router, el layout.tsx de una carpeta se ejecuta antes que cualquier página de esa carpeta.
//   Esto lo convierte en el lugar correcto para montar providers que todas las páginas del dashboard necesitan.
// Cómo funciona:
//   1. AuthProvider va primero (por fuera) → verifica que haya token antes de cargar cualquier cosa.
//      Si no hay token, redirige a /login y nunca llega al EventProvider.
//   2. EventProvider va segundo (por dentro) → carga los eventos del usuario de la API.
//      Solo se monta si AuthProvider ya verificó que hay sesión.
//   3. {children} son las páginas del dashboard (inicio, tareas, pagos, chat, etc.).
//      Cada una puede usar useEvent() y useAuth() porque están dentro de estos providers.
// Cómo modificarlo: Si se necesita agregar otro provider (por ejemplo, un ThemeProvider),
//   se agrega como otro nivel de envoltura aquí, o dentro de AuthProvider/EventProvider según dependa de ellos.
"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EventProvider>
        {children}
      </EventProvider>
    </AuthProvider>
  );
}
