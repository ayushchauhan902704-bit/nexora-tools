import type { Metadata } from "next";
import BackgroundRemoverClientEnglish from "./BackgroundRemoverClientEnglish";

export const metadata: Metadata = {
  title: "Background Remover - Remove Background in 1 Sec, Free HD No Watermark | NEXORA",
  description: "Remove background from any photo in 1 second. Get Transparent, White Passport, Blue Visa, Red background. 100% Free, HD PNG, No Watermark, 100% Private - Your photo never leaves your device.",
  keywords: [
    "background remover",
    "remove background",
    "remove bg",
    "background remover free",
    "remove background from image online free",
    "transparent background maker",
    "passport photo background remover",
    "white background photo maker",
    "remove.bg alternative free",
    "photo background changer",
    "remove background online no watermark",
    "ai background remover",
    "change photo background to white",
    "product photo background remover",
    "background eraser online"
  ],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "https://nexora-tools.com/background-remover/english",
    languages: {
      "en": "https://nexora-tools.com/background-remover/english",
      "hi": "https://nexora-tools.com/background-remover/hindi",
      "fr": "https://nexora-tools.com/background-remover/french",
    },
  },
  openGraph: {
    title: "Free Background Remover - 1 Sec, HD, No Watermark | NEXORA",
    description: "Remove background in 1 sec. Transparent, White, Blue, Red. Free HD PNG, No Watermark, 100% Private.",
    url: "https://nexora-tools.com/background-remover/english",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Background Remover - 1 Sec, HD, No Watermark",
    description: "Remove background in 1 sec. Free, HD PNG, No Watermark.",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this background remover free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, unlimited. Your photo never leaves your device." } },
    { "@type": "Question", name: "How to make a passport photo with white background?", acceptedAnswer: { "@type": "Answer", text: "Upload your photo, remove background, select White for passport, Blue for visa, then download HD PNG." } },
    { "@type": "Question", name: "Is my photo safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% private. AI runs in your browser, your photo never goes to any server." } },
    { "@type": "Question", name: "Does it work on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, and Laptop. No app needed." } },
    { "@type": "Question", name: "Will quality remain HD?", acceptedAnswer: { "@type": "Answer", text: "Yes, HD PNG in original quality, no blur, no watermark." } },
    { "@type": "Question", name: "What is the best free alternative to remove.bg?", acceptedAnswer: { "@type": "Answer", text: "NEXORA is the best free alternative to remove.bg - unlimited, no watermark, HD PNG, and 100% private." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "How to Remove Background From Photo",
  step: [
    { "@type": "HowToStep", text: "Upload your JPG, PNG or WebP photo." },
    { "@type": "HowToStep", text: "AI automatically removes background in 1 second." },
    { "@type": "HowToStep", text: "Choose Transparent, White, Blue or Red background and Download HD PNG." },
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
          { "@type": "ListItem", position: 2, name: "Background Remover", item: "https://nexora-tools.com/background-remover" },
          { "@type": "ListItem", position: 3, name: "English", item: "https://nexora-tools.com/background-remover/english" }
        ]
      }) }} />
      <BackgroundRemoverClientEnglish />
    </>
  );
}
