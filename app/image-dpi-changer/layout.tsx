import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Image DPI Changer - 72 to 300 DPI Free | NEXORA",
  description: "Change Image DPI to 72, 150, 300, 600 Free - JPG, PNG, HEIC. No Watermark, 100% Private, HD Quality.",
  keywords: ["image dpi changer", "300 dpi converter", "change dpi", "jpg dpi changer", "image dpi", "NEXORA"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/image-dpi-changer" },
  openGraph: {
    title: "Image DPI Changer - 72 to 300 DPI | NEXORA",
    description: "Best Free Image DPI Changer - Change 72 to 300 DPI for Printing, Amazon, Passport. Private & No Watermark.",
    url: "https://nexora-tools-drab.vercel.app/image-dpi-changer",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "Image DPI Changer - 72 to 300 DPI | NEXORA", description: "Change Image DPI to 72, 150, 300, 600 Free. Private, No Watermark." },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Image DPI Changer - NEXORA",
  description: "Free Image DPI Changer - Change 72 to 300 DPI for printing. Private, No Watermark.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Ayush Chauhan" }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
    { "@type": "ListItem", position: 2, name: "Image DPI Changer", item: "https://nexora-tools-drab.vercel.app/image-dpi-changer" }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Image DPI Changer?", acceptedAnswer: { "@type": "Answer", text: "It changes DPI metadata of JPG and PNG images from 72 to 300 DPI without changing pixels or quality." } },
    { "@type": "Question", name: "Does changing DPI reduce quality?", acceptedAnswer: { "@type": "Answer", text: "No, it only changes print density metadata. Pixels and quality remain same." } },
    { "@type": "Question", name: "Is Image DPI Changer free and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, browser-based, images never leave your device." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Change Image DPI",
  step: [
    { "@type": "HowToStep", name: "Upload Image", text: "Upload JPG, PNG or HEIC image" },
    { "@type": "HowToStep", name: "Select DPI", text: "Select 72, 150, 300, 600 or custom DPI" },
    { "@type": "HowToStep", name: "Download", text: "Click Download to save image with new DPI" }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-61NV39S2VE" />
      <Script id="gtag">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-61NV39S2VE');`}</Script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}
