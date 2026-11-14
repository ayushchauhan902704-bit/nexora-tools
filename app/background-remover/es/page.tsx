import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/es/`;

export const metadata: Metadata = {
  title:
    "Eliminar Fondo de Foto Gratis | Background Remover | NEXORA",

  description:
    "Elimina el fondo de tus fotos gratis con NEXORA. Crea PNG transparentes o añade fondos blancos, azules o rojos. Sin marca de agua y sin registro.",

  keywords: [
    "eliminar fondo de foto",
    "quitar fondo de imagen",
    "removedor de fondos gratis",
    "quitar fondo de foto online",
    "eliminar fondo de imagen",
    "background remover gratis",
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
      fr: `${SITE_URL}/background-remover/fr/`,
      de: `${SITE_URL}/background-remover/de/`,
      pt: `${SITE_URL}/background-remover/pt/`,
      "x-default": `${SITE_URL}/background-remover/`,
    },
  },

  openGraph: {
    title:
      "Eliminar Fondo de Foto Gratis | Background Remover | NEXORA",

    description:
      "Elimina el fondo de tus fotos gratis. Crea imágenes PNG transparentes o añade fondos blancos, azules o rojos.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "es_ES",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA - Eliminar Fondo de Foto Gratis",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Eliminar Fondo de Foto Gratis | Background Remover | NEXORA",

    description:
      "Elimina el fondo de tus fotos y descarga un PNG transparente. Gratis, sin marca de agua y sin registro.",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo puedo eliminar el fondo de una foto?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sube una imagen JPG, PNG o WebP a NEXORA Background Remover. El procesamiento se realiza en el navegador y puedes descargar el resultado como una imagen PNG.",
      },
    },

    {
      "@type": "Question",
      name: "¿Puedo quitar el fondo sin Photoshop?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. NEXORA funciona directamente en un navegador moderno, por lo que no necesitas instalar Photoshop para eliminar el fondo de una imagen.",
      },
    },

    {
      "@type": "Question",
      name: "¿Puedo crear un PNG con fondo transparente?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. Después de eliminar el fondo, selecciona la opción Transparente y descarga la imagen procesada en formato PNG.",
      },
    },

    {
      "@type": "Question",
      name: "¿Puedo crear un fondo blanco para una foto de pasaporte?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. Después de eliminar el fondo puedes seleccionar Blanco. Los requisitos para fotos de pasaporte y visado pueden variar según el país y el documento, por lo que debes comprobar siempre los requisitos oficiales.",
      },
    },

    {
      "@type": "Question",
      name: "¿Funciona en iPhone y Android?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. La herramienta está diseñada para funcionar en navegadores modernos de dispositivos móviles y de escritorio. El tiempo de procesamiento puede variar según el dispositivo y el tamaño de la imagen.",
      },
    },

    {
      "@type": "Question",
      name: "¿El removedor de fondos es gratis?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. NEXORA Background Remover se puede utilizar gratis y no requiere crear una cuenta ni registrarse.",
      },
    },

    {
      "@type": "Question",
      name: "¿Mi foto se sube a un servidor?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "El procesamiento para eliminar el fondo se realiza en el navegador y no en un servidor de procesamiento de imágenes de NEXORA. El paquete de IA puede descargar los recursos necesarios del modelo desde una CDN externa.",
      },
    },

    {
      "@type": "Question",
      name: "¿Qué formatos de imagen son compatibles?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "La herramienta admite imágenes JPG, PNG y WebP. Las imágenes muy grandes pueden redimensionarse durante el procesamiento para mejorar el rendimiento del navegador.",
      },
    },

    {
      "@type": "Question",
      name: "¿Puedo descargar la imagen sin marca de agua?",

      acceptedAnswer: {
        "@type": "Answer",

        text:
          "Sí. NEXORA no añade su propia marca de agua a la imagen PNG generada.",
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
    "Herramienta gratuita basada en navegador para eliminar fondos de fotos y crear imágenes PNG transparentes.",

  url: PAGE_URL,

  inLanguage: "es",

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

      name: "Inicio",

      item: `${SITE_URL}/`,
    },

    {
      "@type": "ListItem",

      position: 2,

      name: "Eliminar Fondo",

      item: `${SITE_URL}/background-remover/`,
    },

    {
      "@type": "ListItem",

      position: 3,

      name: "Español",

      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",

  "@type": "HowTo",

  name: "Cómo eliminar el fondo de una foto",

  description:
    "Aprende a eliminar el fondo de una foto con NEXORA y crear una imagen PNG transparente.",

  step: [
    {
      "@type": "HowToStep",

      position: 1,

      name: "Sube tu foto",

      text:
        "Sube una imagen JPG, PNG o WebP a NEXORA Background Remover.",
    },

    {
      "@type": "HowToStep",

      position: 2,

      name: "Espera el procesamiento",

      text:
        "La IA basada en el navegador procesa la imagen y elimina el fondo original.",
    },

    {
      "@type": "HowToStep",

      position: 3,

      name: "Selecciona el fondo",

      text:
        "Elige entre Transparente, Blanco, Azul o Rojo según tus necesidades.",
    },

    {
      "@type": "HowToStep",

      position: 4,

      name: "Descarga el PNG",

      text:
        "Descarga la imagen procesada en formato PNG.",
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
