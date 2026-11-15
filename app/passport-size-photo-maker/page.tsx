import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const metadata: Metadata = {
  title:
    "Passport Photo Maker – 20KB, 50KB, Visa & ID Photo | NEXORA",

  description:
    "Free passport photo maker for India, USA, UK, Schengen and visa photos. Create 20KB and 50KB photos, custom pixel sizes and HD JPEGs. No watermark. Browser-based processing.",

  keywords: [
    "passport photo maker",
    "passport size photo maker",
    "passport photo maker online",
    "passport photo maker free",
    "passport size photo",
    "passport photo 20kb",
    "passport photo 50kb",
    "20kb photo maker",
    "50kb photo maker",
    "20kb photo kaise banaye",
    "50kb photo kaise banaye",
    "passport photo 35x45mm",
    "passport photo 3.5x4.5cm",
    "visa photo maker",
    "visa photo maker online",
    "US visa photo 2x2",
    "USA visa photo maker",
    "UK visa photo",
    "Schengen visa photo",
    "Canada visa photo",
    "Australia visa photo",
    "China visa photo",
    "Japan visa photo",
    "Korea visa photo",
    "Dubai visa photo",
    "SSC photo 20kb",
    "UPSC photo 50kb",
    "IBPS photo 20kb",
    "Railway photo 20kb",
    "PAN card photo size",
    "Aadhaar photo size",
    "driving licence photo size",
    "voter ID photo size",
    "custom passport photo size",
    "photo resize in pixels",
    "photo resize to KB",
    "image resize to KB",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
    },
  ],

  creator: "NEXORA",

  publisher: "NEXORA",

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  alternates: {
    canonical:
      "https://nexora-tools.com/passport-photo-maker",
  },

  openGraph: {
    title:
      "Passport Photo Maker – 20KB, 50KB, Visa & ID Photo | NEXORA",

    description:
      "Create passport, visa, ID and application photos with custom dimensions and KB targets. Free, no watermark and browser-based.",

    url:
      "https://nexora-tools.com/passport-photo-maker",

    siteName: "NEXORA",

    type: "website",

    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Passport Photo Maker – 20KB, 50KB, Visa & ID Photo | NEXORA",

    description:
      "Free passport and visa photo maker with custom size and KB targets.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",

  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",
      name: "How can I make a 20 KB passport or application photo?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Select a 20 KB preset such as SSC, IBPS or Railway, or enter 20 KB as the custom target. The tool optimizes the JPEG to stay at or below the requested target whenever the selected dimensions allow it.",
      },
    },

    {
      "@type": "Question",
      name: "How can I make a 50 KB photo?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Select the UPSC or Bank Form preset, or enter 50 KB in the custom KB field. The tool automatically compresses the JPEG toward the requested maximum file size.",
      },
    },

    {
      "@type": "Question",
      name: "Can I create a 35 × 45 mm passport photo?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. The tool includes common 35 × 45 mm passport and visa photo presets represented by pixel dimensions such as 413 × 531 pixels. Always verify the latest requirements of the authority you are applying to.",
      },
    },

    {
      "@type": "Question",
      name: "Can I create a 2 × 2 inch US visa photo?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. Select the USA Passport or USA Visa 2 × 2 preset to create a 600 × 600 pixel JPEG. Check the current official application requirements before submitting.",
      },
    },

    {
      "@type": "Question",
      name: "Can I enter my own width and height?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. Enter your required width and height in pixels using the Custom Width and Height fields.",
      },
    },

    {
      "@type": "Question",
      name: "Can I set a custom KB target?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. You can enter a custom file-size target from 5 KB to 5000 KB. The tool uses JPEG quality optimization and, when necessary, a dimension fallback to try to meet the target.",
      },
    },

    {
      "@type": "Question",
      name: "Can I move the crop position?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. Horizontal and vertical crop controls are available below the preview so you can reposition the image when the default center crop does not place the face correctly.",
      },
    },

    {
      "@type": "Question",
      name: "Is my photo uploaded to a server?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "The image processing for this tool happens in the browser. The photo itself is not uploaded by the tool.",
      },
    },

    {
      "@type": "Question",
      name: "Does this tool automatically remove the photo background?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "No. This passport photo maker resizes and crops the uploaded image but does not automatically remove or replace the original background.",
      },
    },
  ],
};

const webApplicationSchema = {
  "@context": "https://schema.org",

  "@type": "WebApplication",

  name: "NEXORA Passport Photo Maker",

  url:
    "https://nexora-tools.com/passport-photo-maker",

  applicationCategory: "MultimediaApplication",

  operatingSystem: "Any",

  browserRequirements:
    "Requires a modern web browser with JavaScript and Canvas support.",

  description:
    "Free browser-based passport, visa, ID and application photo maker with custom pixel dimensions and KB targets.",

  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },

  featureList: [
    "Passport photo maker",
    "Visa photo maker",
    "20 KB photo maker",
    "50 KB photo maker",
    "Custom pixel dimensions",
    "Custom KB target",
    "Crop position control",
    "JPEG output",
    "No watermark",
    "Browser-based image processing",
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />

      <PassportClient />
    </>
  );
}
