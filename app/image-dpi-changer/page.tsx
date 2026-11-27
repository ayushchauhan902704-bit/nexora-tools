import type { Metadata } from "next";
import DpiChangerClient from "./DpiChangerClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/image-dpi-changer`;

const faqItems = [
  { question: "Is this DPI changer free?", answer: "Yes. NEXORA's DPI Changer is free to use and does not require an account." },
  { question: "Is my image uploaded to a server?", answer: "The DPI operation is performed in your browser. NEXORA does not need to upload your image to its own server for this operation." },
  { question: "Can I change an image to 300 DPI?", answer: "Yes. Enter 300 in the DPI field or select the 300 DPI preset and download the result." },
  { question: "Can I use a custom DPI?", answer: "Yes. You can enter any whole-number DPI from 10 through 1200." },
  { question: "Does changing DPI increase image resolution?", answer: "No. DPI metadata and pixel dimensions are different. Changing DPI alone does not add new image detail." },
  { question: "Does the tool support HEIC?", answer: "Yes. HEIC and HEIF images can be converted to JPG in the browser before the DPI metadata is processed." },
  { question: "Does the tool add a watermark?", answer: "No. The downloaded result does not intentionally add a NEXORA watermark." },
  { question: "Can I use this on iPhone or Android?", answer: "Yes. The tool is designed for modern mobile browsers as well as desktop browsers." },
];

export const metadata: Metadata = {
  title: "Image DPI Changer Online – 10 to 1200 DPI | NEXORA",
  description: "Change JPG, PNG and HEIC image DPI from 10 to 1200 online. Set custom DPI, keep original pixel dimensions and download without a watermark.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  keywords: ["image dpi changer","change image dpi","change photo dpi","300 dpi converter","dpi converter","jpg dpi changer","png dpi changer","heic dpi changer"],
  openGraph: {
    title: "Image DPI Changer Online – 10 to 1200 DPI",
    description: "Free browser-based DPI changer for JPG, PNG and HEIC images. Set 10–1200 DPI and download your result.",
    url: PAGE_URL, type: "website", siteName: "NEXORA", locale: "en_US",
    images: [{ url: `${SITE_URL}/og-image-dpi-changer.png`, width: 1200, height: 630, alt: "Image DPI Changer Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image DPI Changer Online – 10 to 1200 DPI",
    description: "Change image DPI from 10 to 1200 directly in your browser.",
    images: [`${SITE_URL}/og-image-dpi-changer.png`],
  },
};

export default function Page() {
  const webApplicationSchema = {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "NEXORA Image DPI Changer", url: PAGE_URL,
    description: "Browser-based image DPI changer supporting JPG, PNG and HEIC images from 10 to 1200 DPI.",
    applicationCategory: "MultimediaApplication", operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["10 to 1200 DPI","Custom DPI input","JPG support","PNG support","HEIC support","Browser-based processing","No watermark","Mobile browser support"],
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: "Image DPI Changer", item: PAGE_URL },
    ],
  };
  // ✅ FIX 1 - HowTo Schema Jod Diya
  const howToSchema = {
    "@context": "https://schema.org", "@type": "HowTo",
    name: "How to Change Image DPI",
    step: [
      { "@type": "HowToStep", text: "Upload a JPG, PNG or HEIC image." },
      { "@type": "HowToStep", text: "Enter the DPI value you need, from 10 to 1200." },
      { "@type": "HowToStep", text: "Choose a preset such as 300 DPI or enter a custom value." },
      { "@type": "HowToStep", text: "Click Download to save the updated image." },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  // ✅ FIX 2 - Organization Schema Jod Diya
  const organizationSchema = { "@context": "https://schema.org", "@type": "Organization", name: "NEXORA", url: SITE_URL };

  const schemas = [webApplicationSchema, breadcrumbSchema, howToSchema, faqSchema, organizationSchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <DpiChangerClient />
    </>
  );
}
