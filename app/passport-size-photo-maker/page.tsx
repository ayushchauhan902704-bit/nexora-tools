import type { Metadata } from "next";
import PassportClient from "./PassportClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/passport-size-photo-maker`;

export const metadata: Metadata = {
  title: "Passport Photo Maker Online Free | 20KB, 50KB & Visa Photo | NEXORA",
  description:
    "Create passport, visa, ID and document photos online for free. Resize photos, adjust positioning, use custom dimensions, set file-size targets and download JPG images without a watermark.",
  keywords: [
    "passport photo maker",
    "passport size photo maker",
    "passport photo online",
    "passport photo maker online free",
    "passport photo resize",
    "passport photo size",
    "passport photo 20kb",
    "20kb photo maker",
    "20kb photo resize",
    "50kb photo maker",
    "50kb photo resize",
    "visa photo maker",
    "visa photo online",
    "document photo maker",
    "ID photo maker",
    "passport photo for government form",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  creator: "NEXORA",
  publisher: "NEXORA",

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
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
    title: "Passport Photo Maker Online Free | 20KB, 50KB & Visa Photo",
    description:
      "Create passport, visa, ID and document photos with custom dimensions, positioning and file-size options.",
    url: PAGE_URL,
    type: "website",
    siteName: "NEXORA",
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/og-passport.jpg`,
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
      "Create passport, visa and document photos with custom dimensions and file-size options.",
    images: [`${SITE_URL}/og-passport.jpg`],
  },

  category: "Technology",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I make a passport size photo online?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Upload your photo, choose a suitable passport or document photo preset, adjust the position if needed, and download the processed JPG.",
      },
    },
    {
      "@type": "Question",
      name: "How do I make a 20KB photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Select a preset with a 20 KB target or enter 20 KB in the custom file-size field. The tool compresses the JPG toward the selected file-size target.",
      },
    },
    {
      "@type": "Question",
      name: "How do I make a 50KB photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Select a preset with a 50 KB target or enter 50 KB in the custom file-size field. The tool compresses the JPG toward the selected file-size target.",
      },
    },
    {
      "@type": "Question",
      name: "Can I adjust the position of my photo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Use the horizontal and vertical controls below the preview to reposition the image inside the selected crop.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use custom photo dimensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. You can enter custom width and height values from 50 to 2000 pixels.",
      },
    },
    {
      "@type": "Question",
      name: "Is my photo uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Normal image processing is performed directly in your browser. The tool does not need to upload your photo to a server for normal processing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I remove or change the photo background?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. After preparing your photo, you can use the NEXORA Background Remover to remove or change the background.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Make a Passport Photo Online",
  description:
    "Create a passport, visa or document photo online using a preset or custom dimensions.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your photo",
      text: "Upload a clear JPG, PNG or WebP photo.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose the photo size",
      text:
        "Select a suitable passport, visa or document photo preset, or enter custom dimensions.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Adjust the position",
      text:
        "Use the horizontal and vertical controls to position the photo inside the crop.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download the photo",
      text:
        "Download the finished JPG or save it using your device's sharing options.",
    },
  ],
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
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Passport Photo Maker",
      item: PAGE_URL,
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NEXORA Passport Photo Maker",
  url: PAGE_URL,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  browserRequirements:
    "Requires a modern web browser with JavaScript enabled.",
  description:
    "Free browser-based passport, visa and document photo maker with custom dimensions, positioning and file-size options.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NEXORA",
  url: SITE_URL,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NEXORA",
  url: SITE_URL,
};

export default function Page() {
  const schemas = [
    faqSchema,
    howToSchema,
    breadcrumbSchema,
    webAppSchema,
    websiteSchema,
    organizationSchema,
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}

      <PassportClient />
    </>
  );
}
