import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const metadata: Metadata = {
  title: "Passport Photo Maker Online Free | 20KB, 50KB & Visa Photo | NEXORA",
  description:
    "Create passport size, visa, SSC 20KB and UPSC 50KB photos online for free. Set custom photo dimensions and file size. HD output, no watermark, and browser-based processing.",
  keywords: [
    "passport photo maker",
    "passport size photo maker",
    "passport photo online free",
    "passport photo 20kb",
    "20kb photo maker",
    "20kb photo kaise banaye",
    "50kb photo maker",
    "50kb photo kaise banaye",
    "visa photo maker",
    "visa photo online",
    "ssc photo 20kb",
    "upsc photo 50kb",
    "passport photo resize",
    "passport photo size",
    "photo resize for government form",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  creator: "NEXORA",
  publisher: "NEXORA",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: "https://nexora-tools.com/passport-size-photo-maker",
  },
  openGraph: {
    title: "Passport Photo Maker Online Free | 20KB, 50KB & Visa Photo",
    description:
      "Create passport, visa, SSC 20KB and UPSC 50KB photos online for free. Custom size and file-size options with no watermark.",
    url: "https://nexora-tools.com/passport-size-photo-maker",
    type: "website",
    siteName: "NEXORA",
    locale: "en_IN",
    images: [
      {
        url: "/og-passport.jpg",
        width: 1200,
        height: 630,
        alt: "NEXORA Passport Photo Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport Photo Maker Online Free | NEXORA",
    description:
      "Create passport, visa, SSC 20KB and UPSC 50KB photos online for free with custom dimensions and file size.",
    images: ["/og-passport.jpg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I make a passport size photo online?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Upload your photo, select the required passport or document size, and download the processed JPG. The tool works directly in your browser and is free to use.",
      },
    },
    {
      "@type": "Question",
      name: "How can I make a 20KB photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Select an available 20KB option such as SSC, IBPS or Railway, or enter 20 in the custom KB field. The tool compresses the image to stay within the selected target size.",
      },
    },
    {
      "@type": "Question",
      name: "How can I make a 50KB photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Select the UPSC or Bank Form option, or enter 50 in the custom KB field. The tool compresses the image to stay within the selected target size.",
      },
    },
    {
      "@type": "Question",
      name: "Can I enter my own photo dimensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. You can enter a custom width and height in pixels. The supported custom range is 50 to 2000 pixels for each dimension.",
      },
    },
    {
      "@type": "Question",
      name: "Is my uploaded photo private?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Image processing is performed in your browser. The tool does not need to upload your photo to a server for normal processing.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <PassportClient />
    </>
  );
}
