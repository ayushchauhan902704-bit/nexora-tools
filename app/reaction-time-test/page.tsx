import type { Metadata } from "next";
import ReactionClient from "./ReactionClient";

export const metadata: Metadata = {
  title: "Reaction Time Test - How Fast Can You React? | NEXORA",
  description:
    "Free Reaction Time Test - Test your reflexes in 5 rounds. Get accurate average, best time, graph, world rank & mobile support. Check if you react like a pro gamer.",
  keywords: [
    "reaction time test",
    "reflex test",
    "reaction speed test",
    "human reaction time test",
    "average reaction time",
    "gamer reaction test",
    "click reaction test",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Reaction Time Test - How Fast Can You React?",
    description: "My average reaction time is 240ms, can you beat me?",
    type: "website",
  },
};

export default function ReactionTimePage() {
  return <ReactionClient />;
}
