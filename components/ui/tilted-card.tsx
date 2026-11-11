"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TiltedCardProps = {
  children: ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  glare?: number;
  shadow?: number;
};

export default function TiltedCard({
  children,
  className,
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  glare = 0.5,
  shadow = 0.5,
}: TiltedCardProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });
  const scale = useSpring(1, { stiffness: 200, damping: 25 });
  const opacity = useSpring(0);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const background = useMotionTemplate`radial-gradient(circle at ${pointerX}% ${pointerY}%, rgba(255,255,255,${glare}), transparent 65%)`;

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    opacity.set(0);
  }

  return (
    <div className="relative [perspective:1000px]">
      <motion.div
        className={cn("relative rounded-xl", className)}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          scale: reducedMotion ? 1 : scale,
          transformStyle: "preserve-3d",
          boxShadow: `0 20px 40px rgba(0, 0, 0, ${shadow})`,
        }}
        onPointerMove={(event) => {
          if (reducedMotion || event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
          const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
          rotateX.set((0.5 - y) * rotateAmplitude * 2);
          rotateY.set((x - 0.5) * rotateAmplitude * 2);
          scale.set(scaleOnHover);
          pointerX.set(x * 100);
          pointerY.set(y * 100);
          opacity.set(1);
        }}
        onPointerLeave={reset}
        onPointerCancel={reset}
      >
        {children}
        {!reducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background, opacity, transform: "translateZ(1px)" }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function TiltedCardLayer({ children, depth = 30, className }: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div
      className={className}
      style={{ transform: reducedMotion ? undefined : `translateZ(${depth}px)` }}
    >
      {children}
    </div>
  );
}
