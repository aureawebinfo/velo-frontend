import type { Metadata } from "next";
import { Mrs_Saint_Delafield } from "next/font/google";
import FeatherCursor from "@/components/ui/FeatherCursor";
import "./globals.css";

const scriptFont = Mrs_Saint_Delafield({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Áurea — Velo",
  description:
    "Software de gestión para casas de eventos. Centraliza tareas, pagos, documentos y comunicación en un solo portal por boda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${scriptFont.variable}`} data-scroll-behavior="smooth">
      {/* 1. Agregamos 'cursor-none' para ocultar el cursor por defecto del navegador */}
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-text cursor-none">
        {children}
        
        {/* 2. Insertamos el cursor para que esté presente en todo el sitio */}
        <FeatherCursor />
      </body>
    </html>
  );
}