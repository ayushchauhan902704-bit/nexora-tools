import type { Metadata } from "next";
import ReactionClient from "./ReactionClient";

const SITE_URL =
  "https://thenexoratools.com";

const PAGE_URL =
  `${SITE_URL}/reaction-time-test`;

export const metadata: Metadata = {
  title:
    "Reaction Time Test - Free Reflex & Reaction Speed Test",

  description:
    "Test your reaction speed with a free 10-round reaction time challenge. Find the red target, avoid yellow traps, and measure your reaction time in milliseconds.",

  keywords: [
    "reaction time test",
    "reaction speed test",
    "reaction test",
    "reflex test",
    "human reaction time test",
    "reaction time checker",
    "ms reaction test",
    "click reaction test",
    "reflex speed test",
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical:
      PAGE_URL,
  },

  openGraph: {
    title:
      "Reaction Time Test - Free Reflex Test",

    description:
      "Find the red target, avoid yellow traps and measure your reaction speed in milliseconds.",

    url:
      PAGE_URL,

    siteName:
      "THE NEXORA TOOLS",

    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "Reaction Time Test - Free Reflex Test",

    description:
      "Measure your reaction speed with a 10-round target challenge.",
  },
};

const schema = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",

      "@id":
        `${PAGE_URL}#webpage`,

      url: PAGE_URL,

      name:
        "Reaction Time Test",

      description:
        "Free online reaction time and reflex speed test.",

      isPartOf: {
        "@id":
          `${SITE_URL}/#website`,
      },

      inLanguage: "en",
    },

    {
      "@type":
        "SoftwareApplication",

      name:
        "thenexoratools Reaction Time Test",

      applicationCategory:
        "GameApplication",

      operatingSystem:
        "Web",

      url:
        PAGE_URL,

      offers: {
        "@type":
          "Offer",

        price: "0",

        priceCurrency:
          "USD",
      },

      description:
        "A free browser-based reaction speed challenge with 20 targets, red targets, yellow traps and 10 timed rounds.",
    },

    {
      "@type":
        "FAQPage",

      mainEntity: [
        {
          "@type":
            "Question",

          name:
            "What is a reaction time test?",

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              "A reaction time test measures how quickly you respond to a visual stimulus. This test measures the time between the appearance of a red target and your touch or click.",
          },
        },

        {
          "@type":
            "Question",

          name:
            "How does the reaction time test work?",

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              "The challenge displays 20 circles. A red circle becomes the target and you must touch or click it as quickly as possible. Yellow circles are traps and touching one ends the challenge.",
          },
        },

        {
          "@type":
            "Question",

          name:
            "What is a good reaction time?",

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              "Reaction time varies by person and device. Lower milliseconds indicate a faster response. Results can also be affected by display latency, browser performance and the input method used.",
          },
        },

        {
          "@type":
            "Question",

          name:
            "Can I use this reaction test on a phone?",

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              "Yes. The test is designed for touchscreens as well as mouse input on desktop devices.",
          },
        },
      ],
    },
  ],
};

export default function ReactionTimeTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema,
            ),
        }}
      />

      <ReactionClient />
    </>
  );
}
