"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { Pause, Play } from "lucide-react";

export interface ScrollVelocityMarqueeProps {
  text?: string;
  accent?: string;
  speed?: number;
  contained?: boolean;
  className?: string;
}

const ROWS = [
  { start: -9, direction: 1, kind: "ghost" },
  { start: -6, direction: -1, kind: "solid" },
  { start: -14, direction: 1, kind: "band" },
  { start: -5, direction: -1, kind: "ghost" },
] as const;

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

// Mount only while running so paused and reduced-motion views have no frame loop.
function MarqueeClock({
  offset,
  factor,
  speed,
}: {
  offset: MotionValue<number>;
  factor: MotionValue<number>;
  speed: number;
}) {
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    const velocity = factor.get();
    if (velocity !== 0) direction.current = velocity < 0 ? -1 : 1;
    offset.set(
      offset.get() +
        direction.current * speed * (1 + Math.abs(velocity)) * (Math.min(delta, 64) / 1000),
    );
  });

  return null;
}

function MarqueeRow({
  row,
  text,
  accent,
  offset,
  skew,
  reduced,
}: {
  row: (typeof ROWS)[number];
  text: string;
  accent: string;
  offset: MotionValue<number>;
  skew: MotionValue<number>;
  reduced: boolean;
}) {
  const x = useTransform(offset, (value) =>
    `${wrap(-25, 0, row.start + value * row.direction)}%`,
  );
  const rowSkew = useTransform(skew, (value) => value * row.direction);
  const appearance =
    row.kind === "ghost"
      ? "text-neutral-300 dark:text-neutral-700"
      : row.kind === "solid"
        ? "text-neutral-950 dark:text-neutral-50"
        : "text-neutral-950";

  return (
    <div
      className={`overflow-hidden ${appearance}`}
      style={row.kind === "band" ? { backgroundColor: accent } : undefined}
    >
      <motion.div
        className={
          reduced
            ? "text-center font-semibold leading-[1.02] tracking-[-0.045em] [overflow-wrap:anywhere] text-[clamp(44px,17cqi,140px)]"
            : "flex w-max font-semibold leading-[1.02] tracking-[-0.045em] text-[clamp(44px,17cqi,140px)]"
        }
        style={reduced ? undefined : { x, skewX: rowSkew }}
      >
        {Array.from({ length: reduced ? 1 : 4 }, (_, index) => (
          <span
            key={index}
            className={reduced ? "block" : "flex shrink-0 gap-[1.5cqi] whitespace-nowrap pr-[1.5cqi]"}
          >
            <span>{text}</span>
            {!reduced && <span>·</span>}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocityMarquee({
  text = "Handmade · No templates · Ready to ship",
  accent = "#d4ff3a",
  speed = 3,
  contained = true,
  className = "",
}: ScrollVelocityMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Stay static until the media preference has been resolved on the client.
  const reduced = reducedMotion !== false;
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const inView = useInView(wrapperRef, { amount: "some" });
  const { scrollY } = useScroll({ container: contained ? containerRef : undefined });
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2000, 2000], [-12, 12]);
  const offset = useMotionValue(0);
  const frozenSkew = useMotionValue(0);
  const running = !reduced && !paused && inView && visible;
  const boundedSpeed = Number.isFinite(speed) ? Math.min(12, Math.max(1, speed)) : 3;

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!running) frozenSkew.set(skew.get());
  }, [running, frozenSkew, skew]);

  return (
    <div
      ref={wrapperRef}
      className={`relative isolate ${className}`}
      style={{ containerType: "inline-size" } as CSSProperties}
    >
      <p className="sr-only">{text}</p>
      <div
        ref={containerRef}
        tabIndex={contained && !reduced ? 0 : undefined}
        role={contained ? "region" : undefined}
        aria-label={contained ? "Scroll velocity marquee" : undefined}
        className={
          contained
            ? `rounded-3xl bg-[#fafafa] dark:bg-[#0a0a0a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${reduced ? "overflow-hidden py-8" : "h-[28rem] overflow-x-hidden overflow-y-auto"}`
            : "overflow-hidden py-8"
        }
      >
        <div className={contained && !reduced ? "relative h-[500%]" : undefined}>
          <div
            aria-hidden="true"
            className={`flex flex-col gap-[1.5cqi] ${contained && !reduced ? "sticky top-[20%]" : ""}`}
          >
            {ROWS.map((row, index) => (
              <MarqueeRow
                key={index}
                row={row}
                text={text}
                accent={accent}
                offset={offset}
                skew={running ? skew : frozenSkew}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Resume marquee animation" : "Pause marquee animation"}
          aria-pressed={paused}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-950 shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          {paused ? <Play aria-hidden="true" size={20} /> : <Pause aria-hidden="true" size={20} />}
        </button>
      )}
      {running && <MarqueeClock offset={offset} factor={factor} speed={boundedSpeed} />}
    </div>
  );
}
