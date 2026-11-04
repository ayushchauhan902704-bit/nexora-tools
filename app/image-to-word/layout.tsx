import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OCR PDF to Word - Scanned PDF, Image to Word Converter Free | NEXORA",
  description: "Free OCR PDF to Word by NEXORA - Convert Scanned PDF, JPG, PNG, Photo to Editable Word DOC with OCR. Image to text, photo to Word, 100% Private, Free Forever.",
  keywords: ["ocr pdf to word", "scanned pdf to word", "image to word", "jpg to word", "ocr converter", "photo to word", "NEXORA ocr"],
  authors: [{ name: "Ayush Chauhan", url: "https://www.linkedin.com/in/ayush-chauhan-0b0960444" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/image-to-word" },
  openGraph: {
    title: "OCR PDF to Word - Scanned Image to Word Free | NEXORA",
    description: "Best OCR - Scanned PDF JPG PNG to Word DOC. Private, Free, HD, No Watermark.",
    url: "https://nexora-tools-drab.vercel.app/image-to-word",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
  twitter: { card: "summary_large_image", title: "OCR PDF to Word - Scanned Image to Word Free | NEXORA", description: "Convert Scanned PDF, JPG, PNG to Editable Word DOC. Private, Free." },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OCR PDF to Word Converter - NEXORA",
  description: "Free OCR - Scanned PDF Image JPG PNG to Word DOC Photo to Text Private Made in India",
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
    { "@type": "ListItem", position: 2, name: "Image to Word - OCR", item: "https://nexora-tools-drab.vercel.app/image-to-word" }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is OCR PDF to Word Converter?", acceptedAnswer: { "@type": "Answer", text: "OCR Converter uses Optical Character Recognition to read text from scanned PDFs and images JPG PNG and convert to editable Word DOC." } },
    { "@type": "Question", name: "How to convert scanned PDF to Word?", acceptedAnswer: { "@type": "Answer", text: "Upload scanned PDF JPG PNG photo, OCR reads text and saves as Word DOC file instantly." } },
    { "@type": "Question", name: "Is OCR converter safe and private?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% private. OCR processing happens in browser, image never uploaded to server." } },
    { "@type": "Question", name: "Scanned PDF to Word kaise kare?", acceptedAnswer: { "@type": "Answer", text: "Scanned PDF ya photo upload karo, Convert dabao, Word file download ho jayegi." } }
  ]
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Scanned PDF Image to Word with OCR",
  step: [
    { "@type": "HowToStep", name: "Upload Scanned File", text: "Click drop zone, upload scanned PDF JPG PNG" },
    { "@type": "HowToStep", name: "OCR Processing", text: "OCR runs 0-100% progress, extracts text" },
    { "@type": "HowToStep", name: "Download Word", text: "Preview extracted text, download as Word DOC" }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-61NV39S2VE" />
      <Script id="gtag">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-61NV39S2VE');`}</Script>
      <Script async src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}
