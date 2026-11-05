import type { Metadata } from "next";
import DpiChangerClient from "./DpiChangerClient";

export const metadata: Metadata = {
  title: "DPI Changer - Photo Ka DPI 72 Se 300 Kaise Kare, Free HD | NEXORA",
  description: "Photo ka DPI kaise badhaye? 72 se 300 DPI karo 1 sec me. JPG, PNG, HEIC photo ka DPI changer. Free, HD, No Watermark, 100% Private. Passport, Amazon, Printing ke liye.",
  keywords: ["dpi kaise badhaye", "photo ka dpi kaise badhaye", "photo ka dpi 300 kaise kare", "72 se 300 dpi kaise kare", "image dpi changer", "dpi changer online", "photo dpi changer 300 dpi", "dpi badhane wala app", "passport photo dpi 300", "amazon photo dpi", "image dpi kaise check kare"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/image-dpi-changer" },
  openGraph: {
    title: "DPI Changer - Photo Ka DPI 300 Karo, Free | NEXORA",
    description: "72 se 300 DPI karo 1 sec me. Free, HD, No Watermark.",
    url: "https://nexora-tools.com/image-dpi-changer",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Photo ka DPI kaise badhaye?", acceptedAnswer: { "@type": "Answer", text: "Photo upload karo, 300 DPI select karo, Download dabao. 1 sec me DPI badh jayega." } },
    { "@type": "Question", name: "72 se 300 DPI kaise kare?", acceptedAnswer: { "@type": "Answer", text: "NEXORA DPI Changer me photo upload karo, 300 select karo. Pixels same rahenge, quality kharab nahi hogi." } },
    { "@type": "Question", name: "DPI badhane se photo kharab to nahi hogi?", acceptedAnswer: { "@type": "Answer", text: "Nahi, DPI sirf print density badalta hai. Pixels aur quality same rehti hai." } },
    { "@type": "Question", name: "Kya photo safe hai?", acceptedAnswer: { "@type": "Answer", text: "Haan, 100% private. Photo browser me hi badalti hai, server pe nahi jati." } },
    { "@type": "Question", name: "Kaun se format chalte hai?", acceptedAnswer: { "@type": "Answer", text: "JPG, PNG aur HEIC. HEIC apne aap JPG me convert ho jayega." } },
    { "@type": "Question", name: "Passport ke liye kitna DPI chahiye?", acceptedAnswer: { "@type": "Answer", text: "Passport, Visa aur sarkari form ke liye 300 DPI sabse best hota hai." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "Photo Ka DPI Kaise Badhaye",
  step: [
    { "@type": "HowToStep", text: "Photo upload karo - JPG, PNG ya HEIC." },
    { "@type": "HowToStep", text: "DPI select karo - 72, 150, 300, 600 ya apna khud ka likho." },
    { "@type": "HowToStep", text: "Download dabao - Nayi DPI wali photo mil jayegi." },
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
          { "@type": "ListItem", position: 2, name: "DPI Changer", item: "https://nexora-tools.com/image-dpi-changer" }
        ]
      }) }} />
      <DpiChangerClient />
    </>
  );
}
