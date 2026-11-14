import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/ar/`;

export const metadata: Metadata = {
  title: "إزالة خلفية الصور مجانًا عبر الإنترنت | NEXORA",
  description:
    "أزل خلفية الصور والصور الشخصية مجانًا باستخدام NEXORA. أنشئ صور PNG شفافة أو أضف خلفية بيضاء أو زرقاء أو حمراء. بدون تسجيل وبدون علامة مائية.",
  keywords: [
    "إزالة خلفية الصورة",
    "إزالة خلفية الصور",
    "مزيل خلفية الصور",
    "إزالة الخلفية مجانًا",
    "إزالة خلفية الصورة أونلاين",
    "قص الصور",
    "تحويل الصورة إلى PNG شفاف",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${SITE_URL}/background-remover/`,
      hi: `${SITE_URL}/background-remover/hi/`,
      es: `${SITE_URL}/background-remover/es/`,
      zh: `${SITE_URL}/background-remover/zh/`,
      ar: `${SITE_URL}/background-remover/ar/`,
      "x-default": `${SITE_URL}/background-remover/`,
    },
  },
  openGraph: {
    title: "إزالة خلفية الصور مجانًا عبر الإنترنت | NEXORA",
    description:
      "أزل خلفية الصور مجانًا وأنشئ صور PNG شفافة أو أضف خلفية بيضاء أو زرقاء أو حمراء.",
    url: PAGE_URL,
    siteName: "NEXORA",
    type: "website",
    locale: "ar_AR",
    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "أداة إزالة خلفية الصور من NEXORA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "إزالة خلفية الصور مجانًا | NEXORA",
    description:
      "أزل خلفية الصور وأنشئ PNG شفافًا أو أضف خلفية مخصصة مجانًا.",
    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "كيف يمكنني إزالة خلفية الصورة مجانًا؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "افتح أداة NEXORA لإزالة الخلفية، ارفع صورتك، وانتظر حتى تتم معالجة الصورة. بعد ذلك يمكنك اختيار خلفية شفافة أو بيضاء أو زرقاء أو حمراء وتنزيل الصورة بصيغة PNG.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن إزالة خلفية الصورة بدون استخدام Photoshop؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. يمكنك استخدام أداة NEXORA لإزالة خلفية الصور مباشرة من المتصفح دون الحاجة إلى Photoshop أو برنامج إضافي.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن إنشاء صورة بخلفية شفافة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. بعد إزالة الخلفية يمكنك اختيار الخيار الشفاف وتنزيل الصورة بصيغة PNG مع خلفية شفافة.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن إضافة خلفية بيضاء إلى صورة شخصية؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. بعد إزالة الخلفية يمكنك اختيار اللون الأبيض أو الأزرق أو الأحمر كخلفية جديدة قبل تنزيل الصورة.",
      },
    },
    {
      "@type": "Question",
      name: "هل يمكن استخدام الأداة على iPhone وAndroid؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. تعمل الأداة مباشرة في متصفحات الهواتف الحديثة، بما في ذلك أجهزة iPhone وAndroid.",
      },
    },
    {
      "@type": "Question",
      name: "هل أداة NEXORA لإزالة الخلفية مجانية؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم. يمكنك استخدام أداة إزالة خلفية الصور من NEXORA مجانًا.",
      },
    },
    {
      "@type": "Question",
      name: "هل تتم معالجة الصورة داخل المتصفح؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تتم معالجة الصورة باستخدام الأداة داخل المتصفح. قد يحتاج النظام إلى تنزيل موارد نموذج الذكاء الاصطناعي من شبكة خارجية عند بدء الأداة.",
      },
    },
    {
      "@type": "Question",
      name: "ما تنسيقات الصور المدعومة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تدعم الأداة صور JPG وPNG وWebP ضمن حد حجم الملف المسموح به.",
      },
    },
    {
      "@type": "Question",
      name: "هل تضيف الأداة علامة مائية إلى الصور؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "لا تضيف أداة NEXORA علامة مائية خاصة بها إلى الصورة الناتجة.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Background Remover",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "أداة تعمل عبر المتصفح لإزالة خلفية الصور وإنشاء صور PNG بخلفية شفافة.",
  url: PAGE_URL,
  inLanguage: "ar",
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
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "إزالة خلفية الصور",
      item: `${SITE_URL}/background-remover/`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "العربية",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "كيفية إزالة خلفية الصورة باستخدام NEXORA",
  description:
    "خطوات بسيطة لإزالة خلفية الصورة وإنشاء صورة PNG جديدة.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "رفع الصورة",
      text: "اختر صورة JPG أو PNG أو WebP من جهازك.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "انتظر إزالة الخلفية",
      text: "دع الأداة تعالج الصورة وتزيل الخلفية تلقائيًا.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "اختيار الخلفية",
      text: "اختر خلفية شفافة أو بيضاء أو زرقاء أو حمراء.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "تنزيل الصورة",
      text: "اضغط على زر التنزيل لحفظ الصورة الجديدة بصيغة PNG.",
    },
  ],
};

export default function ArabicBackgroundRemoverPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />

      <BackgroundRemoverClient />
    </>
  );
}
