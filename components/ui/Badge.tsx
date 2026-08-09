import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export default function Badge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-widest text-text",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
