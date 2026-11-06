import type { Metadata } from "next";
import HandwritingClient from "./HandwritingClient";

export const metadata: Metadata = {
  title: "Escritura a Mano a Texto - Convertir Apuntes Escritos a Mano en Texto | NEXORA",
  description: "Convierte tu foto de escritura a mano en texto escrito limpio en línea. Escritura a mano a texto con IA para Apuntes de Escuela, Apuntes de Universidad, Tareas. Gratis, 100% Privado, Descarga PDF y Word.",
  keywords: ["escritura a mano a texto", "convertir escritura a mano", "foto a texto", "apuntes a texto", "convertidor de escritura", "imagen a texto"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools.com/handwriting-to-text/spanish" },
  openGraph: {
    title: "Escritura a Mano a Texto Gratis - Convertidor de Apuntes con IA | NEXORA",
    description: "Convierte tu foto de escritura a mano en Texto Escrito limpio. Gratis, Privado, Descarga PDF y Word.",
    url: "https://nexora-tools.com/handwriting-to-text/spanish",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Cómo convertir escritura a mano a texto?", acceptedAnswer: { "@type": "Answer", text: "Sube tu foto de escritura a mano, pulsa Crear Texto con IA, luego descarga PDF o Word. Es gratis." } },
    { "@type": "Question", name: "¿Es gratis convertir escritura a mano a texto?", acceptedAnswer: { "@type": "Answer", text: "Sí, 100% gratis. Sin inicio de sesión, sin marca de agua." } },
    { "@type": "Question", name: "¿Leerá escritura en español?", acceptedAnswer: { "@type": "Answer", text: "Sí, lee escritura en español, inglés e hindi." } },
    { "@type": "Question", name: "¿Mi foto está segura?", acceptedAnswer: { "@type": "Answer", text: "Sí, la foto solo se usa para leer el texto, no se guarda." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo", name: "Cómo Convertir Escritura a Mano a Texto",
  step: [
    { "@type": "HowToStep", text: "Sube tu foto de escritura a mano." },
    { "@type": "HowToStep", text: "Pulsa Crear Texto con IA." },
    { "@type": "HowToStep", text: "Descarga PDF, Word o Copia." },
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
          { "@type": "ListItem", position: 2, name: "Escritura a Mano a Texto", item: "https://nexora-tools.com/handwriting-to-text/spanish" }
        ]
      }) }} />
      <HandwritingClient />
    </>
  );
}
