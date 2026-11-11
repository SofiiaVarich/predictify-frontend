"use client";

import type { ReactNode } from "react";
import { SectionWebGL } from "./SectionWebGL";

type Variant = "ticker" | "hero" | "markets" | "kpi" | "features" | "how" | "wallets" | "cta";

export function WebGLSection({ variant, children, className = "", id }: {
  variant: Variant;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`relative isolate overflow-hidden ${className}`}>
      <SectionWebGL variant={variant} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
