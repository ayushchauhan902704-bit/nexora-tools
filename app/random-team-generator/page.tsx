import type { Metadata } from "next";
import TeamClient from "./TeamClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/random-team-generator`;

export const metadata: Metadata = {
  title: "Random Team Generator - Free Online Team Maker | THE NEXORA TOOLS",
  description:
    "Create fair random teams online for sports, school, office, gaming, tournaments, and group activities. Enter names, choose teams, and generate balanced teams instantly.",
  keywords: [
    "random team generator",
    "random team maker",
    "team generator",
    "random group generator",
    "random teams",
    "make random teams",
    "team splitter",
    "random team generator online",
    "free random team generator",
    "sports team generator",
    "school team generator",
    "football team generator",
    "cricket team generator",
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
    title: "Random Team Generator - Free Online Team Maker",
    description:
      "Create balanced random teams instantly for sports, school, office, gaming, tournaments, and group activities.",
    siteName: "THE NEXORA TOOLS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Team Generator - Free Online Team Maker",
    description:
      "Create balanced random teams instantly for sports, school, office, gaming, tournaments, and group activities.",
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Random Team Generator",
  url: PAGE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  description:
    "A free online random team generator for creating balanced teams from a list of player names.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Random team generation",
    "Balanced team distribution",
    "Up to 200 players",
    "Multiple team counts",
    "Player reordering",
    "Player movement between teams",
    "Copy generated teams",
  ],
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
      name: "Random Team Generator",
      item: PAGE_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this Random Team Generator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can create random teams without signing up or creating an account.",
      },
    },
    {
      "@type": "Question",
      name: "How many players can I enter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can enter up to 200 player names.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use it for cricket or football teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The generator can be used for cricket, football, basketball, volleyball, gaming, school activities, office events, tournaments, and other group activities.",
      },
    },
    {
      "@type": "Question",
      name: "Will the teams have the same number of players?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When the player count is not evenly divisible by the number of teams, some teams will contain one additional player. The distribution is kept as even as possible.",
      },
    },
    {
      "@type": "Question",
      name: "Can I move a player after teams are created?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Select a player to move them to another team or change their position within their current team.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to install anything?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The tool works directly in a modern web browser on phones, tablets, and desktop devices.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
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

      <TeamClient />
    </>
  );
}
