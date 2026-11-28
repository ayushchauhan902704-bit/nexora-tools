import type { Metadata } from "next";
import PercentageCalculator from "./PercentageCalculator";

export const metadata: Metadata = {
  title:
    "Percentage Calculator - Calculate Percentages, Increase & Decrease | NEXORA",

  description:
    "Free percentage calculator to calculate X% of Y, find what percentage one number is of another, solve reverse percentages, and calculate percentage increases or decreases.",

  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage calculator online",
    "calculate percentage",
    "percentage increase calculator",
    "percentage decrease calculator",
    "reverse percentage calculator",
    "what percentage is X of Y",
    "percentage of a number",
  ],

  alternates: {
    canonical: "/percentage-calculator",
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
      "Percentage Calculator - Calculate Percentages | NEXORA",

    description:
      "Calculate percentages, reverse percentages, percentage increases and decreases with NEXORA's free online percentage calculator.",

    url: "/percentage-calculator",
    siteName: "NEXORA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Percentage Calculator - Calculate Percentages | NEXORA",

    description:
      "Free online percentage calculator for everyday percentage calculations.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Percentage Calculator",
      url: "https://nexora-tools-drab.vercel.app/percentage-calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Free online percentage calculator for calculating percentages, reverse percentages, percentage increases and decreases.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },

    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I calculate 10% of 470?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Enter 10 as the percentage and 470 as the amount. The result is 47.",
          },
        },
        {
          "@type": "Question",
          name: "What is the easiest way to find a percentage?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Use the percentage of amount mode. Enter the percentage and the amount to get the result instantly.",
          },
        },
        {
          "@type": "Question",
          name: "If 40 is 10%, what is 90%?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "The answer is 360. The calculator first finds the full amount and then calculates 90% of it.",
          },
        },
        {
          "@type": "Question",
          name: "Can I calculate discounts?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Select Increase / Decrease, choose Decrease, and enter the original amount and discount percentage.",
          },
        },
        {
          "@type": "Question",
          name: "Does the percentage calculator work on mobile?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The calculator is designed to work on phones, tablets and desktop browsers.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <PercentageCalculator />
    </>
  );
}
