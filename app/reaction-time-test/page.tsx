import type { Metadata } from "next";
import ReactionClient from "./ReactionClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/reaction-time-test`;

export const metadata: Metadata = {
  title:
    "Reaction Time Test - Free Reaction Speed & Reflex Test",

  description:
    "Take a free online reaction time test. Measure your reaction speed in milliseconds across 10 rounds, avoid yellow traps, and compare your results.",

  keywords: [
    "reaction time test",
    "reaction speed test",
    "reaction test",
    "reflex test",
    "human reaction time test",
    "reaction time checker",
    "reaction time test online",
    "reaction speed test online",
    "reflex speed test",
    "click reaction test",
    "reaction test milliseconds",
    "ms reaction test",
  ],

  applicationName:
    "The Nexora Tools Reaction Time Test",

  category: "games",

  authors: [
    {
      name: "The Nexora Tools",
      url: SITE_URL,
    },
  ],

  creator: "The Nexora Tools",
  publisher: "The Nexora Tools",

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

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title:
      "Reaction Time Test - Free Reaction Speed & Reflex Test",

    description:
      "Measure your reaction speed in milliseconds with a free 10-round reaction time challenge.",

    url: PAGE_URL,

    siteName: "The Nexora Tools",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: `${SITE_URL}/og/reaction-time-test.jpg`,
        width: 1200,
        height: 630,
        alt:
          "Free Reaction Time Test - The Nexora Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Reaction Time Test - Free Reaction Speed Test",

    description:
      "Test your reflexes and measure your reaction speed in milliseconds.",

    images: [
      `${SITE_URL}/og/reaction-time-test.jpg`,
    ],
  },

  other: {
    "theme-color": "#ec4899",
  },
};

const schema = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebSite",

      "@id": `${SITE_URL}/#website`,

      url: SITE_URL,

      name: "The Nexora Tools",

      description:
        "Free online tools, calculators, converters and utility tools.",

      inLanguage: "en",
    },

    {
      "@type": "WebPage",

      "@id": `${PAGE_URL}#webpage`,

      url: PAGE_URL,

      name:
        "Reaction Time Test - Free Reaction Speed & Reflex Test",

      description:
        "Free online reaction time and reflex speed test.",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      breadcrumb: {
        "@id": `${PAGE_URL}#breadcrumb`,
      },

      inLanguage: "en",

      potentialAction: {
        "@type": "PlayAction",

        target: PAGE_URL,
      },
    },

    {
      "@type": "BreadcrumbList",

      "@id": `${PAGE_URL}#breadcrumb`,

      itemListElement: [
        {
          "@type": "ListItem",

          position: 1,

          name: "Home",

          item: SITE_URL,
        },

        {
          "@type": "ListItem",

          position: 2,

          name: "Reaction Time Test",

          item: PAGE_URL,
        },
      ],
    },

    {
      "@type": "SoftwareApplication",

      "@id": `${PAGE_URL}#application`,

      name:
        "The Nexora Tools Reaction Time Test",

      applicationCategory:
        "GameApplication",

      applicationSubCategory:
        "Reaction Speed Test",

      operatingSystem: "Web",

      url: PAGE_URL,

      isAccessibleForFree: true,

      offers: {
        "@type": "Offer",

        price: "0",

        priceCurrency: "USD",

        availability:
          "https://schema.org/InStock",
      },

      description:
        "A free browser-based reaction time test that measures visual response speed across 10 rounds.",

      featureList: [
        "10-round reaction time challenge",
        "Millisecond reaction timing",
        "Red visual targets",
        "Yellow trap targets",
        "Personal best tracking",
        "Reaction consistency score",
        "Mobile touchscreen support",
        "Desktop mouse and keyboard support",
        "No registration required",
      ],
    },

    {
      "@type": "FAQPage",

      "@id": `${PAGE_URL}#faq`,

      mainEntity: [
        {
          "@type": "Question",

          name:
            "What is a reaction time test?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "A reaction time test measures how quickly you respond to a visual stimulus. This test measures the time between the appearance of the red target and your touch or click.",
          },
        },

        {
          "@type": "Question",

          name:
            "How does this reaction speed test work?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "The test displays a grid of circles. A red circle becomes the target and you must tap or click it as quickly as possible. Yellow circles are traps, while green circles are inactive. The final score is based on 10 successful rounds.",
          },
        },

        {
          "@type": "Question",

          name:
            "What is a good reaction time?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "Reaction time varies between people and can be affected by the device, display latency, browser performance and input method. Lower milliseconds indicate a faster response.",
          },
        },

        {
          "@type": "Question",

          name:
            "Can I take the reaction time test on my phone?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "Yes. The test is designed for touchscreen phones and tablets as well as desktop devices using a mouse or keyboard.",
          },
        },

        {
          "@type": "Question",

          name:
            "Is the reaction time test free?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "Yes. The reaction time test is free to use and does not require registration or a paid subscription.",
          },
        },

        {
          "@type": "Question",

          name:
            "Does the test save my personal best?",

          acceptedAnswer: {
            "@type": "Answer",

            text:
              "When browser storage is available, your personal-best score is saved locally on the device so you can compare future attempts.",
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
          __html: JSON.stringify(schema),
        }}
      />

      <ReactionClient />
    </>
  );
}
