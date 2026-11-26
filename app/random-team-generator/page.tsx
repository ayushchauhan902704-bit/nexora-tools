import type { Metadata } from "next";
import TeamClient from "./TeamClient";

export const metadata: Metadata = {
  title: "Random Team Generator - Free Online Team Maker by THE NEXORA TOOLS",
  description: "Free Random Team Generator - School, Cricket, Football, BGMI, Office ke liye random teams banao. Fair, Fast, No Sign-up.",
};

export default function Page() {
  return <TeamClient />;
}
