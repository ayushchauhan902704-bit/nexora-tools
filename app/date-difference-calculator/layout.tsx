import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Date Difference Calculator - Days Between Dates, Months, Years | NEXORA",
  description: "Free Date Difference Calculator by NEXORA - Calculate days between dates, months, years, age difference, weeks. Date calculator, days calculator. 100% Private, Accurate, Free.",
  keywords: ["date difference calculator", "days between dates", "date calculator", "days calculator", "age difference calculator", "NEXORA date calculator", "how many days between dates"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/date-difference-calculator" },
  openGraph: {
    title: "Date Difference Calculator - Days Between Dates Free | NEXORA",
    description: "Best Date Difference Calculator - Days, Months, Years Between Dates. Free, Accurate, Private.",
    url: "https://nexora-tools-drab.vercel.app/date-difference-calculator",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "Date Difference Calculator - Days Between Dates Free | NEXORA", description: "Calculate Days, Months, Years, Weeks Between Two Dates. Free, Accurate, Private." },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Date Difference Calculator?", acceptedAnswer: { "@type": "Answer", text: "Date Difference Calculator calculates number of days, months, years between two dates." } },
    { "@type": "Question", name: "How to calculate days between two dates?", acceptedAnswer: { "@type": "Answer", text: "Select From Date and To Date, click Calculate. Tool shows total days, months, years." } },
    { "@type": "Question", name: "Is date calculator free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, private, browser-based." } },
    { "@type": "Question", name: "Can it calculate age difference?", acceptedAnswer: { "@type": "Answer", text: "Yes, works as age difference calculator also." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Days Between Dates",
  step: [
    { "@type": "HowToStep", name: "Select From Date", text: "Select start date" },
    { "@type": "HowToStep", name: "Select To Date", text: "Select end date" },
    { "@type": "HowToStep", name: "Calculate", text: "Click Calculate to see days, months, years, weeks" }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Date Difference Calculator - NEXORA",
  description: "Free Date Difference Calculator - Days Between Dates, Months, Years, Age Difference, Private Made in India",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ayush Chauhan" }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "Date Difference Calculator", item: "https://nexora-tools-drab.vercel.app/date-difference-calculator" }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-61NV39S2VE" />
      <Script id="gtag">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-61NV39S2VE');`}</Script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
