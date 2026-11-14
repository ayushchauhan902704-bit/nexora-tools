import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/hi`;

export const metadata: Metadata = {
  title:
    "Photo Ka Background 5 Second Me Hataye - 1 Click, Free, No Watermark | NEXORA",

  description:
    "Kisi bhi photo ka background sirf 5 second me hataye - 100% Free, 1-Click AI. Transparent PNG banaye ya White / Blue / Red background lagaye. No Photoshop, No Sign-up, No Watermark. Abhi Try Karein!",

  keywords: [
    "photo ka background remove karein",
    "background remover",
    "photo background remover hindi",
    "background hatane wala app",
    "transparent png maker",
    "background eraser",
    "bina photoshop ke background remove karein",
    "passport photo background remover",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },

  alternates: {
  canonical: PAGE_URL,
  languages: {
    en: `${SITE_URL}/background-remover`,
    "hi-Latn": PAGE_URL,
    es: `${SITE_URL}/background-remover/es`,
    pt: `${SITE_URL}/background-remover/pt`,
    fr: `${SITE_URL}/background-remover/fr`,
    "zh-CN": `${SITE_URL}/background-remover/zh`,
    ar: `${SITE_URL}/background-remover/ar`,
    de: `${SITE_URL}/background-remover/de`,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
},

  openGraph: {
    title:
      "Photo Ka Background 5 Second Me Hataye - 1 Click, Free, No Watermark | NEXORA",

    description:
      "1-Click AI - Photo ka background 5 second me hataye. Transparent PNG ya White / Blue / Red background. 100% Free, No Watermark, No Sign-up.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "hi_Latn",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Free AI Background Remover - Photo ka background 5 second me hataye",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Photo Ka Background 5 Second Me Hataye - 1 Click, Free",

    description:
      "Kisi bhi photo ka background 5 second me hataye. Free AI, Transparent PNG, No Watermark. Abhi try karein!",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Photo ka background kaise remove karein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NEXORA Background Remover me JPG, PNG ya WebP photo upload karein. Browser me chalnewala AI photo ka background remove karke aapko PNG download karne deta hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya bina Photoshop ke background remove ho sakta hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. NEXORA Background Remover seedha aapke browser me chalta hai, isliye aapko Photoshop ya kisi aur heavy software ki zaroorat nahi hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya transparent PNG bana sakte hain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. Background remove karne ke baad result ko transparent background wali PNG me download kar sakte hain.",
      },
    },
    {
      "@type": "Question",
      name: "Kya passport photo ke liye white background bana sakte hain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. Background remove karne ke baad White background option choose karein. Passport ya document ke rules har desh me alag ho sakte hain, isliye apne application ke official rules zaroor check karein.",
      },
    },
    {
      "@type": "Question",
      name: "Kya ye tool iPhone aur Android me chalega?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. Ye tool modern mobile aur desktop browser ke liye bana hai, jisme supported iPhone, Android, Windows aur Mac device shamil hain.",
      },
    },
    {
      "@type": "Question",
      name: "Kya NEXORA Background Remover free hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. NEXORA Background Remover bilkul free hai, iske liye account ya sign-up ki zaroorat nahi hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya meri photo server par upload hoti hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Background remove karne ka kaam browser me hi hota hai. Aapki photo NEXORA ke image-processing server par nahi bheji jaati. AI library apne external CDN se model resources download kar sakti hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kaun se image format support hain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ye tool JPG, PNG aur WebP image support karta hai. Maximum upload size 25 MB hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya bina watermark ke download kar sakte hain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. NEXORA aapki PNG par koi watermark nahi lagata.",
      },
    },
    {
      "@type": "Question",
      name: "Bina Photoshop ke photo ka background kaise hatayein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apni photo NEXORA par upload karein. Browser me chalnewala AI background remove karke transparent PNG bana dega, jise aap free me download kar sakte hain.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Background Remover",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Free browser-based image background remover - transparent PNG banane aur background color choose karne ke liye.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Background Remover",
      item: `${SITE_URL}/background-remover`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Photo ka Background Remove Karein",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Photo ka Background Kaise Remove Karein",
  description:
    "NEXORA se photo ka background remove karke transparent PNG download karein.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Photo upload karein",
      text: "NEXORA Background Remover me JPG, PNG ya WebP photo upload karein.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Background remove karein",
      text: "Browser me chalnewala AI photo ka background remove kar dega.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Background choose karein",
      text: "Transparent, White, Blue ya Red me se output background choose karein.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Result download karein",
      text: "Processed photo ko bina NEXORA watermark ke PNG me download karein.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <BackgroundRemoverClient />
    </>
  );
}
