import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

export const metadata: Metadata = {
  title: "CPS Test - Clicks Per Second Test | Check Your Click Speed | Nexora Tools",
  description: "Free CPS Test - Check how fast you can click in 1, 5, 10 seconds. Live CPS graph, butterfly click test, best score. No sign up, 100% Free for Minecraft & BGMI gamers.",
};

export default function CPSTestPage() {
  return <CPSTestClient />;
}
