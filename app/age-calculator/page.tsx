import type { Metadata } from "next";
import AgeCalculator from "./AgeCalculator";
const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/age-calculator`;
export const metadata: Metadata = {
  title:
    "Age Calculator Online – Calculate Exact Age in Years, Months & Days | NEXORA",
  description:
    "Free online age calculator to calculate your exact age in years, months, days, weeks, hours, minutes and seconds. Find your next birthday and days remaining instantly.",
  keywords: [
    "age calculator",
    "age calculator online",
    "calculate age",
    "exact age calculator",
    "age in years months days",
    "age in days",
    "age in hours",
    "age in minutes",
    "age in seconds",
    "birthday calculator",
    "next birthday calculator",
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
      "Age Calculator Online – Calculate Your Exact Age | NEXORA",
    description:
      "Calculate your exact age in years, months, days, weeks, hours, minutes and seconds. Find your next birthday instantly.",
    siteName: "NEXORA",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Age Calculator Online – Calculate Your Exact Age | NEXORA",
    description:
      "Calculate your exact age in years, months, days, weeks, hours, minutes and seconds.",
  },
};
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NEXORA Age Calculator",
  url: PAGE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  description:
    "Free online age calculator for calculating exact age in years, months, days, weeks, hours, minutes and seconds.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Exact age in years, months and days",
    "Age in seconds",
    "Age in minutes",
    "Age in hours",
    "Age in days",
    "Age in weeks",
    "Age in months",
    "Age in years",
    "Next birthday date",
    "Birthday countdown",
  ],
};
export default function AgeCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AgeCalculator />
    </>
  );
}
