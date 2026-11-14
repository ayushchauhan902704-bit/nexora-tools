import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/zh`;

export const metadata: Metadata = {
  title:
    "5秒去除照片背景 - 免费, 无水印 | NEXORA",

  description:
    "只需5秒即可去除任何照片的背景 - 100%免费, 一键AI。获得透明PNG或白色 / 蓝色 / 红色背景。无需Photoshop, 无需注册, 无水印。立即体验！",

  keywords: [
    "去除照片背景",
    "抠图",
    "在线抠图",
    "去除背景",
    "透明背景",
    "证件照换底色",
    "免费抠图",
    "照片换背景",
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
    "zh-CN": PAGE_URL,
    ar: `${SITE_URL}/background-remover/ar`,
    de: `${SITE_URL}/background-remover/de`,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
}, 

  openGraph: {
    title:
      "5秒去除照片背景 - 免费, 无水印 | NEXORA",

    description:
      "一键AI - 5秒去除照片背景。透明PNG或白色 / 蓝色 / 红色背景。100%免费, 无水印, 无需注册。",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "zh_CN",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA 免费AI抠图工具 - 5秒去除背景",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "5秒去除照片背景 - 免费, 无水印",

    description:
      "5秒去除任何照片的背景。免费AI, 透明PNG, 无水印。立即体验！",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "如何去除照片背景？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "将 JPG、PNG 或 WebP 图片上传到 NEXORA 抠图工具。浏览器中的AI会自动处理图片、去除背景, 并让您下载PNG结果。",
      },
    },
    {
      "@type": "Question",
      name: "没有Photoshop可以抠图吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。NEXORA 抠图工具直接在现代浏览器中运行, 因此您不需要 Photoshop 或其他桌面图像编辑器。",
      },
    },
    {
      "@type": "Question",
      name: "可以生成透明PNG吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。去除背景后, 您可以下载带有透明背景的PNG图片。",
      },
    },
    {
      "@type": "Question",
      name: "可以制作证件照白底吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。去除原始背景后, 您可以选择白色背景选项。不同国家和证件的照片要求不同, 请务必查看您申请的官方要求。",
      },
    },
    {
      "@type": "Question",
      name: "支持 iPhone 和 Android 吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "支持。该工具专为现代移动和桌面浏览器设计, 包括支持的 iPhone、Android、Windows 和 Mac 设备。",
      },
    },
    {
      "@type": "Question",
      name: "这个抠图工具免费吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "是的。NEXORA 抠图工具完全免费使用, 无需创建账户或注册。",
      },
    },
    {
      "@type": "Question",
      name: "我的照片会被上传到服务器吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "背景去除处理在浏览器中完成。图片在浏览器本地处理, 而不是发送到 NEXORA 图像处理服务器。AI库可能会从其外部CDN下载模型资源。",
      },
    },
    {
      "@type": "Question",
      name: "支持哪些图片格式？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "该工具支持 JPG、PNG 和 WebP 图片。最大上传大小为 25 MB。",
      },
    },
    {
      "@type": "Question",
      name: "可以无水印下载吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。NEXORA 不会在生成的PNG上添加水印。",
      },
    },
    {
      "@type": "Question",
      name: "如何不用Photoshop去除照片背景？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "将您的照片上传到 NEXORA。浏览器中的AI会去除背景并生成透明PNG, 您可以免费下载。",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA 抠图工具",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "免费的浏览器内图片背景去除工具, 可创建透明PNG和可选择背景色的图片。",
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
      name: "抠图工具",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "如何去除图片背景",
  description: "使用 NEXORA 去除图片背景并下载透明PNG。",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "上传图片",
      text: "将 JPG、PNG 或 WebP 图片上传到 NEXORA 抠图工具。",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "去除背景",
      text: "浏览器中的AI会处理图片并去除背景。",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "选择背景",
      text: "选择透明、白色、蓝色或红色作为输出背景。",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "下载结果",
      text: "下载处理后的图片为无 NEXORA 水印的PNG。",
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
