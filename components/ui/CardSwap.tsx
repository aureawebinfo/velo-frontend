"use client";
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={cn(
      "absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]",
      "[transform-style:preserve-3d] will-change-transform [backface-visibility:hidden]",
      className
    )}
  />
));
Card.displayName = "Card";

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: any, slot: any, skew: number, enableGPU: boolean = true) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: enableGPU,
  });

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  children: React.ReactNode;
  className?: string;
  enableGPU?: boolean;
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 3500,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "smooth",
  enableGPU = true,
  children,
  className,
}: CardSwapProps) => {
  // Optimized config - duraciones MUCHO más rápidas
  const config = useMemo(() => {
    return easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 0.6, // ⬇️ Reducido de 2s a 0.6s
          durMove: 0.6, // ⬇️ Reducido de 2s a 0.6s
          durReturn: 0.6, // ⬇️ Reducido de 2s a 0.6s
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power2.inOut", // ⬆️ Cambio de power1 a power2 (más snappy)
          durDrop: 0.4, // ⬇️ Reducido de 0.8s a 0.4s
          durMove: 0.4, // ⬇️ Reducido de 0.8s a 0.4s
          durReturn: 0.4, // ⬇️ Reducido de 0.8s a 0.4s
          promoteOverlap: 0.45,
          returnDelay: 0.15,
        };
  }, [easing]);

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Memoizar swap para evitar recreaciones innecesarias
  const swap = useCallback(() => {
    if (order.current.length < 2 || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const [front, ...rest] = order.current;
    const elFront = refs[front].current;

    const tl = gsap.timeline({
      onComplete: () => {
        order.current = [...rest, front];
        isAnimatingRef.current = false;
      },
    });

    tlRef.current = tl;

    // Drop animation - mucho más rápido
    tl.to(elFront, {
      y: "+=500",
      duration: config.durDrop,
      ease: config.ease,
    });

    tl.addLabel(
      "promote",
      `-=${config.durDrop * config.promoteOverlap}`
    );

    // Promote otros elementos
    rest.forEach((idx, i) => {
      const el = refs[idx].current;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease,
        },
        `promote+=${i * 0.1}` // ⬇️ Reducido de 0.15 a 0.1
      );
    });

    const backSlot = makeSlot(
      refs.length - 1,
      cardDistance,
      verticalDistance,
      refs.length
    );

    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);

    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      "return"
    );

    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: config.durReturn,
        ease: config.ease,
      },
      "return"
    );
  }, [config, cardDistance, verticalDistance, refs]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount,
        enableGPU
      )
    );

    // Inicia la secuencia más rápido (200ms vs 500ms)
    const initialTimeout = setTimeout(() => {
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    }, 200);

    if (pauseOnHover) {
      const node = container.current;

      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };

      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };

      node?.addEventListener("mouseenter", pause);
      node?.addEventListener("mouseleave", resume);

      return () => {
        node?.removeEventListener("mouseenter", pause);
        node?.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
        clearTimeout(initialTimeout);
        tlRef.current?.kill();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(initialTimeout);
      tlRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, enableGPU, swap]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          key: i,
          ref: refs[i],
          style: {
            width,
            height,
            willChange: "transform",
            ...((child.props as any).style ?? {}),
          },
          onClick: (e: any) => {
            (child.props as any).onClick?.(e);
            onCardClick?.(i);
          },
        } as any)
      : child
  );

  return (
    <div
      ref={container}
      className={cn(
        "relative [perspective:900px] overflow-visible z-10",
        className
      )}
      style={{
        width,
        height,
        willChange: "transform", // ⬆️ Optimización extra para el contenedor
      }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;