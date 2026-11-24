import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | NEXORA",
  description:
    "Free CPS Test to measure your clicks per second. Test 1, 5, 10 or 30 seconds with accurate timing, live CPS graph, peak CPS, consistency, personal best and mobile support.",
  keywords: [
    "cps test",
    "clicks per second test",
    "click speed test",
    "cps checker",
    "click test",
    "mouse click test",
    "clicking speed test",
    "cps test 5 seconds",
    "cps test 10 seconds",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
