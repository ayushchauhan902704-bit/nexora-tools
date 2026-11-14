import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/ar`;

export const metadata: Metadata = {
  title:
    "إزالة خلفية الصورة في 5 ثوانٍ - مجاني, بدون علامة مائية | NEXORA",

  description:
    "أزل خلفية أي صورة في 5 ثوانٍ فقط - مجاني 100%, ذكاء اصطناعي بضغطة واحدة. احصل على PNG شفاف أو خلفية بيضاء / زرقاء / حمراء. بدون فوتوشوب, بدون تسجيل, بدون علامة مائية. جرّب الآن!",

  keywords: [
    "إزالة خلفية الصورة",
    "حذف خلفية الصورة",
    "تفريغ الصورة",
    "ازالة الخلفية",
    "خلفية شفافة",
    "صورة جواز سفر خلفية بيضاء",
    "ازالة خلفية الصورة مجانا",
    "تغيير خلفية الصورة",
  ],

  authors: [
    {
      name: "Ayush Chauhan",
    },
  ],

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },

alternates: {
  canonical: PAGE_URL,
  languages: {
    en: `${SITE_URL}/background-remover`,
    "hi-Latn": `${SITE_URL}/background-remover/hi`,
    es: `${SITE_URL}/background-remover/es`,
    pt: `${SITE_URL}/background-remover/pt`,
    fr: `${SITE_URL}/background-remover/fr`,
    "zh-CN": `${SITE_URL}/background-remover/zh`,
    ar: PAGE_URL,
    de: `${SITE_URL}/background-remover/de`,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
},

  openGraph: {
    title:
      "إزالة خلفية الصورة في 5 ثوانٍ - مجاني, بدون علامة مائية | NEXORA",

    description:
      "ذكاء اصطناعي بضغطة واحدة - أزل خلفية صورتك في 5 ثوانٍ. PNG شفاف أو خلفية بيضاء / زرقاء / حمراء. مجاني 100%, بدون علامة مائية, بدون تسجيل.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "ar_SA",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA أداة إزالة الخلفية بالذكاء الاصطناعي مجاناً - أزل الخلفية في 5 ثوانٍ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "إزالة خلفية الصورة في 5 ثوانٍ - مجاني, بدون علامة مائية",

    description:
      "أزل خلفية أي صورة في 5 ثوانٍ. ذكاء اصطناعي مجاني, PNG شفاف, بدون علامة مائية. جرّب الآن!",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "كيف أزيل خلفية الصورة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ارفع صورة JPG أو PNG أو WebP إلى أداة NEXORA لإزالة الخلفية. يعالج الذكاء الاصطناعي في المتصفح الصورة, ويزيل الخلفية, ويتيح لك تحميل النتيجة بصيغة PNG.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني إزالة الخلفية بدون فوتوشوب؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. تعمل أداة NEXORA لإزالة الخلفية مباشرة في متصفح ويب حديث, لذلك لا تحتاج إلى فوتوشوب أو أي محرر صور آخر.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني إنشاء PNG شفاف؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. بعد إزالة الخلفية, يمكنك تحميل النتيجة بصيغة PNG بخلفية شفافة.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني إنشاء خلفية بيضاء لصورة جواز السفر؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. يمكنك اختيار خيار الخلفية البيضاء بعد إزالة الخلفية الأصلية. تختلف متطلبات الصورة حسب البلد والمستند, لذا تحقق دائماً من المتطلبات الرسمية لطلبك.",
      },
    },
    {
      "@type": "Question",
      name: "هل تعمل على آيفون وأندرويد؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. تم تصميم الأداة للعمل في متصفحات الجوال وسطح المكتب الحديثة, بما في ذلك أجهزة آيفون وأندرويد وويندوز وماك المدعومة.",
      },
    },
    {
      "@type": "Question",
      name: "هل أداة إزالة الخلفية مجانية؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. أداة NEXORA لإزالة الخلفية مجانية 100% للاستخدام ولا تتطلب إنشاء حساب أو تسجيل.",
      },
    },
    {
      "@type": "Question",
      name: "هل يتم رفع صورتي إلى خادم؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تتم معالجة إزالة الخلفية في المتصفح. تتم معالجة الصورة محلياً في المتصفح بدلاً من إرسالها إلى خادم معالجة صور NEXORA. قد تقوم مكتبة الذكاء الاصطناعي بتنزيل موارد النموذج من شبكة CDN الخارجية الخاصة بها.",
      },
    },
    {
      "@type": "Question",
      name: "ما هي صيغ الصور المدعومة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تدعم الأداة صور JPG و PNG و WebP. الحد الأقصى لحجم الرفع هو 25 ميجابايت.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكنني التحميل بدون علامة مائية؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. لا تضيف NEXORA علامة مائية إلى ملف PNG الناتج.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أزيل خلفية الصورة بدون فوتوشوب؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ارفع صورتك إلى NEXORA. يزيل الذكاء الاصطناعي في المتصفح الخلفية وينشئ PNG شفافاً يمكنك تحميله مجاناً.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA مزيل الخلفية",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "أداة مجانية لإزالة خلفية الصورة في المتصفح لإنشاء PNG شفاف وصور بألوان خلفية قابلة للاختيار.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "الرئيسية",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "مزيل الخلفية",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "كيفية إزالة خلفية الصورة",
  description: "أزل خلفية الصورة وحمّل PNG شفافاً باستخدام NEXORA.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "ارفع صورة",
      text: "ارفع صورة JPG أو PNG أو WebP إلى أداة NEXORA لإزالة الخلفية.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "أزل الخلفية",
      text: "يعالج الذكاء الاصطناعي في المتصفح الصورة ويزيل الخلفية.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "اختر خلفية",
      text: "اختر شفاف أو أبيض أو أزرق أو أحمر كخلفية للإخراج.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "حمّل النتيجة",
      text: "حمّل الصورة المعالجة بصيغة PNG بدون علامة NEXORA المائية.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <BackgroundRemoverClient />
    </>
  );
}
