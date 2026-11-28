import type { Metadata } from "next";
import CountdownClient from "./CountdownClient";

const SITE_URL = "https://nexora-tools-drab.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Countdown Timer Online - Free Countdown Clock | NEXORA",

  description:
    "Create a free online countdown timer to any date and time. Count down to New Year, birthdays, exams, weddings, holidays and events with live days, hours, minutes and seconds.",

  keywords: [
    "countdown timer",
    "countdown timer online",
    "online countdown timer",
    "free countdown timer",
    "countdown clock",
    "online countdown clock",
    "countdown to date",
    "countdown to a date",
    "days countdown",
    "birthday countdown",
    "new year countdown",
    "exam countdown",
    "wedding countdown",
    "event countdown",
    "holiday countdown",
    "live countdown timer",
    "date countdown",
    "time countdown",
  ],

  alternates: {
    canonical: "/countdown-timer/",
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
    type: "website",
    url: `${SITE_URL}/countdown-timer/`,
    title: "Countdown Timer Online - Free Countdown Clock",
    description:
      "Create a free live countdown to any date, event, birthday, exam, wedding or holiday. Track remaining days, hours, minutes and seconds.",
    siteName: "NEXORA",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "Countdown Timer Online - Free Countdown Clock",
    description:
      "Create a free live countdown to any date, event, birthday, exam, wedding or holiday.",
  },

  category: "utilities",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/countdown-timer/#application`,
      name: "Countdown Timer",
      url: `${SITE_URL}/countdown-timer/`,
      description:
        "A free online countdown timer for counting down to any future date and time, including birthdays, New Year, exams, weddings, holidays and other events.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Works in modern web browsers.",
      isAccessibleForFree: true,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "NEXORA",
        url: SITE_URL,
      },
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/countdown-timer/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "NEXORA",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Countdown Timer",
          item: `${SITE_URL}/countdown-timer/`,
        },
      ],
    },

    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/countdown-timer/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a countdown timer?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "A countdown timer shows the amount of time remaining until a selected date and time.",
          },
        },
        {
          "@type": "Question",
          name: "Can I create a countdown to my birthday?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Enter your birthday date and time in the custom countdown section to create a live birthday countdown.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use this countdown timer for an exam or wedding?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. You can create countdowns for exams, weddings, holidays, vacations, launches, meetings and other future events.",
          },
        },
        {
          "@type": "Question",
          name: "Is this countdown timer free?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The countdown timer is free to use and does not require an account or sign-up.",
          },
        },
        {
          "@type": "Question",
          name: "Does the countdown timer work on mobile?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The countdown timer is designed to work on modern mobile phones, tablets and desktop browsers.",
          },
        },
        {
          "@type": "Question",
          name: "Can I share a countdown with someone?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Use the Share This Countdown button to create a shareable countdown link that can be opened on another device.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <CountdownClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
