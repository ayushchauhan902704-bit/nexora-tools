import type { Metadata } from "next";
import HandwritingClient from "./HandwritingClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/handwriting-to-text`;

export const metadata: Metadata = {
  title:
    "Handwriting to Text Online - Convert Handwritten Notes to Text | NEXORA",

  description:
    "Convert handwritten photos and notes into editable text online. Preserve original wording, line structure and language with support for English, Hindi, Hinglish and mixed-language handwriting.",

  keywords: [
    "handwriting to text",
    "handwriting to text online",
    "handwritten notes to text",
    "convert handwriting to text",
    "handwriting OCR",
    "handwriting OCR online",
    "handwriting photo to text",
    "handwritten notes converter",
    "handwriting to Word",
    "handwriting to PDF",
    "handwriting to TXT",
    "Hindi handwriting to text",
    "Hindi handwriting OCR",
    "Hinglish handwriting to text",
    "Hindi English handwriting OCR",
    "mixed language handwriting OCR",
    "multilingual handwriting OCR",
    "cursive handwriting to text",
    "handwritten notes to digital text",
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
    title:
      "Handwriting to Text Online - Convert Handwritten Notes to Text | NEXORA",

    description:
      "Convert handwritten photos into editable text while preserving original wording, meaningful line structure and language. Supports English, Hindi, Hinglish and mixed-language handwriting.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "en_US",

    images: [
      {
        url: `${SITE_URL}/og-handwriting-to-text.png`,
        width: 1200,
        height: 630,
        alt: "Handwriting to Text Online - NEXORA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Handwriting to Text Online | NEXORA",

    description:
      "Convert handwritten photos into editable text while preserving the original language and wording.",

    images: [
      `${SITE_URL}/og-handwriting-to-text.png`,
    ],
  },

  category: "Technology",
};

/*
|--------------------------------------------------------------------------
| FAQ Schema
|--------------------------------------------------------------------------
*/

const faqSchema = {
  "@context": "https://schema.org",

  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",

      name: "Can I convert a handwriting photo to text?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. Upload a clear handwriting photo and select Convert to Text. The transcription appears in an editable text area.",
      },
    },

    {
      "@type": "Question",

      name: "Can it read Hindi handwriting?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. The transcription workflow is designed to recognize Hindi and Devanagari handwriting while preserving the original language instead of translating it.",
      },
    },

    {
      "@type": "Question",

      name: "Can it read Hinglish handwriting?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. Hinglish written using Latin letters is supported. The transcription workflow is instructed to preserve Hinglish instead of converting it into Hindi or English.",
      },
    },

    {
      "@type": "Question",

      name: "Can one handwritten page contain multiple languages?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. The transcription workflow is designed to preserve mixed-language handwriting, including combinations such as Hindi and English on the same page.",
      },
    },

    {
      "@type": "Question",

      name: "Will the tool automatically correct my spelling?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "No. The transcription instructions prioritize the original wording instead of automatically correcting spelling or grammar.",
      },
    },

    {
      "@type": "Question",

      name: "Does the tool translate Hindi handwriting into English?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "No. The tool is designed for transcription rather than translation. Hindi should remain Hindi, English should remain English, and Hinglish should remain Hinglish when the handwriting is readable.",
      },
    },

    {
      "@type": "Question",

      name: "Can I download the handwritten text?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Yes. After transcription, you can copy the result or export it as PDF, Word or TXT.",
      },
    },

    {
      "@type": "Question",

      name: "Does handwriting recognition work perfectly?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "No handwriting recognition system can guarantee perfect recognition for every writing style. Clear, sharp and well-lit images generally produce better results. Important names, numbers and dates should always be reviewed.",
      },
    },

    {
      "@type": "Question",

      name: "Do I need a NEXORA account?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "This page does not add a NEXORA account requirement. The external AI service used for processing may have its own availability or access requirements.",
      },
    },

    {
      "@type": "Question",

      name: "What image formats are supported?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "The tool accepts JPG, JPEG, PNG and WebP images. HEIC and HEIF files are not supported by this browser workflow and should be converted to JPG or PNG first.",
      },
    },
  ],
};

/*
|--------------------------------------------------------------------------
| HowTo Schema
|--------------------------------------------------------------------------
*/

const howToSchema = {
  "@context": "https://schema.org",

  "@type": "HowTo",

  name: "How to Convert Handwriting to Text",

  description:
    "Convert a photo of handwritten notes into editable digital text.",

  step: [
    {
      "@type": "HowToStep",

      position: 1,

      name: "Upload a handwriting photo",

      text:
        "Upload or paste a clear photo of the handwritten page.",
    },

    {
      "@type": "HowToStep",

      position: 2,

      name: "Convert the handwriting",

      text:
        "Select Convert to Text and allow the handwriting recognition system to process the image.",
    },

    {
      "@type": "HowToStep",

      position: 3,

      name: "Review the transcription",

      text:
        "Review the editable result and correct any unclear words, names, numbers or dates.",
    },

    {
      "@type": "HowToStep",

      position: 4,

      name: "Copy or export the result",

      text:
        "Copy the transcription or export it as PDF, Word or TXT.",
    },
  ],
};

/*
|--------------------------------------------------------------------------
| Breadcrumb Schema
|--------------------------------------------------------------------------
*/

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

      name: "Handwriting to Text",

      item: PAGE_URL,
    },
  ],
};

/*
|--------------------------------------------------------------------------
| WebApplication Schema
|--------------------------------------------------------------------------
*/

const webApplicationSchema = {
  "@context": "https://schema.org",

  "@type": "WebApplication",

  name: "NEXORA Handwriting to Text",

  url: PAGE_URL,

  applicationCategory: "UtilitiesApplication",

  operatingSystem: "Any",

  browserRequirements:
    "Requires a modern web browser with JavaScript enabled.",

  description:
    "An online handwriting transcription tool for converting handwritten photos into editable digital text while preserving the original language and meaningful structure.",

  offers: {
    "@type": "Offer",

    price: "0",

    priceCurrency: "USD",
  },
};

/*
|--------------------------------------------------------------------------
| WebSite Schema
|--------------------------------------------------------------------------
*/

const websiteSchema = {
  "@context": "https://schema.org",

  "@type": "WebSite",

  name: "NEXORA",

  url: SITE_URL,
};

/*
|--------------------------------------------------------------------------
| Organization Schema
|--------------------------------------------------------------------------
*/

const organizationSchema = {
  "@context": "https://schema.org",

  "@type": "Organization",

  name: "NEXORA",

  url: SITE_URL,
};

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function Page() {
  const schemas = [
    faqSchema,
    howToSchema,
    breadcrumbSchema,
    webApplicationSchema,
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

      <HandwritingClient />
    </>
  );
}
