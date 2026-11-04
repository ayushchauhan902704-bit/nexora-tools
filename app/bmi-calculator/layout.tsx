import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BMI Calculator - Free Body Mass Index Calculator Ideal Weight | NEXORA",
  description: "Free BMI Calculator by NEXORA - Check Body Mass Index, ideal weight range, health category. Enter height cm weight kg. 100% private, accurate, free.",
  keywords: ["bmi calculator", "bmi calculator kg cm", "ideal weight calculator", "body mass index calculator", "NEXORA bmi calculator free", "bmi calculator india", "bmi chart", "healthy bmi range"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/bmi-calculator" },
  openGraph: {
    title: "BMI Calculator - Free & Accurate | NEXORA",
    description: "Calculate your BMI instantly. Check ideal weight and health status. Private, free.",
    url: "https://nexora-tools-drab.vercel.app/bmi-calculator",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "BMI Calculator - Free & Accurate | NEXORA", description: "Calculate your BMI instantly. Check ideal weight and health status." },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is BMI Calculator?", acceptedAnswer: { "@type": "Answer", text: "BMI Calculator calculates Body Mass Index using height in cm and weight in kg. Formula BMI = weight(kg) / height(m)²." } },
    { "@type": "Question", name: "What is ideal BMI range?", acceptedAnswer: { "@type": "Answer", text: "Ideal BMI is 18.5 to 24.9 for adults. Below 18.5 Underweight, 25-29.9 Overweight, 30+ Obese." } },
    { "@type": "Question", name: "Is BMI data private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% private, browser-based, no data leaves phone." } },
    { "@type": "Question", name: "Does it work on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop." } },
    { "@type": "Question", name: "Is this medical advice?", acceptedAnswer: { "@type": "Answer", text: "No, for information only. Consult your doctor for health advice." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Calculate BMI",
  step: [
    { "@type": "HowToStep", name: "Enter Height", text: "Enter height in cm" },
    { "@type": "HowToStep", name: "Enter Weight", text: "Enter weight in kg" },
    { "@type": "HowToStep", name: "Calculate", text: "Click Calculate BMI to see BMI, category and ideal weight" }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BMI Calculator - NEXORA",
  description: "Free BMI Calculator to check Body Mass Index and ideal weight private Made in India",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ayush Chauhan" }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "BMI Calculator", item: "https://nexora-tools-drab.vercel.app/bmi-calculator" }
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
