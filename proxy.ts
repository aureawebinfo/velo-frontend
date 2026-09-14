import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Modo mantenimiento: bloquea todo el sitio excepto /maintenance ──
  if (MAINTENANCE_MODE && !pathname.startsWith("/maintenance")) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url, { status: 503 });
  }

  // ── 2. Protección de rutas privadas (dashboard) ──
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};