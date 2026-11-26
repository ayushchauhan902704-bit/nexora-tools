import type { Metadata } from "next";
import ReactionClient from "./ReactionClient";

export const metadata: Metadata = {
  title: "Reaction Time Test - How Fast Are You? | NEXORA",
  description:
    "Free online Reaction Time Test. Test your reaction speed across 5 rounds with accurate millisecond timing, personal best, consistency, median score and detailed results.",
  keywords: [
    "reaction time test",
    "reaction test",
    "reaction speed test",
    "human benchmark reaction time",
    "reaction time checker",
    "ms reaction test",
    "click reaction test",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReactionTimeTestPage() {
  return <ReactionClient />;
}
