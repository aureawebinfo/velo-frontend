import type { ReactNode } from "react";

// Props base compartidas por cada sección de la landing.
export interface SectionProps {
  className?: string;
}

// Estructura de un ícono + texto, usada en Features, Benefits, BusinessValue, etc.
export interface IconFeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

// Estructura de una tarjeta de plan, usada en Pricing.
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  featured?: boolean;
  ctaLabel: string;
}

// Estructura de un testimonio, usada en Testimonials.
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

// Estructura de una métrica, usada en Stats.
export interface StatItem {
  value: string;
  label: string;
}
