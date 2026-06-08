import type { Feature } from "@/types/learning";
import { Card } from "./Card";

const colorStyles: Record<Feature["color"], string> = {
  coral: "bg-[#ffe1dc] text-[#b94339]",
  teal: "bg-[#d8f2ef] text-[#0b6f66]",
  yellow: "bg-[#fff0bd] text-[#8a6200]",
  ink: "bg-[#dfe9ec] text-[#12333f]",
};

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="p-5 transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(18,51,63,0.12)]">
      <div
        aria-hidden="true"
        className={`grid size-12 place-items-center rounded-2xl text-sm font-black ${colorStyles[feature.color]}`}
      >
        {feature.icon}
      </div>
      <h3 className="mt-4 text-lg font-black text-[#12333f]">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#5c747b]">
        {feature.description}
      </p>
    </Card>
  );
}

