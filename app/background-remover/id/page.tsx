import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/id`;

export const metadata: Metadata = {
  title:
    "Hapus Background Foto dalam 5 Detik - Gratis, Tanpa Watermark | NEXORA",

  description:
    "Hapus background dari foto apa pun hanya dalam 5 detik - 100% Gratis, AI 1-Klik. Dapatkan PNG Transparan atau background Putih / Biru / Merah. Tanpa Photoshop, Tanpa Daftar, Tanpa Watermark. Coba Sekarang!",

  keywords: [
    "hapus background foto",
    "hapus background",
    "penghapus background",
    "edit foto hapus background",
    "background transparan",
    "pas foto background putih",
    "hapus background foto gratis",
    "ganti background foto",
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
      ar: `${SITE_URL}/background-remover/ar`,
      de: `${SITE_URL}/background-remover/de`,
      id: PAGE_URL,
      "x-default": `${SITE_URL}/background-remover`,
    },
  },

  openGraph: {
    title:
      "Hapus Background Foto dalam 5 Detik - Gratis, Tanpa Watermark | NEXORA",

    description:
      "AI 1-Klik - Hapus background foto dalam 5 detik. PNG Transparan atau background Putih / Biru / Merah. 100% Gratis, Tanpa Watermark, Tanpa Daftar.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "id_ID",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Penghapus Background AI Gratis - Hapus Background dalam 5 Detik",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Hapus Background Foto dalam 5 Detik - Gratis, Tanpa Watermark",

    description:
      "Hapus background foto apa pun dalam 5 detik. AI Gratis, PNG Transparan, Tanpa Watermark. Coba sekarang!",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Bagaimana cara menghapus background foto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unggah gambar JPG, PNG, atau WebP ke Penghapus Background NEXORA. AI di browser akan memproses gambar, menghapus background, dan memungkinkan kamu mengunduh hasilnya sebagai PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Bisakah saya menghapus background tanpa Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Penghapus Background NEXORA berjalan langsung di browser web modern, jadi kamu tidak memerlukan Photoshop atau editor gambar desktop lainnya.",
      },
    },
    {
      "@type": "Question",
      name: "Bisakah saya membuat PNG transparan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Setelah menghapus background, hasilnya dapat diunduh sebagai PNG dengan background transparan.",
      },
    },
    {
      "@type": "Question",
      name: "Bisakah saya membuat background putih untuk pas foto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Kamu bisa memilih opsi Background Putih setelah menghapus background asli. Persyaratan foto berbeda-beda tergantung negara dan dokumen, jadi selalu periksa persyaratan resmi untuk pengajuanmu.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah berfungsi di iPhone dan Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Alat ini dirancang untuk browser seluler dan desktop modern, termasuk perangkat iPhone, Android, Windows, dan Mac yang didukung.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah penghapus background ini gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. Penghapus Background NEXORA gratis digunakan tanpa perlu membuat akun atau mendaftar.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah foto saya diunggah ke server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Penghapusan background diproses di browser. Gambar yang dipilih diproses secara lokal di browser, bukan dikirim ke server pemrosesan gambar NEXORA. Pustaka AI mungkin mengunduh sumber daya model dari CDN eksternalnya.",
      },
    },
    {
      "@type": "Question",
      name: "Format gambar apa yang didukung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Alat ini mendukung gambar JPG, PNG, dan WebP. Ukuran unggahan maksimum adalah 25 MB.",
      },
    },
    {
      "@type": "Question",
      name: "Bisakah saya mengunduh tanpa watermark?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya. NEXORA tidak menambahkan watermark pada PNG yang dihasilkan.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara menghapus background foto tanpa Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unggah fotomu ke NEXORA. AI di browser akan menghapus background dan membuat PNG transparan yang bisa kamu unduh gratis.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Penghapus Background",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Alat penghapus background gambar berbasis browser gratis untuk membuat PNG transparan dan gambar dengan warna background yang bisa dipilih.",
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
      name: "Beranda",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Penghapus Background",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cara Menghapus Background Gambar",
  description: "Hapus background gambar dan unduh PNG transparan menggunakan NEXORA.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Unggah gambar",
      text: "Unggah gambar JPG, PNG, atau WebP ke Penghapus Background NEXORA.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Hapus background",
      text: "AI di browser memproses gambar dan menghapus background.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Pilih background",
      text: "Pilih Transparan, Putih, Biru, atau Merah sebagai background hasil.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Unduh hasil",
      text: "Unduh gambar yang diproses sebagai PNG tanpa watermark NEXORA.",
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
