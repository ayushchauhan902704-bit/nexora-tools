import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | NEXORA",
  description:
    "Free CPS Test to measure your clicks per second. Test your clicking speed in 1, 5, 10, or 30 seconds with live CPS, score history, and personal best.",
  keywords: [
    "cps test",
    "clicks per second test",
    "click speed test",
    "click test",
    "cps tester",
    "mouse click test",
    "clicking speed test",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/cps-test/",
  },
  openGraph: {
    title: "CPS Test - Clicks Per Second Test | NEXORA",
    description:
      "Test how fast you can click. Free 1, 5, 10, and 30 second CPS test with live results.",
    type: "website",
  },
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
