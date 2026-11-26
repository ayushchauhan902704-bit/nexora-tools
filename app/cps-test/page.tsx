import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/cps-test`;

export const metadata: Metadata = {
  title:
    "CPS Test – Clicks Per Second Test | Free Click Speed Test",

  description:
    "Free CPS Test to measure clicks per second. Try 1, 5, 10, 30 or 60 second tests, a 100-click challenge, custom timer, peak CPS, consistency and personal best tracking.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title:
      "CPS Test – Clicks Per Second Test",
    description:
      "Test your clicking speed with timed CPS tests, a 100-click challenge, peak CPS, consistency and personal best tracking.",
    url: PAGE_URL,
    siteName: "THE NEXORA TOOLS",
    type: "website",
  },

  twitter: {
    card: "summary",
    title:
      "CPS Test – Clicks Per Second Test",
    description:
      "Free online CPS and click speed test with timed challenges and personal best tracking.",
  },
};

const schema = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name:
        "CPS Test – Clicks Per Second Test",
      description:
        "Free online CPS test for measuring clicks per second.",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      inLanguage: "en",
    },

    {
      "@type": "SoftwareApplication",
      name: "thenexoratools CPS Test",
      applicationCategory:
        "GameApplication",
      operatingSystem: "Web",
      url: PAGE_URL,

      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },

      description:
        "A free browser-based clicks per second test with timed modes and a 100-click challenge.",
    },

    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does CPS mean?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CPS stands for Clicks Per Second. It measures the average number of clicks made during one second of a test.",
          },
        },

        {
          "@type": "Question",
          name: "How is CPS calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "For a timed test, CPS is calculated by dividing the total number of clicks by the test duration in seconds. The 100 Click Challenge calculates CPS from the time required to complete 100 clicks.",
          },
        },

        {
          "@type": "Question",
          name: "Can I use the CPS Test on a phone?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The CPS Test supports touch input on compatible mobile browsers as well as mouse input on desktop devices.",
          },
        },

        {
          "@type": "Question",
          name: "What is the 100 Click Challenge?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "The 100 Click Challenge measures how quickly you can complete 100 clicks and calculates your completion time and CPS.",
          },
        },
      ],
    },
  ],
};

export default function CPSTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <CPSTestClient />
    </>
  );
}
