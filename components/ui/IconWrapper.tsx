import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export default function IconWrapper({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-muted text-accent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
