import type { Metadata } from "next";
import DpiChangerClient from "./DpiChangerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "DPI Changer 10-1200 - Any Type DPI Maker, Photo Ka DPI Badhao | NEXORA",
  description: "Any type DPI maker - Photo ka DPI 10 se 1200 tak karo 1 sec me. JPG, PNG, HEIC photo ka DPI changer. Free, HD, No Watermark, 100% Private. Passport, Amazon, Printing ke liye.",
  keywords: ["dpi kaise badhaye", "photo ka dpi kaise badhaye", "photo ka dpi 300 kaise kare", "10 se 1200 dpi", "dpi changer 10 to 1200", "any type dpi maker", "any dpi maker", "dpi maker online", "image dpi changer", "dpi changer online", "photo dpi changer 300 dpi", "dpi badhane wala app", "passport photo dpi 300", "amazon photo dpi", "image dpi kaise check kare"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/image-dpi-changer" },
  openGraph: {
    title: "Any Type DPI Maker - 10-1200 DPI Karo, Free | NEXORA",
    description: "10 se 1200 DPI tak karo 1 sec me. Any type DPI maker. Free, HD, No Watermark.",
    url: "https://nexora-tools.com/image-dpi-changer",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Photo ka DPI kaise badhaye?", acceptedAnswer: { "@type": "Answer", text: "Photo upload karo, 10 se 1200 ke beech koi bhi DPI type karo, Download dabao. 1 sec me DPI badh jayega. Ye any type DPI maker hai." } },
    { "@type": "Question", name: "10 se 1200 DPI kaise kare?", acceptedAnswer: { "@type": "Answer", text: "NEXORA DPI Changer me photo upload karo, 10 se 1200 tak koi bhi DPI likho. Pixels same rahenge, quality kharab nahi hogi." } },
    { "@type": "Question", name: "Any type DPI maker kya hai?", acceptedAnswer: { "@type": "Answer", text: "Any type DPI maker matlab koi bhi DPI bana sakte ho - 10, 72, 150, 300, 600, 1200 ya beech ka koi bhi. Sab chalega." } },
    { "@type": "Question", name: "DPI badhane se photo kharab to nahi hogi?", acceptedAnswer: { "@type": "Answer", text: "Nahi, DPI sirf print density badalta hai. Pixels aur quality same rehti hai." } },
    { "@type": "Question", name: "Kya photo safe hai?", acceptedAnswer: { "@type": "Answer", text: "Haan, 100% private. Photo browser me hi badalti hai, server pe nahi jati." } },
    { "@type": "Question", name: "Kaun se format chalte hai?", acceptedAnswer: { "@type": "Answer", text: "JPG, PNG aur HEIC. HEIC apne aap JPG me convert ho jayega." } },
    { "@type": "Question", name: "Passport ke liye kitna DPI chahiye?", acceptedAnswer: { "@type": "Answer", text: "Passport, Visa aur sarkari form ke liye 300 DPI sabse best hota hai. 10 se 1200 tak kuch bhi kar sakte ho." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "Photo Ka DPI Kaise Badhaye - 10 Se 1200 Tak - Any Type DPI Maker",
  step: [
    { "@type": "HowToStep", text: "Photo upload karo - JPG, PNG ya HEIC." },
    { "@type": "HowToStep", text: "DPI select karo - 10 se 1200 tak koi bhi, jaise 300. Any type DPI bana sakte ho." },
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
          { "@type": "ListItem", position: 2, name: "DPI Changer 10-1200 - Any Type DPI Maker", item: "https://nexora-tools.com/image-dpi-changer" }
        ]
      }) }} />
      <DpiChangerClient />
    </>
  );
}
