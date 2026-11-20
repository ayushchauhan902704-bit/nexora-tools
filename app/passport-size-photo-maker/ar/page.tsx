import type { Metadata } from "next";
import PassportClient from "./PassportClient";

const SITE_URL = "https://nexora-tools.com";
const PAGE_URL = `${SITE_URL}/passport-size-photo-maker/ar`;

export const metadata: Metadata = {
  title: "صانع صور جواز السفر مجاناً | صورة 20KB و 50KB وتأشيرة | NEXORA",
  description:
    "أنشئ صورة جواز سفر وتأشيرة و SSC 20KB و UPSC 50KB مجاناً عبر الإنترنت. أدخل أبعاد الصورة وحجم الملف بنفسك. جودة HD، بدون علامة مائية، ومعالجة في المتصفح.",
  keywords: [
    "صورة جواز سفر",
    "عمل صورة جواز سفر اون لاين",
    "صانع صور جواز السفر",
    "صورة جواز سفر 20kb",
    "تصغير حجم الصورة 20kb",
    "تصغير حجم الصورة 50kb",
    "صورة تأشيرة",
    "صورة شخصية للجواز",
    "صورة جواز سفر اون لاين مجانا",
    "مقاس صورة جواز السفر",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  creator: "NEXORA",
  publisher: "NEXORA",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${SITE_URL}/passport-size-photo-maker`,
      "hi-Latn": `${SITE_URL}/passport-size-photo-maker/hi`,
      es: `${SITE_URL}/passport-size-photo-maker/es`,
      pt: `${SITE_URL}/passport-size-photo-maker/pt`,
      fr: `${SITE_URL}/passport-size-photo-maker/fr`,
      "zh-CN": `${SITE_URL}/passport-size-photo-maker/zh`,
      ar: PAGE_URL,
      de: `${SITE_URL}/passport-size-photo-maker/de`,
      id: `${SITE_URL}/passport-size-photo-maker/id`,
      "x-default": `${SITE_URL}/passport-size-photo-maker`,
    },
  },
  openGraph: {
    title: "صانع صور جواز السفر مجاناً | صورة 20KB و 50KB وتأشيرة",
    description:
      "أنشئ صورة جواز سفر وتأشيرة و SSC 20KB و UPSC 50KB مجاناً عبر الإنترنت. أبعاد وحجم ملف مخصص بدون علامة مائية.",
    url: PAGE_URL,
    type: "website",
    siteName: "NEXORA",
    locale: "ar_AR",
    images: [
      {
        url: `${SITE_URL}/og-passport.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA صانع صور جواز السفر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "صانع صور جواز السفر مجاناً | NEXORA",
    description:
      "أنشئ صورة جواز سفر وتأشيرة و SSC 20KB و UPSC 50KB مجاناً عبر الإنترنت بأبعاد وحجم ملف مخصص.",
    images: [`${SITE_URL}/og-passport.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "كيف أعمل صورة جواز سفر أون لاين؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ارفع صورتك، اختر مقاس جواز السفر أو المستند المطلوب، ثم حمّل JPG المعالجة. الأداة تعمل مباشرة في متصفحك وهي مجانية.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أعمل صورة 20KB؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "اختر خيار 20KB مثل SSC أو IBPS أو Railway، أو اكتب 20 في حقل KB المخصص. تقوم الأداة بضغط الصورة لتبقى ضمن الحجم المطلوب.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أعمل صورة 50KB؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "اختر خيار UPSC أو نموذج بنك، أو اكتب 50 في حقل KB المخصص. تقوم الأداة بضغط الصورة لتبقى ضمن الحجم المطلوب.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني إدخال أبعاد صورتي بنفسي؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. يمكنك إدخال عرض وارتفاع مخصص بالبكسل. النطاق المدعوم هو من 50 إلى 2000 بكسل لكل بُعد.",
      },
    },
    {
      "@type": "Question",
      name: "هل صورتي خاصة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. معالجة الصور تتم في متصفحك. لا تحتاج الأداة إلى رفع صورتك إلى خادم للمعالجة العادية.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <PassportClient />
    </>
  );
}
