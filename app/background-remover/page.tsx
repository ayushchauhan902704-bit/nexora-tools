import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover`;

export const metadata: Metadata = {
  title: "Remove Background from Photo in 1 Sec - FREE, No Watermark | NEXORA",
  description: "Remove background from any photo in 1 second - FREE! Create transparent PNG or white background for passport photo. No Photoshop, no sign-up, no watermark. Try now!",
  keywords: ["remove background from photo", "background remover", "photo background remover", "remove background", "transparent png maker", "background eraser", "remove background without photoshop", "passport photo background remover"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Remove Background from Photo in 1 Sec - FREE, No Watermark | NEXORA",
    description: "Remove background from any photo in 1 second - FREE! Transparent PNG, no watermark, no sign-up. Passport photo ke liye white background bhi banao.",
    url: PAGE_URL,
    siteName: "NEXORA",
    type: "website",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/og-background-remover.jpg`, width: 1200, height: 630, alt: "Remove Background from Photo FREE - NEXORA - No Watermark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Background from Photo in 1 Sec - FREE, No Watermark",
    description: "Remove background from any photo in 1 second - FREE! Transparent PNG, no watermark.",
    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I remove a background from a photo?", acceptedAnswer: { "@type": "Answer", text: "Upload a JPG, PNG, or WebP image to NEXORA Background Remover. The browser-based AI processes the image, removes the background, and lets you download the result as a PNG." } },
    { "@type": "Question", name: "Can I remove a background without Photoshop?", acceptedAnswer: { "@type": "Answer", text: "Yes. NEXORA Background Remover works directly in a modern web browser, so you do not need Photoshop or another desktop image editor." } },
    { "@type": "Question", name: "Can I make a transparent PNG?", acceptedAnswer: { "@type": "Answer", text: "Yes. After removing the background, choose Transparent and download the result as a PNG with a transparent background." } },
    { "@type": "Question", name: "Can I create a white background for a passport photo?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can choose the White background option after removing the original background. However, photo requirements vary by country and document, so always check the official requirements for your application." } },
    { "@type": "Question", name: "Does the background remover work on iPhone and Android?", acceptedAnswer: { "@type": "Answer", text: "Yes. The tool is designed to work in modern mobile and desktop browsers, including supported iPhone, Android, Windows, and Mac devices." } },
    { "@type": "Question", name: "Is the background remover free?", acceptedAnswer: { "@type": "Answer", text: "Yes. NEXORA Background Remover is available to use for free without requiring an account or sign-up." } },
    { "@type": "Question", name: "Is my photo uploaded to a server?", acceptedAnswer: { "@type": "Answer", text: "The background-removal processing is performed in the browser. Your selected image is processed locally by the browser rather than being sent to a NEXORA image-processing server. The AI library may download model resources from its external CDN." } },
    { "@type": "Question", name: "What image formats are supported?", acceptedAnswer: { "@type": "Answer", text: "The tool supports common JPG, PNG, and WebP images. The exact file size and image dimensions that can be processed depend on the device and browser." } },
    { "@type": "Question", name: "Can I download the result without a watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes. NEXORA does not add a watermark to the generated PNG." } },
    { "@type": "Question", name: "How to remove background from photo without Photoshop?", acceptedAnswer: { "@type": "Answer", text: "Upload your photo to NEXORA, AI will remove background automatically in 1 second. No Photoshop needed. Download transparent PNG for free." } },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Background Remover",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description: "Free browser-based image background remover for creating transparent PNGs and images with selectable background colors.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Background Remover", item: PAGE_URL },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove an Image Background",
  description: "Remove an image background and download a transparent PNG using NEXORA.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload an image", text: "Upload a JPG, PNG, or WebP image to the NEXORA Background Remover." },
    { "@type": "HowToStep", position: 2, name: "Remove the background", text: "The browser-based AI processes the image and removes the background." },
    { "@type": "HowToStep", position: 3, name: "Choose a background", text: "Choose Transparent, White, Blue, or Red as the output background." },
    { "@type": "HowToStep", position: 4, name: "Download the result", text: "Download the processed image as a PNG without a NEXORA watermark." },
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
