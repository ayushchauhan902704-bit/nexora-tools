import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/zh/`;

export const metadata: Metadata = {
  title:
    "免费在线图片去背景 | AI Background Remover | NEXORA",

  description:
    "使用 NEXORA 免费在线去除照片和图片背景。生成透明 PNG，也可以添加白色、蓝色或红色背景。无需注册，无水印。",

  keywords: [
    "图片去背景",
    "照片去背景",
    "免费去背景",
    "在线去背景",
    "AI 去背景",
    "背景移除",
    "图片背景消除",
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
      en: `${SITE_URL}/background-remover/`,
      hi: `${SITE_URL}/background-remover/hi/`,
      es: `${SITE_URL}/background-remover/es/`,
      zh: `${SITE_URL}/background-remover/zh/`,
      "x-default": `${SITE_URL}/background-remover/`,
    },
  },

  openGraph: {
    title:
      "免费在线图片去背景 | AI Background Remover | NEXORA",

    description:
      "免费去除图片背景，生成透明 PNG，也可以添加白色、蓝色或红色背景。无需注册，无水印。",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "zh_CN",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA 免费图片去背景工具",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "免费在线图片去背景 | AI Background Remover | NEXORA",

    description:
      "免费在线去除照片背景并下载透明 PNG。无需注册，无水印。",

    images: [
      `${SITE_URL}/og-background-remover.jpg`,
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",
      name: "如何免费去除照片背景？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "上传 JPG、PNG 或 WebP 图片到 NEXORA Background Remover。工具会在浏览器中处理图片并去除原始背景，完成后可以下载处理后的 PNG 图片。",
      },
    },

    {
      "@type": "Question",
      name: "不使用 Photoshop 可以去除图片背景吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "可以。NEXORA 可以直接在现代浏览器中使用，不需要安装 Photoshop 或其他图片编辑软件。",
      },
    },

    {
      "@type": "Question",
      name: "可以生成透明 PNG 吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "可以。去除背景后选择“透明”选项，即可生成透明背景的 PNG 图片并下载。",
      },
    },

    {
      "@type": "Question",
      name: "可以制作白色背景的证件照片吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "可以。去除原始背景后选择“白色”背景即可。不过，不同国家和证件的照片要求可能不同，请始终确认官方要求。",
      },
    },

    {
      "@type": "Question",
      name: "这个工具可以在 iPhone 和 Android 手机上使用吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "可以。该工具支持现代移动和桌面浏览器。处理时间可能会根据设备性能和图片大小而有所不同。",
      },
    },

    {
      "@type": "Question",
      name: "NEXORA Background Remover 免费吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "是的。NEXORA Background Remover 可以免费使用，不需要创建账户或注册。",
      },
    },

    {
      "@type": "Question",
      name: "我的照片会上传到服务器吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "背景移除处理在浏览器中进行，而不是在 NEXORA 的图片处理服务器上进行。AI 软件包可能会从外部 CDN 下载所需的模型资源。",
      },
    },

    {
      "@type": "Question",
      name: "支持哪些图片格式？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "支持 JPG、PNG 和 WebP 图片。对于非常大的图片，浏览器可能会在处理过程中调整图片尺寸，以提高性能。",
      },
    },

    {
      "@type": "Question",
      name: "下载的图片有水印吗？",

      acceptedAnswer: {
        "@type": "Answer",
        text:
          "没有。NEXORA 不会在生成的 PNG 图片上添加自己的水印。",
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
    "一款基于浏览器的免费图片背景移除工具，可以去除照片背景并创建透明 PNG 图片。",

  url: PAGE_URL,

  inLanguage: "zh-CN",

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
      name: "首页",
      item: `${SITE_URL}/`,
    },

    {
      "@type": "ListItem",
      position: 2,
      name: "图片去背景",
      item: `${SITE_URL}/background-remover/`,
    },

    {
      "@type": "ListItem",
      position: 3,
      name: "中文",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",

  "@type": "HowTo",

  name: "如何免费去除照片背景",

  description:
    "使用 NEXORA 在线工具去除照片背景并创建透明 PNG 图片。",

  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "上传照片",
      text:
        "上传 JPG、PNG 或 WebP 图片到 NEXORA Background Remover。",
    },

    {
      "@type": "HowToStep",
      position: 2,
      name: "等待处理",
      text:
        "浏览器中的 AI 处理图片并自动去除原始背景。",
    },

    {
      "@type": "HowToStep",
      position: 3,
      name: "选择背景",
      text:
        "根据需要选择透明、白色、蓝色或红色背景。",
    },

    {
      "@type": "HowToStep",
      position: 4,
      name: "下载 PNG",
      text:
        "下载处理完成后的 PNG 图片。",
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
