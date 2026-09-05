import type { Metadata } from "next";
import { Mrs_Saint_Delafield } from "next/font/google";
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
  icons: {
    icon: "/images/Velo.webp",
    shortcut: "/images/Velo.webp",
    apple: "/images/Velo.webp",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${scriptFont.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-text">
        {children}
      </body>
    </html>
  );
}