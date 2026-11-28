import type { Metadata } from "next";
import DiscountCalculator from "./DiscountCalculator";

export const metadata: Metadata = {
  title:
    "Discount Calculator - Calculate Final Price & Savings Online | NEXORA",

  description:
    "Free discount calculator to calculate discount amount, final price, and savings instantly. Enter the original price and discount percentage. No signup required.",

  keywords: [
    "discount calculator",
    "discount calculator online",
    "calculate discount",
    "discount percentage calculator",
    "final price calculator",
    "sale price calculator",
    "discount amount calculator",
    "savings calculator",
    "percentage discount calculator",
    "20 percent discount calculator",
    "50 percent discount calculator",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
      url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444",
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
    canonical:
      "https://nexora-tools-drab.vercel.app/discount-calculator",
  },

  openGraph: {
    title:
      "Discount Calculator - Final Price & Savings | NEXORA",

    description:
      "Calculate discounts, final prices, and savings instantly with the free NEXORA Discount Calculator.",

    url:
      "https://nexora-tools-drab.vercel.app/discount-calculator",

    siteName: "NEXORA",

    type: "website",

    images: [
      {
        url:
          "https://nexora-tools-drab.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXORA Discount Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Discount Calculator - Final Price & Savings | NEXORA",

    description:
      "Calculate discount amount, final price, and savings instantly with NEXORA.",

    images: [
      "https://nexora-tools-drab.vercel.app/og-image.png",
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",
      name: "What is a discount calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "A discount calculator calculates the discount amount, final price, and savings from an original price and discount percentage.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate a 20% discount?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Multiply the original price by 20 and divide by 100. For example, a price of 1000 with a 20% discount has a discount amount of 200 and a final price of 800.",
      },
    },
    {
      "@type": "Question",
      name: "What is the discount formula?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Discount Amount equals Original Price multiplied by Discount Percentage divided by 100. Final Price equals Original Price minus Discount Amount.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the discount calculator on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The discount calculator is designed to work on modern mobile phones, tablets, and desktop browsers.",
      },
    },
    {
      "@type": "Question",
      name: "Is the discount calculator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The discount calculator is free to use and does not require registration.",
      },
    },
    {
      "@type": "Question",
      name: "Can I calculate a 50% or 75% discount?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. The calculator supports discount percentages from 0% through 100%.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",

  name: "NEXORA Discount Calculator",

  applicationCategory: "UtilitiesApplication",

  operatingSystem: "Web",

  description:
    "Free online discount calculator for calculating discount amount, final price, and savings.",

  url:
    "https://nexora-tools-drab.vercel.app/discount-calculator",

  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },

  author: {
    "@type": "Person",
    name: "Ayush Chauhan",
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
      item: "https://nexora-tools-drab.vercel.app/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Discount Calculator",
      item:
        "https://nexora-tools-drab.vercel.app/discount-calculator",
    },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",

  name:
    "Discount Calculator - Calculate Final Price & Savings",

  description:
    "Free online discount calculator for calculating discount amount, final price, and savings.",

  url:
    "https://nexora-tools-drab.vercel.app/discount-calculator",

  isPartOf: {
    "@type": "WebSite",
    name: "NEXORA",
    url: "https://nexora-tools-drab.vercel.app/",
  },
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
          __html: JSON.stringify(webPageSchema),
        }}
      />

      <DiscountCalculator />
    </>
  );
}
