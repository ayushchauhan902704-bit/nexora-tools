import type { Metadata } from "next";
import TipClient from "./TipClient";

export const metadata: Metadata = {
  title: "Tip Calculator - Calculate Tip & Split Bill Easily | THE NEXORA TOOLS",
  description: "Free Tip Calculator USA - Calculate 10%, 15%, 20% tip, total bill and split between friends. Best for Restaurant, Food Delivery, USA, UK.",
};

export default function Page() {
  return <TipClient />;
}
