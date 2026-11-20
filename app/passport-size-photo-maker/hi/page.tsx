import type { Metadata } from "next";
import PassportClient from "./PassportClient";

const SITE_URL = "https://nexora-tools.com";
const PAGE_URL = `${SITE_URL}/passport-size-photo-maker/hi`;

export const metadata: Metadata = {
  title: "Passport Size Photo Kaise Banayein | 20KB, 50KB Photo Maker Free | NEXORA",
  description:
    "Passport size photo kaise banayein? SSC 20KB, UPSC 50KB, visa aur passport photo online free banayein. Apna size aur KB khud daalein. HD, bina watermark, browser me hi banta hai.",
  keywords: [
    "passport size photo kaise banayein",
    "passport photo kaise banayein",
    "20kb photo kaise banayein",
    "50kb photo kaise banayein",
    "passport photo maker",
    "passport size photo maker",
    "passport photo 20kb",
    "ssc photo 20kb",
    "upsc photo 50kb",
    "visa photo kaise banayein",
    "photo ko 20kb kaise kare",
    "photo ko 50kb kaise kare",
    "passport photo resize",
    "passport photo size",
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
    canonical: PAGE_URL,
    languages: {
      en: `${SITE_URL}/passport-size-photo-maker`,
      "hi-Latn": PAGE_URL,
      es: `${SITE_URL}/passport-size-photo-maker/es`,
      pt: `${SITE_URL}/passport-size-photo-maker/pt`,
      fr: `${SITE_URL}/passport-size-photo-maker/fr`,
      "zh-CN": `${SITE_URL}/passport-size-photo-maker/zh`,
      ar: `${SITE_URL}/passport-size-photo-maker/ar`,
      de: `${SITE_URL}/passport-size-photo-maker/de`,
      id: `${SITE_URL}/passport-size-photo-maker/id`,
      "x-default": `${SITE_URL}/passport-size-photo-maker`,
    },
  },
  openGraph: {
    title: "Passport Size Photo Kaise Banayein | 20KB, 50KB Photo Maker Free",
    description:
      "Passport, visa, SSC 20KB aur UPSC 50KB photo online free banayein. Apna size aur KB khud daalein, bina watermark ke.",
    url: PAGE_URL,
    type: "website",
    siteName: "NEXORA",
    locale: "hi_IN",
    images: [
      {
        url: `${SITE_URL}/og-passport.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Passport Photo Maker - Passport Size Photo Kaise Banayein",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport Size Photo Kaise Banayein | NEXORA",
    description:
      "Passport, visa, SSC 20KB aur UPSC 50KB photo online free banayein. Apna size aur KB khud daalein.",
    images: [`${SITE_URL}/og-passport.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Passport size photo kaise banayein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apna photo upload karein, zaroori passport ya document size chunein, aur bani hui JPG download kar lein. Tool seedha aapke browser me kaam karta hai aur free hai.",
      },
    },
    {
      "@type": "Question",
      name: "20KB photo kaise banayein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SSC, IBPS ya Railway 20KB preset chunein, ya custom KB wali jagah 20 daalein. Tool photo ko compress karke diye gaye target ke andar laane ki koshish karta hai.",
      },
    },
    {
      "@type": "Question",
      name: "50KB photo kaise banayein?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UPSC ya Bank Form preset chunein, ya custom KB wali jagah 50 daalein. Tool photo ko compress karke diye gaye target ke andar laane ki koshish karta hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya main apna khud ka photo size daal sakta hu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. Apna width aur height pixel me daal sakte hain. Custom size ki limit 50 se 2000 pixel tak hai.",
      },
    },
    {
      "@type": "Question",
      name: "Kya mera photo private hai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haan. Photo ki processing aapke browser me hi hoti hai. Tool ko normal processing ke liye aapka photo server par bhejne ki zaroorat nahi padti.",
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
