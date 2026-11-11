"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WordReveal({ text = "Ideas that feel natural", delay = 0.08, className }: {
  text?: string; delay?: number; className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <h2 className={cn("max-w-lg text-center text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-3xl", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="mr-2 inline-block"
            initial={reduce ? false : { opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30, delay: i * Math.max(0, delay) }}
          >{word}</motion.span>
        ))}
      </span>
    </h2>
  );
}
