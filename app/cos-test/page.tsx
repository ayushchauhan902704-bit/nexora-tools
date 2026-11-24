import type { Metadata } from "next";
import CPSTestClient from "./cpsclient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | NEXORA Tools",
  description:
    "Free CPS Test - Test your clicking speed. Check how many clicks per second you can do in 1, 5, 10 or 30 seconds. Works on mobile & desktop.",
  keywords: ["cps test", "clicks per second", "click speed test", "cps counter", "nexora tools"],
  openGraph: {
    title: "CPS Test - Clicks Per Second Test",
    description: "Test your clicking speed. How many clicks per second can you do?",
    type: "website",
  },
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
