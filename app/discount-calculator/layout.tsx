import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Discount Calculator - Final Price, Savings, Discount Percentage | NEXORA",
  description: "Free Discount Calculator by NEXORA - Calculate final price after discount, savings amount, sale price. Original price + discount % = final price. 100% Private, Free.",
  keywords: ["discount calculator", "final price calculator", "savings calculator", "sale price calculator", "discount percentage calculator", "NEXORA discount calculator"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/discount-calculator" },
  openGraph: {
    title: "Discount Calculator - Final Price & Savings Free | NEXORA",
    description: "Best Discount Calculator - Final Price, Savings, Sale Price. Free, Private, Accurate.",
    url: "https://nexora-tools-drab.vercel.app/discount-calculator",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "Discount Calculator - Final Price & Savings Free | NEXORA", description: "Calculate Final Price After Discount, You Save Amount. Free, Private." },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Discount Calculator?", acceptedAnswer: { "@type": "Answer", text: "Discount Calculator calculates final price after discount and savings amount. Formula Savings = Original * Discount% /100, Final = Original - Savings." } },
    { "@type": "Question", name: "How to calculate discount?", acceptedAnswer: { "@type": "Answer", text: "Enter original price 1000 and discount 20%. Savings 200, final 800." } },
    { "@type": "Question", name: "Is discount calculator free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, private, browser-based." } },
    { "@type": "Question", name: "How to find original price from discount?", acceptedAnswer: { "@type": "Answer", text: "Original = final / (1 - discount%/100)." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate Discount",
  step: [
    { "@type": "HowToStep", name: "Enter Original Price", text: "Enter MRP original price" },
    { "@type": "HowToStep", name: "Enter Discount %", text: "Enter discount percentage" },
    { "@type": "HowToStep", name: "Calculate", text: "Click Calculate to see final price and savings" }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Discount Calculator - NEXORA",
  description: "Free Discount Calculator - Final Price, Savings, Discount Percentage, Private Made in India",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ayush Chauhan" }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "Discount Calculator", item: "https://nexora-tools-drab.vercel.app/discount-calculator" }
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
