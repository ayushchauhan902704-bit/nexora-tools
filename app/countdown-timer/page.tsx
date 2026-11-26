import type { Metadata } from "next";
import CountdownClient from "./CountdownClient";

export const metadata: Metadata = {
  title: "Countdown Timer - Free Online Countdown by THE NEXORA TOOLS",
  description: "Free Countdown Timer - New Year, Birthday, Diwali, Exam countdown. Set any date and see live countdown in days, hours, minutes, seconds.",
};

export default function Page() {
  return <CountdownClient />;
}
