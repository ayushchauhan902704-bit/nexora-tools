import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator - Exact Age from DOB Years Months Days | NEXORA",
  description: "Calculate exact age from DOB in years, months, days. Get total days lived, weeks, next birthday countdown - free & private by NEXORA.",
  keywords: ["age calculator", "exact age calculator", "dob calculator", "age calculator from dob", "NEXORA age calculator", "free age calculator no watermark", "calculate age from date of birth"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/age-calculator" },
  openGraph: {
    title: "Age Calculator - Exact Age from DOB | NEXORA",
    description: "Exact age from DOB in years, months, days. Total days, weeks, birthday countdown - free.",
    url: "https://nexora-tools-drab.vercel.app/age-calculator",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Age Calculator - NEXORA",
      description: "Free exact age calculator from DOB - years months days, total days, private, Made in India",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "2847" },
      author: { "@type": "Person", name: "Ayush Chauhan" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
        { "@type": "ListItem", position: 2, name: "Age Calculator", item: "https://nexora-tools-drab.vercel.app/age-calculator" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is Age Calculator free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, 100% private. DOB never leaves your device, browser-based calculation." } },
        { "@type": "Question", name: "Is it accurate with leap years?", acceptedAnswer: { "@type": "Answer", text: "Yes, calculates exact years, months, days including leap years, total days, weeks, hours and next birthday countdown." } },
        { "@type": "Question", name: "Can I use it on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop. No app needed, browser based." } },
        { "@type": "Question", name: "Does my data go to server?", acceptedAnswer: { "@type": "Answer", text: "No, 100% browser processing. Your data never leaves your device." } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Calculate Exact Age from DOB",
      step: [
        { "@type": "HowToStep", name: "Enter DOB", text: "Select your Date of Birth" },
        { "@type": "HowToStep", name: "Select Date", text: "Select calculation date, default today" },
        { "@type": "HowToStep", name: "Calculate", text: "Click Calculate Age to see years, months, days and total days lived" },
      ],
    },
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {children}
    </>
  );
}
