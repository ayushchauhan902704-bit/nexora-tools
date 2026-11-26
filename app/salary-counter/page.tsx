import type { Metadata } from "next";
import SalaryCounterClient from "./SalaryCounterClient";

export const metadata: Metadata = {
  title: "Live Salary Counter - See Your Earnings Live Every Second | THE NEXORA TOOLS",
  description: "Free Live Salary Counter - Apni salary daalo aur dekho har second kitne paise kama rahe ho. Salary to Hourly, Daily, Weekly, Monthly, Yearly Calculator.",
};

export default function Page() {
  return <SalaryCounterClient />;
}
