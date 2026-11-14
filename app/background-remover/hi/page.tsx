import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL =
  "https://thenexoratools.com";

const PAGE_URL =
  `${SITE_URL}/background-remover/hi/`;

export const metadata: Metadata = {
  title:
    "Background Remover Free – Photo Ka Background Remove Karein | NEXORA",

  description:
    "NEXORA se photo ka background free mein remove karein. Transparent PNG ya white, blue aur red background banayein. No watermark aur no sign-up.",

  keywords: [
    "background remover",
    "photo ka background remove",
    "image ka background hataye",
    "background remover free",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview":
      "large",
  },

  alternates: {
    canonical:
      PAGE_URL,

    languages: {
      en:
        `${SITE_URL}/background-remover/`,
      hi:
        `${SITE_URL}/background-remover/hi/`,
      es:
        `${SITE_URL}/background-remover/es/`,
      fr:
        `${SITE_URL}/background-remover/fr/`,
      de:
        `${SITE_URL}/background-remover/de/`,
      pt:
        `${SITE_URL}/background-remover/pt/`,
      "x-default":
        `${SITE_URL}/background-remover/`,
    },
  },

  openGraph: {
    title:
      "Background Remover Free – Photo Ka Background Remove Karein | NEXORA",

    description:
      "Photo ka background free mein remove karein. Transparent PNG ya white, blue aur red background banayein. No watermark.",

    url:
      PAGE_URL,

    siteName:
      "NEXORA",

    type:
      "website",

    locale:
      "hi_IN",

    images: [
      {
        url:
          `${SITE_URL}/og-background-remover.jpg`,

        width: 1200,

        height: 630,

        alt:
          "NEXORA Background Remover Free",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Background Remover Free – Photo Ka Background Remove Karein | NEXORA",

    description:
      "Photo ka background free mein remove karein aur transparent PNG download karein. No watermark.",

    images: [
      `${SITE_URL}/og-background-remover.jpg`,
    ],
  },
};

/*
 * Hinglish FAQ structured data.
 * The content is intentionally localized
 * instead of copying the English FAQ.
 */
const faqSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "FAQPage",

  mainEntity: [
    {
      "@type":
        "Question",

      name:
        "Photo ka background kaise remove karein?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "JPG, PNG ya WebP photo NEXORA Background Remover mein upload karein. Browser-based AI background remove karega aur aap processed image ko PNG format mein download kar sakte hain.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya Photoshop ke bina background remove kar sakte hain?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. NEXORA modern web browser mein directly work karta hai, isliye basic background removal ke liye Photoshop install karna zaroori nahi hai.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya transparent PNG bana sakte hain?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. Background remove hone ke baad Transparent option choose karein aur result ko PNG ke roop mein download karein.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Passport photo ke liye white background bana sakte hain?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. Background remove karne ke baad White option choose kar sakte hain. Passport aur visa photo requirements country aur document ke hisaab se alag ho sakti hain, isliye official requirements verify karein.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya ye iPhone aur Android par work karta hai?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. Tool modern mobile aur desktop browsers ke liye designed hai. Processing time device aur image size par depend kar sakta hai.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya background remover free hai?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. NEXORA Background Remover free use kiya ja sakta hai aur account ya sign-up required nahi hai.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya meri photo server par upload hoti hai?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Background-removal processing browser ke andar perform hoti hai, NEXORA ke image-processing server par nahi. AI package required model resources external CDN se download kar sakta hai.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kaunse image formats supported hain?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "JPG, PNG aur WebP images supported hain. Bahut large images ko browser processing ke dauran resize kiya ja sakta hai.",
      },
    },

    {
      "@type":
        "Question",

      name:
        "Kya result bina watermark ke download kar sakte hain?",

      acceptedAnswer: {
        "@type":
          "Answer",

        text:
          "Haan. NEXORA generated PNG par apna watermark add nahi karta.",
      },
    },
  ],
};

/*
 * Software structured data.
 */
const softwareSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "SoftwareApplication",

  name:
    "NEXORA Background Remover - Hindi",

  applicationCategory:
    "MultimediaApplication",

  operatingSystem:
    "Any",

  description:
    "Browser-based background remover for removing photo backgrounds and creating transparent PNG images.",

  url:
    PAGE_URL,

  offers: {
    "@type":
      "Offer",

    price:
      "0",

    priceCurrency:
      "USD",
  },
};

/*
 * Breadcrumb structured data.
 */
const breadcrumbSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "BreadcrumbList",

  itemListElement: [
    {
      "@type":
        "ListItem",

      position: 1,

      name:
        "Home",

      item:
        `${SITE_URL}/`,
    },

    {
      "@type":
        "ListItem",

      position: 2,

      name:
        "Background Remover",

      item:
        `${SITE_URL}/background-remover/`,
    },

    {
      "@type":
        "ListItem",

      position: 3,

      name:
        "Hindi",

      item:
        PAGE_URL,
    },
  ],
};

/*
 * HowTo structured data.
 */
const howToSchema = {
  "@context":
    "https://schema.org",

  "@type":
    "HowTo",

  name:
    "Photo Ka Background Remove Kaise Karein",

  description:
    "NEXORA ka use karke photo ka background remove karke transparent PNG banayein.",

  step: [
    {
      "@type":
        "HowToStep",

      position: 1,

      name:
        "Photo Upload Karein",

      text:
        "JPG, PNG ya WebP image NEXORA Background Remover mein upload karein.",
    },

    {
      "@type":
        "HowToStep",

      position: 2,

      name:
        "Background Remove Hone Dein",

      text:
        "Browser-based AI image ko process karke original background remove karega.",
    },

    {
      "@type":
        "HowToStep",

      position: 3,

      name:
        "Background Choose Karein",

      text:
        "Transparent, White, Blue ya Red background mein se apni requirement ke according option select karein.",
    },

    {
      "@type":
        "HowToStep",

      position: 4,

      name:
        "PNG Download Karein",

      text:
        "Processed image ko PNG format mein download karein.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              faqSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              softwareSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              howToSchema
            ),
        }}
      />

      <BackgroundRemoverClient />
    </>
  );
}
