import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  // ✅ GOOGLE ME YE DIKHEGA - 10 no. pe bhi nazar isi pe jayegi
  title: "Passport Photo Maker FREE ✅ 20KB Photo 1 Sec Me Banao | NEXORA",
  description: "Studio me ₹100 mat do! Passport, SSC 20KB, UPSC 50KB, Visa 2x2 photo 1 sec me banao. Apna Size + KB khud likho. FREE, HD, No Watermark - Abhi Try Karo 👈",
  keywords: ["passport photo maker", "passport size photo kaise banaye", "20kb photo kaise banaye", "50kb photo kaise banaye", "passport photo 20kb", "visa photo maker", "ssc photo 20kb", "upsc photo 50kb", "pan card photo size", "aadhar photo size", "passport photo online free", "20 kb photo maker"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/passport-size-photo-maker" },
  openGraph: {
    title: "Passport Photo Maker FREE ✅ 20KB Photo 1 Sec Me Banao",
    description: "Studio me ₹100 mat do! Passport, SSC 20KB, UPSC 50KB photo 1 sec me. FREE, HD, No Watermark - Abhi Banao 👈",
    url: "https://nexora-tools.com/passport-size-photo-maker",
    type: "website",
    siteName: "NEXORA",
    locale: "hi_IN",
    images: [{ url: "/og-passport.jpg", width: 1200, height: 630, alt: "Passport Photo Maker - 20KB Photo 1 Sec Me" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passport Photo Maker FREE ✅ 20KB Photo 1 Sec Me",
    description: "Studio me ₹100 mat do! Passport, SSC 20KB, UPSC 50KB photo 1 sec me banao. FREE, HD, No Watermark.",
    images: ["/og-passport.jpg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Passport size photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "Photo upload karo, Passport chuno, Download dabao. 3.5x4.5cm photo 1 sec me ready ho jayegi. Bilkul FREE hai." } },
    { "@type": "Question", name: "20KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "SSC 20KB chuno ya KB wale box me 20 likho. Photo apne aap 20KB ke andar ban jayegi, form me reject nahi hogi." } },
    { "@type": "Question", name: "50KB photo kaise banaye?", acceptedAnswer: { "@type": "Answer", text: "UPSC 50KB chuno ya KB wale box me 50 likho. Photo exact 50KB ke andar ban jayegi." } },
    { "@type": "Question", name: "Apna size kaise likhe?", acceptedAnswer: { "@type": "Answer", text: "Neeche Width aur Height wale box me apna size likh sakte ho, jaise 400x400. Koi bhi size bana sakte ho." } },
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
