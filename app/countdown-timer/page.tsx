import type { Metadata } from "next";
import CountdownClient from "./CountdownClient";

export const metadata: Metadata = {
  title: "Countdown Timer Online - Free Countdown Clock | NEXORA",
  description:
    "Free online countdown timer and countdown clock. Count down to New Year, birthdays, exams, weddings, holidays and any date with live days, hours, minutes and seconds.",
  keywords: [
    "countdown timer",
    "countdown timer online",
    "online countdown",
    "countdown clock",
    "free countdown timer",
    "countdown timer to date",
    "days countdown",
    "birthday countdown",
    "new year countdown",
    "exam countdown",
    "wedding countdown",
    "event countdown",
    "holiday countdown",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Countdown Timer Online - Free Countdown Clock",
    description:
      "Create a free live countdown to any date, event, birthday, exam, wedding or holiday.",
    type: "website",
  },
};

export default function Page() {
  return <CountdownClient />;
}
