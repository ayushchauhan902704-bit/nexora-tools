import type { Metadata } from "next";
import TipClient from "./TipClient";

export const metadata: Metadata = {
  title: "Tip Calculator - Calculate Tip, Total & Split Bill | NEXORA",
  description:
    "Free tip calculator to calculate restaurant tips, total bill, change and split the bill between people. Enter the bill and amount paid to instantly calculate the tip.",
};

export default function Page() {
  return <TipClient />;
}
