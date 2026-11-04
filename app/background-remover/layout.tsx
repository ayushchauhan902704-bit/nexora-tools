import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Background Remover - Remove Background Free HD No Watermark | NEXORA",
  description: "Free AI Background Remover by NEXORA - Remove image background in 1 sec. Transparent, White, Blue, Red. HD PNG, No watermark, 100% private browser-based. Best for passport, products.",
  keywords: ["background remover", "remove background free", "ai background remover no watermark", "transparent background maker", "passport photo background remover", "NEXORA background remover", "remove bg free", "background remover online", "photo background changer", "white background maker"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/background-remover" },
  openGraph: {
    title: "Background Remover - Remove Background Free HD | NEXORA",
    description: "Remove image background in 1 sec. Transparent, White, Blue. HD PNG, No watermark, Private.",
    url: "https://nexora-tools-drab.vercel.app/background-remover",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "Background Remover - Free HD No Watermark | NEXORA", description: "Remove image background in 1 sec. Transparent, White, Blue. HD PNG, No watermark, Private." },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is Background Remover free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, private. Photo never leaves phone, browser-based AI." } },
    { "@type": "Question", name: "Does it work for passport photo?", acceptedAnswer: { "@type": "Answer", text: "Yes, select White for passport, Blue for visa, Red for official, Transparent for products." } },
    { "@type": "Question", name: "HD quality?", acceptedAnswer: { "@type": "Answer", text: "Yes, download HD PNG, original quality, no watermark." } },
    { "@type": "Question", name: "iPhone support?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove Background",
  step: [
    { "@type": "HowToStep", name: "Upload Photo", text: "Click or drag photo" },
    { "@type": "HowToStep", name: "AI Remove", text: "AI removes background automatically in 1 sec" },
    { "@type": "HowToStep", name: "Choose Color and Download", text: "Choose Transparent White Blue Red and download HD PNG" }
  ]
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Background Remover - NEXORA",
  description: "Free AI background remover - Transparent, White, Blue, Red. HD PNG no watermark private",
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
    { "@type": "ListItem", position: 2, name: "Background Remover", item: "https://nexora-tools-drab.vercel.app/background-remover" }
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
