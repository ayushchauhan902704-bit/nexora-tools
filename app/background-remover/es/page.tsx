import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/es`;

export const metadata: Metadata = {
  title: "Elimina el Fondo de tu Foto en 5 Segundos - Gratis, Sin Marca de Agua | NEXORA",
  description:
    "Elimina el fondo de cualquier foto en solo 5 segundos - 100% Gratis, IA de 1 Clic. Crea PNG transparente o fondo Blanco / Azul / Rojo. Sin Photoshop, Sin Registro, Sin Marca de Agua. ¡Prueba Ahora!",
  keywords: [
    "eliminar fondo de foto",
    "removedor de fondo",
    "quitar fondo de foto",
    "quitar fondo de imagen",
    "fondo transparente png",
    "eliminar fondo sin photoshop",
    "foto carnet fondo blanco",
    "borrar fondo de foto",
  ],
  authors: [{ name: "Ayush Chauhan" }],
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
    es: PAGE_URL,
    pt: `${SITE_URL}/background-remover/pt`,
    fr: `${SITE_URL}/background-remover/fr`,
    "zh-CN": `${SITE_URL}/background-remover/zh`,
    ar: `${SITE_URL}/background-remover/ar`,
    de: `${SITE_URL}/background-remover/de`,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
},
  openGraph: {
    title: "Elimina el Fondo de tu Foto en 5 Segundos - Gratis, Sin Marca de Agua | NEXORA",
    description:
      "IA de 1 Clic - Elimina el fondo de tu foto en 5 segundos. PNG transparente o fondo Blanco / Azul / Rojo. 100% Gratis, Sin Marca de Agua, Sin Registro.",
    url: PAGE_URL,
    siteName: "NEXORA",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Removedor de Fondo con IA Gratis - Elimina el fondo en 5 segundos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elimina el Fondo de tu Foto en 5 Segundos - Gratis, Sin Marca de Agua",
    description:
      "Elimina el fondo de cualquier foto en 5 segundos. IA gratis, PNG transparente, Sin Marca de Agua. ¡Pruébalo ahora!",
    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo elimino el fondo de una foto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sube una imagen JPG, PNG o WebP a NEXORA Removedor de Fondo. La IA del navegador procesa la imagen, elimina el fondo y te permite descargar el resultado como PNG.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo eliminar el fondo sin Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. NEXORA Removedor de Fondo funciona directamente en un navegador web moderno, por lo que no necesitas Photoshop ni otro editor de escritorio.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo crear un PNG transparente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Después de eliminar el fondo, puedes descargar el resultado como PNG con fondo transparente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo crear un fondo blanco para una foto carnet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes elegir la opción de fondo Blanco después de eliminar el fondo original. Los requisitos de foto varían según el país y el documento, así que siempre revisa los requisitos oficiales de tu trámite.",
      },
    },
    {
      "@type": "Question",
      name: "¿Funciona en iPhone y Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La herramienta está diseñada para funcionar en navegadores móviles y de escritorio modernos, incluidos iPhone, Android, Windows y Mac compatibles.",
      },
    },
    {
      "@type": "Question",
      name: "¿El removedor de fondo es gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. NEXORA Removedor de Fondo se puede usar gratis sin necesidad de crear una cuenta o registrarse.",
      },
    },
    {
      "@type": "Question",
      name: "¿Mi foto se sube a un servidor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El procesamiento de eliminación de fondo se realiza en el navegador. La imagen seleccionada se procesa localmente en el navegador en lugar de enviarse a un servidor de procesamiento de imágenes de NEXORA. La librería de IA puede descargar recursos del modelo desde su CDN externo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué formatos de imagen son compatibles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La herramienta es compatible con imágenes JPG, PNG y WebP. El tamaño máximo de subida es de 25 MB.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo descargar el resultado sin marca de agua?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. NEXORA no añade marca de agua al PNG generado.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo elimino el fondo de una foto sin Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sube tu foto a NEXORA. La IA del navegador elimina el fondo y crea un PNG transparente que puedes descargar gratis.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Removedor de Fondo",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Removedor de fondo de imagen gratuito basado en navegador para crear PNG transparentes e imágenes con colores de fondo seleccionables.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Removedor de Fondo", item: PAGE_URL },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo Eliminar el Fondo de una Imagen",
  description: "Elimina el fondo de una imagen y descarga un PNG transparente con NEXORA.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Sube una imagen", text: "Sube una imagen JPG, PNG o WebP a NEXORA Removedor de Fondo." },
    { "@type": "HowToStep", position: 2, name: "Elimina el fondo", text: "La IA del navegador procesa la imagen y elimina el fondo." },
    { "@type": "HowToStep", position: 3, name: "Elige un fondo", text: "Elige Transparente, Blanco, Azul o Rojo como fondo de salida." },
    { "@type": "HowToStep", position: 4, name: "Descarga el resultado", text: "Descarga la imagen procesada como PNG sin marca de agua de NEXORA." },
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
