import type { Metadata } from "next";
import CompressImageClient from "./CompressImageClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL =
  `${SITE_URL}/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb`;

export const metadata: Metadata = {
  title:
    "Image Compressor to 20KB, 50KB, 100KB & 200KB Online | NEXORA",

  description:
    "Compress JPG, PNG and WebP images to 20KB, 50KB, 100KB, 200KB and custom sizes online. Free browser-based image compressor with no watermark and no account required.",

  keywords: [
    "image compressor",
    "compress image to 20kb",
    "compress image to 50kb",
    "compress image to 100kb",
    "compress image to 200kb",
    "compress jpg to 20kb",
    "compress png to 20kb",
    "compress webp",
    "reduce image size",
    "photo compressor",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
    },
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: "website",
    url: PAGE_URL,
    title:
      "Image Compressor to 20KB, 50KB, 100KB & 200KB | NEXORA",
    description:
      "Compress JPG, PNG and WebP images to your required file size. Free, fast and browser-based.",
    siteName: "NEXORA",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Image Compressor to 20KB, 50KB, 100KB & 200KB | NEXORA",
    description:
      "Compress JPG, PNG and WebP images online to your required file size.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I compress an image to 20 KB?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Enter 20 KB as the target size and click Compress Image. The tool tries to produce the largest available image that stays within the requested limit.",
      },
    },
    {
      "@type": "Question",
      name: "Can I choose a custom image size?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. You can enter a custom target size from 10 KB to 1000 KB.",
      },
    },
    {
      "@type": "Question",
      name: "Which image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "JPG, JPEG, PNG, and WebP images are supported. The compressed output is provided as a JPEG file.",
      },
    },
    {
      "@type": "Question",
      name: "Is my image uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. Compression is performed in the browser and the image is not intentionally uploaded to a NEXORA processing server.",
      },
    },
    {
      "@type": "Question",
      name: "Does the image compressor work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The tool is designed to work on modern mobile and desktop browsers.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Image Compressor",
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "Image Compression",
  operatingSystem: "Web Browser",
  browserRequirements:
    "Requires a modern JavaScript-enabled web browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Browser-based image compressor for reducing JPG, PNG and WebP images to a selected file size.",
  url: PAGE_URL,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Image Compressor",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Compress an Image",
  description:
    "Compress an image to a selected file size using the NEXORA Image Compressor.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose an image",
      text:
        "Upload a JPG, PNG, or WebP image.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Set the target size",
      text:
        "Enter the required target size in KB.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compress the image",
      text:
        "Click Compress Image and wait for processing to finish.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download the result",
      text:
        "Preview the compressed image and download it.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />

      <CompressImageClient />
    </>
  );
}
