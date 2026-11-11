"use client";

import { useMotionTemplate, useMotionValue, useReducedMotion, motion } from "framer-motion";
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type MagicCardProps = ComponentPropsWithoutRef<"div"> & {
  gradientColor?: string;
  gradientSize?: number;
};

export function MagicCard({
  children,
  className,
  gradientColor = "#262626",
  gradientSize = 200,
  onPointerMove,
  ...props
}: MagicCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const background = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`;

  return (
    <div
      className={cn("group/magic relative isolate overflow-hidden rounded-[inherit]", className)}
      onPointerMove={(event) => {
        if (!reducedMotion) {
          const bounds = event.currentTarget.getBoundingClientRect();
          mouseX.set(event.clientX - bounds.left);
          mouseY.set(event.clientY - bounds.top);
        }
        onPointerMove?.(event);
      }}
      {...props}
    >
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/magic:opacity-100 group-focus-within/magic:opacity-100"
          style={{ background }}
        />
      )}
      {children}
    </div>
  );
}
