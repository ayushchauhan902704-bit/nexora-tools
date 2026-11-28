import type { Metadata } from "next";
import DateDifferenceCalculator from "./DateDifferenceCalculator";

export const metadata: Metadata = {
  title:
    "Date Difference Calculator - Days Between Dates, Weeks, Months & Years | NEXORA",

  description:
    "Calculate the exact difference between two dates in days, weeks, months and years. See every weekday count from Sunday to Saturday. Free, fast and private date calculator by NEXORA.",

  keywords: [
    "date difference calculator",
    "days between dates",
    "date calculator",
    "days calculator",
    "how many days between dates",
    "weeks between dates",
    "months between dates",
    "years between dates",
    "date duration calculator",
    "weekday calculator",
    "days between two dates",
    "calendar days calculator",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
      url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  alternates: {
    canonical:
      "https://nexora-tools-drab.vercel.app/date-difference-calculator",
  },

  openGraph: {
    title:
      "Date Difference Calculator - Days Between Dates | NEXORA",
    description:
      "Find the exact difference between two dates in days, weeks, months and years, with a complete Sunday-to-Saturday breakdown.",
    url:
      "https://nexora-tools-drab.vercel.app/date-difference-calculator",
    siteName: "NEXORA",
    type: "website",
    images: [
      {
        url: "https://nexora-tools-drab.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXORA Date Difference Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Date Difference Calculator - Days Between Dates | NEXORA",
    description:
      "Calculate exact days, weeks, months, years and weekday counts between any two dates.",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },

  category: "Utilities",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does a Date Difference Calculator calculate?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "It calculates the difference between two dates and shows the total days, weeks, calendar years, months and days, along with the number of Sundays, Mondays, Tuesdays, Wednesdays, Thursdays, Fridays and Saturdays in the selected period.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate the number of days between two dates?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Select a start date and an end date, then choose Calculate Difference. The calculator shows the total number of days and a complete breakdown of the date range.",
      },
    },
    {
      "@type": "Question",
      name: "Does the calculator count Sundays and Saturdays?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The result includes separate counts for all seven weekdays from Sunday through Saturday.",
      },
    },
    {
      "@type": "Question",
      name: "Does it calculate years, months and days exactly?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The calculator provides a calendar-based years, months and days difference rather than simply dividing the total number of days by an average month length.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Date Difference Calculator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The calculator is available free of charge and does not require registration.",
      },
    },
    {
      "@type": "Question",
      name: "Does the calculator work on phones?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The calculator is designed to work on modern mobile phones, tablets and desktop browsers.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate the Difference Between Two Dates",
  description:
    "Calculate the exact difference between two dates using the NEXORA Date Difference Calculator.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose the start date",
      text:
        "Select the date from which you want to start the calculation.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose the end date",
      text:
        "Select the date on which you want the calculation to end.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Calculate the difference",
      text:
        "Press Calculate Difference to see days, weeks, calendar years, months, days and weekday counts.",
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Date Difference Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  description:
    "A free browser-based date difference calculator for calculating days, weeks, calendar years, months, days and weekday counts between two dates.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Ayush Chauhan",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://nexora-tools-drab.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Date Difference Calculator",
      item:
        "https://nexora-tools-drab.vercel.app/date-difference-calculator",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <DateDifferenceCalculator />
    </>
  );
}
