"use client";

import { Feature } from "../app/content/features";
import { FC } from "react";
import TiltedCard, { TiltedCardLayer } from "@/components/ui/tilted-card";

/**
 * Reusable Feature Card Component
 * @param feature
 */
export const FeatureCard: FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <TiltedCard
      rotateAmplitude={12}
      scaleOnHover={1.05}
      glare={0.5}
      shadow={0.5}
      className=" w-[333.375px]
        flex flex-col h-[532px] min-h-[250px] md:min-h-[280px] lg:min-h-[300px]
        rounded-xl shadow-lg
        bg-[#3a1b62] border border-[#374151] text-white
      "
    >
      <TiltedCardLayer depth={30} className="flex h-full flex-col p-6">
        {/* Icon Area: Inline SVG allows tinting with Tailwind classes */}
        <div className="mb-6">{feature.icon}</div>

        <h3 className="text-h4 font-bold mb-3 text-white">{feature.title}</h3>

        <p className="text-body-lg text-[#D1D5DB] leading-relaxed">
          {feature.body}
        </p>
      </TiltedCardLayer>
    </TiltedCard>
  );
};
