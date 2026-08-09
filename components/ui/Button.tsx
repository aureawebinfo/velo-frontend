import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-text hover:opacity-90",
  secondary: "bg-background text-foreground hover:opacity-90",
  outline: "border border-accent text-accent bg-transparent hover:bg-accent/10",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
