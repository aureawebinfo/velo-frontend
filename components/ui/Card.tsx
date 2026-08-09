import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlighted?: boolean;
}

export default function Card({
  highlighted = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-white p-6",
        highlighted && "border-2 border-accent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
