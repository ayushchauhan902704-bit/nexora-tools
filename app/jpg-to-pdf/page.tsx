import type { Metadata } from "next";
import JpgToPdf from "./JpgToPdf";

export const metadata: Metadata = {
  title: "JPG to PDF Converter - 50 Images to PDF Free | NEXORA",
  description:
    "Convert up to 50 JPG, JPEG, PNG or WEBP images into one PDF for free. Choose A4, US Letter or original image size. Private browser-based conversion with no watermark.",
  keywords: [
    "jpg to pdf",
    "jpg to pdf converter",
    "jpg to pdf online",
    "image to pdf",
    "photo to pdf",
    "jpg to pdf free",
    "jpg to pdf no watermark",
    "multiple jpg to pdf",
    "50 jpg to pdf",
    "png to pdf",
    "webp to pdf",
    "photo to pdf converter",
  ],
  alternates: {
    canonical: "/jpg-to-pdf",
  },
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
  openGraph: {
    title: "JPG to PDF Converter - Free 50 Image PDF Tool | NEXORA",
    description:
      "Convert up to 50 images into one PDF. A4, US Letter and Fit Image options with browser-based private processing.",
    url: "/jpg-to-pdf",
    siteName: "NEXORA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG to PDF Converter - Free | NEXORA",
    description:
      "Convert JPG, PNG and WEBP images to PDF free with no watermark.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "JPG to PDF Converter",
      url: "https://nexora-tools-drab.vercel.app/jpg-to-pdf",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Free browser-based JPG to PDF converter for combining up to 50 images into one PDF.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I convert JPG to PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Select your JPG, JPEG, PNG or WEBP images, choose a PDF page size, select Convert & Preview, then download the generated PDF.",
          },
        },
        {
          "@type": "Question",
          name: "Can I convert multiple JPG images into one PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. You can select up to 50 supported images and combine them into a single PDF.",
          },
        },
        {
          "@type": "Question",
          name: "Is the JPG to PDF converter free?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The converter is available to use for free without registration.",
          },
        },
        {
          "@type": "Question",
          name: "Can I choose A4 or US Letter PDF size?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. You can choose A4, US Letter or Fit Image mode before creating the PDF.",
          },
        },
        {
          "@type": "Question",
          name: "Does the converter add a watermark?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "The generated PDF does not add a NEXORA watermark.",
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <JpgToPdf />
    </>
  );
}
