import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  // CLICKABLE TITLE - FREE + No Watermark sabse pehle
  title: "Background Remover FREE ✅ Remove BG in 1 Sec - HD, No Watermark | NEXORA",
  description: "✅ 100% FREE Background Remover - Remove background in 1 sec! Transparent, White Passport, Blue Visa. HD PNG, No Watermark, No Sign-Up, Unlimited. Best FREE remove.bg alternative!",
  keywords: ["background remover free", "remove background free no watermark", "remove bg free", "background remover free no watermark", "passport photo background remover free", "transparent background maker free", "remove.bg alternative free", "photo background changer free"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://thenexoratools.com/background-remover" },
  openGraph: {
    title: "Background Remover FREE ✅ 1 Sec - HD, No Watermark",
    description: "✅ 100% FREE - Remove background in 1 sec! HD PNG, No Watermark, Unlimited. Try Now!",
    url: "https://thenexoratools.com/background-remover",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://thenexoratools.com/og-background-remover.png", width: 1200, height: 630, alt: "Free Background Remover - No Watermark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Remover FREE ✅ - HD, No Watermark",
    description: "Remove background in 1 sec FREE! HD PNG, No Watermark.",
    images: ["https://thenexoratools.com/og-background-remover.png"],
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this background remover 100% free, no watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, unlimited. Best free alternative to remove.bg. Your photo never leaves your phone." } },
    { "@type": "Question", name: "How to make passport photo with white background free?", acceptedAnswer: { "@type": "Answer", text: "Upload photo, remove background, select White for passport, Blue for visa, then download HD PNG free." } },
    { "@type": "Question", name: "Is my photo safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% private. AI runs in your browser, photo never goes to any server." } },
    { "@type": "Question", name: "Does it work on iPhone?", acceptedAnswer: { "@type": "Answer", text: "Yes, works on iPhone, Android, Laptop. No app needed, 100% free." } },
    { "@type": "Question", name: "Will quality remain HD?", acceptedAnswer: { "@type": "Answer", text: "Yes, HD PNG in original quality, no blur, no watermark." } },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "NEXORA Background Remover - FREE",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any - iPhone, Android, Windows",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "2841" },
  description: "100% Free Background Remover. Remove background in 1 sec. HD PNG, No Watermark, Unlimited, Private.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://thenexoratools.com/" },
          { "@type": "ListItem", position: 2, name: "Background Remover", item: "https://thenexoratools.com/background-remover" }
        ]
      }) }} />
      <BackgroundRemoverClient />
    </>
  );
}
