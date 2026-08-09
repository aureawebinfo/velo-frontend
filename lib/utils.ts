import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma segura: une varias clases (incluso
 * condicionales) y resuelve conflictos, por ejemplo si dos clases ponen
 * distinto "padding", se queda con la última en vez de aplicar ambas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}