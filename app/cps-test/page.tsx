import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | NEXORA - #1 Click Speed Test",
  description:
    "Free CPS Test - Check your clicks per second in 1, 5, 10, 30, 60 seconds or 100 Clicks Challenge. Accurate timing, peak CPS, consistency, world rank, custom timer & mobile support.",
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
    "100 clicks test",
    "cps test custom",
    "how fast can i click",
    "minecraft cps test",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "CPS Test - How Fast Can You Click?",
    description: "Test your clicks per second. I scored 6.60 CPS, can you beat me?",
    type: "website",
  },
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
