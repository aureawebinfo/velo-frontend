"use client";

import { Quote } from "lucide-react";
import type { SectionProps } from "@/types";
import { cn } from "@/lib/cn";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo: string;
};

// 9 testimonios únicos
const testimonials: Testimonial[] = [
  {
    quote:
      "Antes respondíamos más de 30 mensajes al día sobre pagos y fechas. Con Áurea, las parejas consultan todo desde su portal. Recuperamos medio día de trabajo a la semana.",
    name: "María Rodríguez",
    role: "Directora de operaciones",
    company: "Casa Aurora Eventos",
    photo: "https://i.pravatar.cc/128?img=47",
  },
  {
    quote:
      "Pasamos de llevar cuentas en Excel y carpetas compartidas a tener todo consolidado por evento. Cerramos el mes en 2 horas, no en 2 días.",
    name: "Carlos Mendoza",
    role: "Fundador",
    company: "Hacienda Las Palmas",
    photo: "https://i.pravatar.cc/128?img=12",
  },
  {
    quote:
      "Cada boda tiene su propia marca en el portal. Nuestras clientas lo perciben como un servicio premium, y eso justifica nuestro precio.",
    name: "Laura Vega",
    role: "Coordinadora de eventos",
    company: "Grupo Esmeralda Banquetes",
    photo: "https://i.pravatar.cc/128?img=32",
  },
  {
    quote:
      "El seguimiento de pagos era nuestro dolor de cabeza. Ahora cada pareja ve exactamente cuánto debe y cuándo, sin que tengamos que perseguirlas.",
    name: "Andrés Torres",
    role: "Gerente comercial",
    company: "Jardines del Roble",
    photo: "https://i.pravatar.cc/128?img=15",
  },
  {
    quote:
      "Implementamos Áurea en dos semanas y ya no imaginamos volver a WhatsApp y hojas de cálculo sueltas para coordinar cada evento.",
    name: "Sofía Ramírez",
    role: "Directora general",
    company: "Villa Serena Eventos",
    photo: "https://i.pravatar.cc/128?img=45",
  },
  {
    quote:
      "Nuestro equipo pasó de perseguir documentos por correo a tenerlos todos centralizados. El día del evento ya no hay sorpresas.",
    name: "Diego Salazar",
    role: "Jefe de logística",
    company: "Finca El Encanto",
    photo: "https://i.pravatar.cc/128?img=51",
  },
  {
    quote:
      "Las parejas notan la diferencia desde el primer día. Tener un portal propio con nuestra marca eleva la percepción de todo el servicio.",
    name: "Valentina Ortiz",
    role: "Coordinadora senior",
    company: "Casa Blanca Bodas",
    photo: "https://i.pravatar.cc/128?img=26",
  },
  {
    quote:
      "Redujimos las llamadas de último minuto casi a cero. Todo el cronograma está ahí, visible, y las parejas lo revisan solas.",
    name: "Javier Peña",
    role: "Socio fundador",
    company: "Terraza Alameda",
    photo: "https://i.pravatar.cc/128?img=33",
  },
  {
    quote:
      "Manejamos más de 15 bodas simultáneas sin perder el control de ninguna. Antes eso hubiera sido imposible con nuestro sistema anterior.",
    name: "Camila Reyes",
    role: "Directora de operaciones",
    company: "Rosales Eventos",
    photo: "https://i.pravatar.cc/128?img=44",
  },
];

// Reparte los 9 testimonios en 3 columnas de 3 para PC
const columns: Testimonial[][] = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
  testimonials.slice(6, 9),
];

const columnAnimation = [
  "animate-marquee-up",
  "animate-marquee-down",
  "animate-marquee-up-fast",
] as const;

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-white p-6">
      <span
        aria-hidden
        className="-mt-2 mb-2 block font-serif text-5xl leading-none text-accent/20"
      >
        &ldquo;
      </span>
      <Quote className="mb-3 h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
      <p className="flex-1 text-sm leading-relaxed text-text">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover ring-1 ring-inset ring-accent/40"
        />
        <div>
          <p className="text-sm font-medium text-text">{testimonial.name}</p>
          <p className="text-xs text-textSecondary">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials({ className }: SectionProps) {
  return (
    <section
      id="testimonials"
      // Reduje ligeramente el padding en móvil (py-16) para que respire mejor
      className={`group relative w-full overflow-hidden bg-muted px-6 py-16 text-text md:py-32 ${className ?? ""}`}
    >
      <style>{`
        @keyframes marquee-scroll-up {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-scroll-down {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }

        .animate-marquee-up { animation: marquee-scroll-up 22s linear infinite; }
        .animate-marquee-up-fast { animation: marquee-scroll-up 16s linear infinite; }
        .animate-marquee-down { animation: marquee-scroll-down 26s linear infinite; }
        
        /* Animación exclusiva para móvil (Más lenta porque carga los 9 testimonios a la vez) */
        .animate-marquee-mobile { animation: marquee-scroll-up 45s linear infinite; }

        .testimonial-col:hover .animate-marquee-up,
        .testimonial-col:hover .animate-marquee-up-fast,
        .testimonial-col:hover .animate-marquee-down,
        .testimonial-col:hover .animate-marquee-mobile {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-up, .animate-marquee-up-fast, .animate-marquee-down, .animate-marquee-mobile {
            animation: none !important;
          }
        }
      `}</style>

      {/* ---- Textura de fondo ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 90% 75% at 50% 40%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 75% at 50% 40%, black 0%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 85% 50%, rgba(201,169,106,0.10), transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 md:mb-14 flex flex-col items-center gap-4 text-center">
          <span aria-hidden className="block h-px w-12 bg-accent" />
          <h2 className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
            Casas de eventos que ya{" "}
            <span
              className="text-accent"
              style={{
                fontFamily: "var(--font-title-script, 'Alex Brush', cursive)",
                fontSize: "1.35em",
              }}
            >
              organizan distinto
            </span>
          </h2>
        </div>

        {/* ─── VISTA MÓVIL: 1 Sola Columna de 450px de alto ─── */}
        <div className="md:hidden grid grid-cols-1 gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
          <div className="testimonial-col relative h-[450px] overflow-hidden">
            <div className="flex flex-col gap-4 animate-marquee-mobile">
              {/* Cargamos los 9 testimonios seguidos y los duplicamos para el efecto infinito */}
              {[...testimonials, ...testimonials].map((t, i) => (
                <TestimonialCard key={`mobile-${t.name}-${i}`} testimonial={t} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── VISTA DESKTOP: 3 Columnas originales ─── */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
          {columns.map((colItems, col) => (
            <div key={col} className="testimonial-col relative h-[640px] overflow-hidden">
              <div className={cn("flex flex-col gap-4", columnAnimation[col])}>
                {[...colItems, ...colItems].map((t, i) => (
                  <TestimonialCard key={`desktop-${t.name}-${i}`} testimonial={t} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}