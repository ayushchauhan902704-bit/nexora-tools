import type { Metadata } from "next";
import SpinWheelClient from "./SpinWheelClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/spin-wheel`;

export const metadata: Metadata = {
  title:
    "Spin Wheel Random Picker - Free Name Picker & Giveaway Tool | NEXORA",

  description:
    "Use this free Spin Wheel Random Picker to choose names, giveaway winners, teams, students, food, or random choices. No sign-up required. Fast and easy to use.",

  keywords: [
    "spin wheel",
    "spin wheel random picker",
    "random name picker",
    "random picker",
    "name picker wheel",
    "giveaway winner picker",
    "random wheel",
    "wheel spinner",
    "random choice picker",
    "free spin wheel",
  ],

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title:
      "Spin Wheel Random Picker - Free Name Picker & Giveaway Tool",
    description:
      "Spin a free random wheel to pick names, winners, teams, students, or random choices.",
    url: PAGE_URL,
    siteName: "NEXORA Tools",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Spin Wheel Random Picker - Free Name Picker",
    description:
      "Pick a random name, giveaway winner, team, student, or choice with a free online spin wheel.",
  },
};

export default function Page() {
  return <SpinWheelClient />;
}
