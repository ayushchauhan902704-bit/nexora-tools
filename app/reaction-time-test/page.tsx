import type { Metadata } from "next";
import ReactionClient from "./ReactionClient";

export const metadata: Metadata = {
  title: "Reaction Time Test - Check Your Reaction Speed | NEXORA",
  description:
    "Test your reaction time in milliseconds with this free online reaction time test. Complete 5 rounds and see your average, best, and worst reaction times.",
  keywords: [
    "reaction time test",
    "reaction test",
    "reaction speed test",
    "human reaction time test",
    "reaction time checker",
    "reaction test online",
    "reaction time ms test",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/reaction-time-test/",
  },
};

export default function ReactionTimeTestPage() {
  return <ReactionClient />;
}
