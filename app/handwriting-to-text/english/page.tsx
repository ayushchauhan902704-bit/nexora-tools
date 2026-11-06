import type { Metadata } from "next";
import HandwritingClient from "./HandwritingClient";

export const metadata: Metadata = {
  title: "Handwriting to Text - Convert Handwritten Notes to Typed Text | NEXORA",
  description: "Convert handwriting photo to clean typed text online. AI handwriting to text for School Notes, College Notes, Homework. Free, 100% Private, PDF & Word Download.",
  keywords: ["handwriting to text", "handwriting to typed text", "photo to text", "notes to text", "handwriting converter", "image to text"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/handwriting-to-text" },
  openGraph: {
    title: "Free Handwriting to Text - AI Notes Converter | NEXORA",
    description: "Convert your handwriting photo into clean Typed Text. Free, Private, PDF & Word Download.",
    url: "https://nexora-tools.com/handwriting-to-text",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How to convert handwriting to text?", acceptedAnswer: { "@type": "Answer", text: "Upload your handwriting photo, click Convert With AI, then download PDF or Word. It is free." } },
    { "@type": "Question", name: "Is this handwriting to text free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free. No login, no watermark." } },
    { "@type": "Question", name: "Will it read Hindi handwriting?", acceptedAnswer: { "@type": "Answer", text: "Yes, it reads Hindi, English and Hinglish handwriting." } },
    { "@type": "Question", name: "Is my photo safe?", acceptedAnswer: { "@type": "Answer", text: "Yes, photo is only used to read text, not saved." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "How to Convert Handwriting to Text",
  step: [
    { "@type": "HowToStep", text: "Upload your handwriting photo." },
    { "@type": "HowToStep", text: "Click Convert With AI." },
    { "@type": "HowToStep", text: "Download PDF, Word or Copy." },
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
          { "@type": "ListItem", position: 2, name: "Handwriting to Text", item: "https://nexora-tools.com/handwriting-to-text" }
        ]
      }) }} />
      <HandwritingClient />
    </>
  );
}
