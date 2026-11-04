import { Metadata } from "next";
import LoveCalculatorClient from "./LoveCalculatorClient";

export const metadata: Metadata = {
  title: "Love Calculator - True Love Percentage by Name 100% Accurate | NEXORA",
  description: "No.1 Love Calculator by NEXORA - Check True Love Percentage by Name in 1 Sec. Love Test for Crush, Partner, Soulmate. 100% Accurate, Fun, Free, No Login.",
  keywords: "love calculator, love calculator by name, true love calculator, love percentage",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/love-calculator" },
};

export default function Page() {
  return <LoveCalculatorClient />;
}
