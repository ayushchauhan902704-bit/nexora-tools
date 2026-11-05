import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Passport Photo Maker - 20KB, 50KB, 3.5x4.5cm, Visa 2x2 Free | NEXORA",
  description: "Passport photo maker - 20KB, 50KB, 3.5x4.5cm, Visa 2x2, PAN, Aadhar photo banao 1 sec me. Apna size aur KB bhi likh sakte ho. Free, HD, No Watermark, 100% Private.",
  keywords: ["passport photo maker", "passport size photo kaise banaye", "20kb photo kaise banaye", "50kb photo kaise banaye", "passport photo 20kb", "visa photo maker", "ssc photo 20kb", "upsc photo 50kb", "pan card photo size", "aadhar photo size"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/passport-photo-maker" },
  openGraph: {
    title: "Passport Photo Maker - 20KB, 50KB, Visa, PAN Free | NEXORA",
    description: "Document chuno, size likho, KB likho - Photo ready! Free, HD, No Watermark.",
    url: "https://nexora-tools.com/passport-photo-maker",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Passport size photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "Photo upload karo, Passport chuno, Download dabao. 3.5x4.5cm photo ready ho jayegi." } },
    { "@type": "Question", name: "20KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "SSC 20KB chuno ya KB wale box me 20 likho. Photo apne aap 20KB ki ban jayegi." } },
    { "@type": "Question", name: "50KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "UPSC 50KB chuno ya KB wale box me 50 likho." } },
    { "@type": "Question", name: "Apna size kaise likhe?", acceptedAnswer: { "@type": "Answer", text: "Neeche Width aur Height wale box me apna size likh sakte ho, jaise 400x400." } },
    { "@type": "Question", name: "Kya photo safe hai?", acceptedAnswer: { "@type": "Answer", text: "Haan, 100% private. Photo browser me hi banti hai, server pe nahi jati." } },
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
