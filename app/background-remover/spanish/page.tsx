import type { Metadata } from "next";
import BackgroundRemoverClientSpanish from "./BackgroundRemoverClientSpanish";

export const metadata: Metadata = {
  title: "Eliminar Fondo - Quitar Fondo de Foto en 1 Seg, Gratis HD Sin Marca de Agua | NEXORA",
  description: "Elimina el fondo de cualquier foto en 1 segundo. Consigue fondo Transparente, Blanco para Pasaporte, Azul para Visa, Rojo. 100% Gratis, HD PNG, Sin Marca de Agua, 100% Privado - Tu foto nunca sale de tu dispositivo.",
  keywords: [
    "eliminar fondo",
    "quitar fondo de foto",
    "quitar fondo de imagen",
    "eliminar fondo de foto online gratis",
    "fondo transparente",
    "cambiar fondo de foto a blanco",
    "foto pasaporte fondo blanco",
    "borrar fondo de imagen",
    "remove.bg gratis alternativa",
    "editor de fondo de foto",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "https://nexora-tools.com/background-remover/spanish",
    languages: {
      "en": "https://nexora-tools.com/background-remover/english",
      "hi": "https://nexora-tools.com/background-remover/hindi",
      "es": "https://nexora-tools.com/background-remover/spanish",
      "fr": "https://nexora-tools.com/background-remover/french",
    },
  },
  openGraph: {
    title: "Eliminar Fondo Gratis - 1 Seg, HD, Sin Marca de Agua | NEXORA",
    description: "Elimina el fondo en 1 seg. Transparente, Blanco, Azul, Rojo. Gratis HD PNG, Sin Marca de Agua.",
    url: "https://nexora-tools.com/background-remover/spanish",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eliminar Fondo Gratis - 1 Seg, HD, Sin Marca de Agua",
    description: "Elimina el fondo en 1 seg. Gratis, HD PNG, Sin Marca de Agua.",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Es gratis este eliminador de fondo?", acceptedAnswer: { "@type": "Answer", text: "Sí, 100% gratis, sin marca de agua, ilimitado. Tu foto nunca sale de tu dispositivo." } },
    { "@type": "Question", name: "¿Cómo hacer una foto de pasaporte con fondo blanco?", acceptedAnswer: { "@type": "Answer", text: "Sube tu foto, elimina el fondo, elige Blanco para pasaporte, Azul para visa, y descarga HD PNG." } },
    { "@type": "Question", name: "¿Mi foto está segura y es privada?", acceptedAnswer: { "@type": "Answer", text: "Sí, 100% privado. La IA funciona en tu navegador, tu foto nunca va a ningún servidor." } },
    { "@type": "Question", name: "¿Funciona en iPhone?", acceptedAnswer: { "@type": "Answer", text: "Sí, funciona en iPhone, Android y Laptop. Sin necesidad de app." } },
    { "@type": "Question", name: "¿La calidad se mantiene en HD?", acceptedAnswer: { "@type": "Answer", text: "Sí, HD PNG en calidad original, sin borrosidad, sin marca de agua." } },
    { "@type": "Question", name: "¿Cuál es la mejor alternativa gratis a remove.bg?", acceptedAnswer: { "@type": "Answer", text: "NEXORA es la mejor alternativa gratis a remove.bg - ilimitado, sin marca de agua, HD PNG y 100% privado." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "Cómo Eliminar el Fondo de una Foto",
  step: [
    { "@type": "HowToStep", text: "Sube tu foto JPG, PNG o WebP." },
    { "@type": "HowToStep", text: "La IA elimina el fondo automáticamente en 1 segundo." },
    { "@type": "HowToStep", text: "Elige fondo Transparente, Blanco, Azul o Rojo y Descarga HD PNG." },
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
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://nexora-tools.com/" },
          { "@type": "ListItem", position: 2, name: "Eliminar Fondo", item: "https://nexora-tools.com/background-remover" },
          { "@type": "ListItem", position: 3, name: "Español", item: "https://nexora-tools.com/background-remover/spanish" }
        ]
      }) }} />
      <BackgroundRemoverClientSpanish />
    </>
  );
}
