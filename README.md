# Áurea — Velo · Landing Page

Andamiaje (scaffolding) de la landing page. Next.js (App Router) + TypeScript + Tailwind CSS.
Este proyecto **no tiene contenido final** — cada sección está vacía y lista para que cada persona trabaje sobre su bloque asignado.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Verificar tipos y build de producción

```bash
npm run typecheck
npm run build
```

## Estructura del proyecto

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # ensambla las 12 secciones en orden
├── components/
│   ├── sections/              # una sección = un archivo, nombre = nombre de componente
│   └── ui/                    # Button, Card, Badge, IconWrapper — reutilizables
├── lib/
│   └── cn.ts                   # utilidad para combinar clases de Tailwind
├── types/
│   └── index.ts                 # tipos compartidos (SectionProps, PricingPlan, etc.)
└── public/
    ├── icons/
    └── images/
        ├── hero/
        ├── logos/
        └── dashboard-mockups/
```

## Paleta de color (tokens en `tailwind.config.ts`)

| Token | Hex | Uso |
|---|---|---|
| `background` | `#0B0B0A` | Hero, Benefits, Stats, CTASection, Footer |
| `foreground` | `#FFFFFF` | Texto sobre fondo negro |
| `accent` | `#C9A96A` | Único acento visual (dorado) |
| `muted` | `#F7F6F3` | Fondos alternos sutiles |
| `border` | `#E8E5DF` | Bordes y divisores |
| `text` | `#121212` | Texto principal sobre fondo claro |
| `textSecondary` | `#666666` | Texto de apoyo |
| `stateGreen` | `#2A3527` | Solo estados del dashboard ("pagado", "en proceso") |

Reglas de diseño: bordes finos de 1px, sin sombras fuertes, radio de esquina máximo 8px, animaciones de entrada tipo fade-up (una sola vez al entrar en viewport, sin scroll-scrubbing ni parallax). Ver la Guía Oficial de Diseño para el detalle completo de cada sección.

## Asignación de secciones

| Responsable | Componentes (`components/sections/`) |
|---|---|
| **John** | `Navbar.tsx`, `Hero.tsx`, `Footer.tsx` |
| **Edizon** | `Features.tsx`, `Benefits.tsx`, `Stats.tsx` |
| **Andrés** | `ProductShowcase.tsx`, `BrandCustomization.tsx`, `BusinessValue.tsx` |
| **Samuel** | `Pricing.tsx`, `Testimonials.tsx`, `CTASection.tsx` |

Cada archivo de sección ya tiene el fondo correcto aplicado y comentarios `TODO` indicando qué falta por construir. No renombrar los componentes ni cambiar la ruta de los archivos — `app/page.tsx` los importa por nombre exacto.

## Notas

- No se agregaron librerías de animación (Framer Motion, GSAP, etc.) todavía — quedan marcadas con `{/* animación: pendiente */}` en cada sección.
- Los componentes de `components/ui/` (`Button`, `Card`, `Badge`, `IconWrapper`) ya tienen una implementación mínima funcional — se pueden extender según necesidad, pero mantén la firma de props si otra sección ya los está usando.
- Las imágenes reales (fotos de eventos, logos, mockups de dashboard) deben colocarse en las carpetas correspondientes dentro de `public/images/`.
