import { ReactNode } from "react";
import { ShieldCheckIcon } from "@/components/ui/animated-icons/shield-check";
import { HandCoinsIcon } from "@/components/ui/animated-icons/hand-coins";
import { BlocksIcon } from "@/components/ui/animated-icons/blocks";
import { ChartColumnIncreasingIcon } from "@/components/ui/animated-icons/chart-column-increasing";
import { WalletIcon } from "@/components/ui/animated-icons/wallet";
import { ChartLineIcon } from "@/components/ui/animated-icons/chart-line";

export type Feature = {
  icon: ReactNode;
  title: string;
  body: string;
};

const iconClassName = "w-[71px] h-[71px] rounded-lg flex items-center justify-center";

export const features: Feature[] = [
  {
    icon: <ShieldCheckIcon size={28} className={`${iconClassName} bg-[#312E814D] text-[#818CF8]`} />,
    title: "Decentralized & Transparent",
    body: "Built on blockchain technology, all predictions and outcomes are transparently recorded and cannot be manipulated.",
  },
  {
    icon: <HandCoinsIcon size={28} className={`${iconClassName} bg-[#581C874D] text-[#C084FC]`} />,
    title: "Instant Payouts",
    body: "Smart contracts automatically distribute winnings immediately when outcomes are confirmed, with no delays or manual processing.",
  },
  {
    icon: <BlocksIcon size={28} className={`${iconClassName} bg-[#1E3A8A4D] text-[#60A5FA]`} />,
    title: "Create Your Markets",
    body: "Anyone can create prediction markets on virtually any verifiable future event, from sports to politics to financial outcomes.",
  },
  {
    icon: <ChartColumnIncreasingIcon size={28} className={`${iconClassName} bg-[#14532D4D] text-[#4ADE80]`} />,
    title: "Advanced Analytics",
    body: "Track your prediction performance with detailed analytics and insights to improve your future predictions.",
  },
  {
    icon: <WalletIcon size={28} className={`${iconClassName} bg-[#78350F4D] text-[#FBBF24]`} />,
    title: "Multi-Wallet Support",
    body: "Connect with your preferred wallet including MetaMask, Coinbase Wallet, WalletConnect and more.",
  },
  {
    icon: <ChartLineIcon size={28} className={`${iconClassName} bg-[#7F1D1D4D] text-[#F87171]`} />,
    title: "Real-Time Market Data",
    body: "Watch prediction markets evolve in real-time with live updates on odds, stakes, and participant activity.",
  },
];
