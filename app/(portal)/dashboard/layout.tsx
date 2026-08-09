// RESPONSABLE: John
// BaseLayout con Sidebar Floral y Navbar Superior compartido por las subrutas de /dashboard

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Contenedor del Sidebar y Navbar */}
      {children}
    </div>
  );
}
