import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | NEXORA Tools",
  description:
    "Free CPS Test - Test your clicking speed. Check how many clicks per second you can do in 1, 5, 10 or 30 seconds. Works on mobile & desktop.",
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
