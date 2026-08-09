"use client";

import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "573002477019"; 
  const message = "Hola Áurea Web, me gustaría recibir más información sobre sus servicios.";

  return (
    // Agregamos cursor-none aquí
    <div className="fixed bottom-6 right-6 z-50 group cursor-none">
      
      {/* Tooltip elegante (Aparece en Hover) */}
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 pointer-events-none opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-x-2">
        <div className="relative rounded-2xl border border-[#C9A96A]/30 bg-[#0A0806]/90 backdrop-blur-md px-5 py-3 text-[10px] font-semibold tracking-[0.2em] text-[#C9A96A] shadow-2xl whitespace-nowrap">
          AGENDA TU VISITA
          {/* Triangulito indicador */}
          <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-[#C9A96A]/30" />
        </div>
      </div>

      {/* Botón Principal (Estilo Luxury Áurea) */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        // Agregamos cursor-none aquí también para evitar que la manito 'pointer' nativa sobreescriba tu cursor
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0A0806]/80 backdrop-blur-md border border-[#C9A96A]/40 text-[#C9A96A] shadow-[0_0_15px_rgba(201,169,106,0.15)] transition-all duration-500 hover:scale-110 hover:bg-[#C9A96A] hover:text-[#0A0806] hover:border-[#C9A96A] hover:shadow-[0_0_30px_rgba(201,169,106,0.4)] focus:outline-none cursor-none"
      >
        {/* Onda expansiva dorada sutil (Sonar effect) */}
        <span 
          className="absolute inset-0 rounded-full border border-[#C9A96A] animate-ping opacity-20" 
          style={{ animationDuration: '3s' }} 
        />
        
        {/* Ícono original de WhatsApp (SVG Oficial) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative z-10 h-7 w-7 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.316 1.262.505 1.694.646.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}