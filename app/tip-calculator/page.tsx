import type { Metadata } from "next";
import TipClient from "./TipClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/tip-calculator`;

export const metadata: Metadata = {
  title: "Tip Calculator - Calculate Tip, Bill & Split Payment | NEXORA",
  description:
    "Free online tip calculator to calculate tips, total bill, change, amount due and split payments between multiple people. Supports dollar, euro, pound and rupee symbols.",
  keywords: [
    "tip calculator",
    "tip calculator online",
    "restaurant tip calculator",
    "bill tip calculator",
    "split bill calculator",
    "tip percentage calculator",
    "calculate tip",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tip Calculator - Calculate Tip, Bill & Split Payment | NEXORA",
    description:
      "Calculate tips, total bills, change, amount due and split payments instantly with NEXORA's free online tip calculator.",
    url: PAGE_URL,
    siteName: "NEXORA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tip Calculator - NEXORA",
    description:
      "Free tip calculator for restaurants, bills, change and split payments.",
  },
};

const faqItems = [
  {
    question: "Is this tip calculator free?",
    answer:
      "Yes. NEXORA's tip calculator is free to use and does not require registration or a paid subscription.",
  },
  {
    question: "How is the tip calculated?",
    answer:
      "The tip is calculated by multiplying the bill amount by the selected tip percentage and dividing the result by 100.",
  },
  {
    question: "Can I split the bill between multiple people?",
    answer:
      "Yes. You can increase the number of people and the calculator will show the total amount each person should pay, including their share of the tip.",
  },
  {
    question: "Can I calculate change?",
    answer:
      "Yes. Enter the amount paid. If the payment is greater than the bill plus tip, the calculator shows the remaining change.",
  },
  {
    question: "Can I see the amount still owed?",
    answer:
      "Yes. If the amount paid is less than the bill plus tip, the calculator shows the remaining amount due.",
  },
  {
    question: "Does the tip calculator work on mobile?",
    answer:
      "Yes. The calculator works on smartphones, tablets and desktop browsers.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. The calculator works directly in a modern web browser.",
  },
];

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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NEXORA Tip Calculator",
  url: PAGE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  description:
    "A free online tip calculator for calculating tips, total bills, change, amount due and split payments.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function TipCalculatorPage() {
  return (
    <>
      <TipClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  );
}
