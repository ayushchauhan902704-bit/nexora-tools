import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Character Counter - Count Characters With & Without Spaces | NEXORA",
  description: "Free Character Counter by NEXORA - Count characters with spaces, without spaces, words, sentences instantly. Real-time, 100% private, free. Best for essays, Twitter, Instagram.",
  keywords: ["character counter", "character counter with spaces", "character counter without spaces", "count characters", "word counter", "NEXORA character counter", "letter counter", "twitter character counter"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/character-counter" },
  openGraph: {
    title: "Character Counter - With & Without Spaces Free | NEXORA",
    description: "Best Character Counter - Count Characters With Spaces, Without Spaces, Words, Letters Free, Private.",
    url: "https://nexora-tools-drab.vercel.app/character-counter",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "Character Counter - With & Without Spaces Free | NEXORA", description: "Count Characters With Spaces, Without Spaces, Words, Letters Free, Private." },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Character Counter?", acceptedAnswer: { "@type": "Answer", text: "Character Counter counts total characters in your text with spaces and without spaces, also words, sentences." } },
    { "@type": "Question", name: "How to count characters with and without spaces?", acceptedAnswer: { "@type": "Answer", text: "Paste text into NEXORA Character Counter. It instantly shows Characters with spaces and without spaces. Example Hello World = 11 with spaces, 10 without." } },
    { "@type": "Question", name: "Is character counter free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, private, browser-based, no data leaves phone." } },
    { "@type": "Question", name: "Does it work on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Count Characters",
  step: [
    { "@type": "HowToStep", name: "Paste Text", text: "Paste or type your text" },
    { "@type": "HowToStep", name: "See Count", text: "See characters with spaces and without spaces instantly" },
    { "@type": "HowToStep", name: "Use Result", text: "Copy count for essays, Twitter, Instagram" }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Character Counter - NEXORA",
  description: "Free Character Counter - Count Characters With & Without Spaces, Words, Letters, Private Made in India",
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
    { "@type": "ListItem", position: 2, name: "Character Counter", item: "https://nexora-tools-drab.vercel.app/character-counter" }
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
