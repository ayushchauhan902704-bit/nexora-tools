import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const metadata: Metadata = {
  title: "Passport Photo Maker - 20KB, 50KB, Background Change Free | NEXORA",
  description: "Passport photo maker - 20KB, 50KB, Visa, PAN, Aadhar photo banao. Real background White / Blue / Red me badlo. Free, HD, No Watermark, 100% Private.",
  keywords: ["passport photo maker", "passport size photo", "20kb photo kaise banaye", "50kb photo kaise banaye", "passport photo background change", "visa photo maker", "ssc photo 20kb", "upsc photo 50kb"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/passport-photo-maker" },
  openGraph: {
    title: "Passport Photo Maker - 20KB, 50KB, Background Change | NEXORA",
    description: "Document chuno, Background badlo, KB likho - Photo ready! Free, HD, No Watermark.",
    url: "https://nexora-tools.com/passport-photo-maker",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "20KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "SSC 20KB chuno ya KB box me 20 likho." } },
    { "@type": "Question", name: "Passport photo background white kaise kare?", acceptedAnswer: { "@type": "Answer", text: "Color Background dabao aur White chuno." } },
    { "@type": "Question", name: "50KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "UPSC 50KB chuno ya KB box me 50 likho." } },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PassportClient />
    </>
  );
}
