import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  title: "Background Remover - Remove Background in 1 Sec, Free HD No Watermark | NEXORA",
  description: "Remove background from photo in 1 second. Transparent, White Passport, Blue Visa, Red background. Free, HD PNG, No Watermark, 100% Private - Photo never leaves your phone.",
  keywords: ["background remover", "remove background", "remove bg", "background remover free", "passport photo background remover", "transparent background maker", "remove.bg alternative", "photo background change"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/background-remover" },
  openGraph: {
    title: "Free Background Remover - 1 Sec, HD, No Watermark | NEXORA",
    description: "Remove background in 1 sec. Transparent, White, Blue, Red. Free HD PNG.",
    url: "https://nexora-tools.com/background-remover",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is background remover free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, unlimited. Photo never leaves your phone." } },
    { "@type": "Question", name: "How to make passport photo background white?", acceptedAnswer: { "@type": "Answer", text: "Upload photo, remove background, select White for passport, Blue for visa, then download HD PNG." } },
    { "@type": "Question", name: "Is my photo safe?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% private. AI runs in your browser, photo never goes to server." } },
    { "@type": "Question", name: "Does it work on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop. No app needed." } },
    { "@type": "Question", name: "Will quality remain HD?", acceptedAnswer: { "@type": "Answer", text: "Yes, HD PNG original quality, no blur, no watermark." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "How to Remove Background",
  step: [
    { "@type": "HowToStep", text: "Upload your JPG, PNG or WebP photo." },
    { "@type": "HowToStep", text: "AI automatically removes background in 1 second." },
    { "@type": "HowToStep", text: "Choose Transparent, White, Blue or Red and Download HD PNG." },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools.com/" },
          { "@type": "ListItem", position: 2, name: "Background Remover", item: "https://nexora-tools.com/background-remover" }
        ]
      }) }} />
      <BackgroundRemoverClient />
    </>
  );
}
