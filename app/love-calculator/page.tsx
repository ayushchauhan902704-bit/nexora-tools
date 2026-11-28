import type { Metadata } from "next";
import LoveCalculatorClient from "./LoveCalculatorClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/love-calculator`;

const faqItems = [
  {
    question: "Is the Love Calculator free?",
    answer:
      "Yes. The Love Calculator is free to use and does not require an account.",
  },
  {
    question: "How does the Love Calculator calculate the percentage?",
    answer:
      "The calculator uses the two entered names and selected gender inputs to generate a fun match percentage. It is an entertainment tool, not a scientific compatibility test.",
  },
  {
    question: "Does the Love Calculator store my names?",
    answer:
      "The calculation is performed in your browser. The tool does not require you to create an account or submit your names to use the calculator.",
  },
  {
    question: "Can I use the Love Calculator on my phone?",
    answer:
      "Yes. The Love Calculator is designed to work on phones, tablets, and desktop browsers.",
  },
  {
    question: "Is the love percentage scientifically accurate?",
    answer:
      "No. The percentage is generated for entertainment and should not be treated as a scientific measurement of love or relationship compatibility.",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title:
    "Love Calculator by Name – Love Match Percentage | thenexoratools",

  description:
    "Use the free Love Calculator to compare two names and get a fun love match percentage with a romantic result. No sign-up required.",

  keywords: [
    "love calculator",
    "love calculator by name",
    "love percentage calculator",
    "love match calculator",
    "love compatibility calculator",
    "name love calculator",
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
    type: "website",
    url: PAGE_URL,
    title:
      "Love Calculator by Name – Love Match Percentage | thenexoratools",
    description:
      "Compare two names and discover a fun love match percentage with the free Love Calculator from thenexoratools.",
    siteName: "thenexoratools",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Love Calculator by Name – Love Match Percentage | thenexoratools",
    description:
      "Compare two names and discover your fun love match percentage.",
  },

  applicationName: "thenexoratools",

  category: "entertainment",

  creator: "thenexoratools",

  publisher: "thenexoratools",
};

export default function LoveCalculatorPage() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Love Calculator",
    url: PAGE_URL,
    description:
      "A free online love calculator that generates a fun love match percentage from two names.",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires a modern web browser with JavaScript enabled.",
    isAccessibleForFree: true,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "thenexoratools",
      url: SITE_URL,
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Love Calculator",
        item: PAGE_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <LoveCalculatorClient />

      <section
        style={{
          width: "min(760px, calc(100% - 28px))",
          margin: "0 auto",
          padding: "0 0 50px",
          color: "#5f4b54",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #fce7f3",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              color: "#24151d",
              fontSize: "16px",
              fontWeight: 900,
            }}
          >
            Love Calculator by Name
          </h2>

          <p
            style={{
              margin: "0",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            The thenexoratools Love Calculator is a simple
            entertainment tool for comparing two names and
            generating a fun love match percentage. Enter the
            names, select the gender for each person, and
            calculate the result instantly in your browser.
          </p>

          <h2
            style={{
              margin: "20px 0 8px",
              color: "#24151d",
              fontSize: "15px",
              fontWeight: 900,
            }}
          >
            Is the Love Calculator accurate?
          </h2>

          <p
            style={{
              margin: "0",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            The result is intended for fun and entertainment.
            A name-based percentage cannot scientifically
            measure real-world love, relationship quality, or
            compatibility.
          </p>

          <h2
            style={{
              margin: "20px 0 8px",
              color: "#24151d",
              fontSize: "15px",
              fontWeight: 900,
            }}
          >
            Love Calculator FAQ
          </h2>

          <div
            style={{
              display: "grid",
              gap: "9px",
            }}
          >
            {faqItems.map((item) => (
              <details
                key={item.question}
                style={{
                  border: "1px solid #fce7f3",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  background: "#fff8fc",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#6d2348",
                    fontSize: "11px",
                    fontWeight: 850,
                  }}
                >
                  {item.question}
                </summary>

                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#76636c",
                    fontSize: "10.5px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
