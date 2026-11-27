import type { Metadata } from "next";
import SalaryCounterClient from "./SalaryCounterClient";

export const metadata: Metadata = {
  title:
    "Live Salary Counter - See Your Earnings Every Second | THE NEXORA TOOLS",
  description:
    "Free Live Salary Counter to calculate your earnings per second, minute, hour, day, week, month and year. Enter your salary and see your live earnings instantly.",
};

export default function Page() {
  return <SalaryCounterClient />;
}
