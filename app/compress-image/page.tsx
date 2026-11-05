import type { Metadata } from "next";
import CompressImageClient from "./CompressImageClient";

export const metadata: Metadata = {
  title: "Image Compressor - Reduce Image Size to 20KB, 50KB, 100KB, 200KB | NEXORA",
  description: "Compress JPG, PNG and WebP images online. Reduce image to 20KB, 50KB, 100KB, 200KB for UPSC, Passport, Form. Free, 100% Private, No Watermark, HD Quality.",
  keywords: ["compress image to 20kb", "compress image to 50kb", "compress image to 100kb", "20kb photo maker", "image compressor", "compress jpg to 20kb", "passport photo 20kb", "upsc photo compressor 20kb", "reduce image size"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb" },
  openGraph: {
    title: "Free Image Compressor - Reduce Image Size to 20KB | NEXORA",
    description: "Compress JPG, PNG and WebP to 20KB, 50KB, 100KB. Free, Private, No Watermark.",
    url: "https://nexora-tools.com/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How to compress image to 20KB?", acceptedAnswer: { "@type": "Answer", text: "Upload your photo, select 20KB target size, click Compress, then download. It is free and works for UPSC, SSC, Passport forms." } },
    { "@type": "Question", name: "Is this image compressor free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free. No login, no watermark, unlimited compress." } },
    { "@type": "Question", name: "Will quality remain good?", acceptedAnswer: { "@type": "Answer", text: "Yes, it compresses smartly to keep HD quality as much as possible for form upload." } },
    { "@type": "Question", name: "Is my photo safe?", acceptedAnswer: { "@type": "Answer", text: "Yes, photo is compressed in your browser only. It never goes to any server." } },
    { "@type": "Question", name: "Can I compress for UPSC / Passport photo?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can compress to 20KB, 50KB, 100KB as required for UPSC, SSC, Passport, College forms." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "How to Compress Image to 20KB",
  step: [
    { "@type": "HowToStep", text: "Upload your JPG, PNG or WebP photo." },
    { "@type": "HowToStep", text: "Select target size like 20KB, 50KB or 100KB." },
    { "@type": "HowToStep", text: "Click Compress and Download." },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools.com/" },
          { "@type": "ListItem", position: 2, name: "Image Compressor", item: "https://nexora-tools.com/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb" }
        ]
      }) }} />
      <CompressImageClient />
    </>
  );
}
