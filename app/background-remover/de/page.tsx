import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/de`;

export const metadata: Metadata = {
  title:
    "Foto-Hintergrund in 5 Sekunden entfernen - Kostenlos, Ohne Wasserzeichen | NEXORA",

  description:
    "Entferne den Hintergrund von jedem Foto in nur 5 Sekunden - 100% Kostenlos, 1-Klick KI. Erhalte ein transparentes PNG oder einen weißen / blauen / roten Hintergrund. Ohne Photoshop, Ohne Anmeldung, Ohne Wasserzeichen. Jetzt testen!",

  keywords: [
    "foto hintergrund entfernen",
    "hintergrund entfernen",
    "hintergrund entferner",
    "bild freistellen",
    "transparenter hintergrund",
    "passfoto hintergrund weiß",
    "hintergrund entfernen kostenlos",
    "foto hintergrund ändern",
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
    de: PAGE_URL,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
},

  openGraph: {
    title:
      "Foto-Hintergrund in 5 Sekunden entfernen - Kostenlos, Ohne Wasserzeichen | NEXORA",

    description:
      "1-Klick KI - Entferne den Foto-Hintergrund in 5 Sekunden. Transparentes PNG oder weißer / blauer / roter Hintergrund. 100% Kostenlos, Ohne Wasserzeichen, Ohne Anmeldung.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "de_DE",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Kostenloser KI-Hintergrund-Entferner - Hintergrund in 5 Sekunden entfernen",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Foto-Hintergrund in 5 Sekunden entfernen - Kostenlos, Ohne Wasserzeichen",

    description:
      "Entferne den Hintergrund von jedem Foto in 5 Sekunden. Kostenlose KI, Transparentes PNG, Ohne Wasserzeichen. Jetzt testen!",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie entferne ich den Hintergrund eines Fotos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lade ein JPG-, PNG- oder WebP-Bild in den NEXORA Hintergrund-Entferner hoch. Die KI im Browser verarbeitet das Bild, entfernt den Hintergrund und lässt dich das Ergebnis als PNG herunterladen.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich den Hintergrund ohne Photoshop entfernen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Der NEXORA Hintergrund-Entferner läuft direkt in einem modernen Webbrowser, daher brauchst du kein Photoshop oder einen anderen Desktop-Bildeditor.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich ein transparentes PNG erstellen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Nach dem Entfernen des Hintergrunds kann das Ergebnis als PNG mit transparentem Hintergrund heruntergeladen werden.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich einen weißen Hintergrund für ein Passfoto erstellen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Du kannst nach dem Entfernen des ursprünglichen Hintergrunds die Option Weißer Hintergrund wählen. Die Fotoanforderungen variieren je nach Land und Dokument, prüfe daher immer die offiziellen Anforderungen für deinen Antrag.",
      },
    },
    {
      "@type": "Question",
      name: "Funktioniert es auf iPhone und Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Das Tool ist für moderne Mobil- und Desktop-Browser konzipiert, einschließlich unterstützter iPhone-, Android-, Windows- und Mac-Geräte.",
      },
    },
    {
      "@type": "Question",
      name: "Ist der Hintergrund-Entferner kostenlos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Der NEXORA Hintergrund-Entferner ist kostenlos nutzbar, ohne dass ein Konto oder eine Anmeldung erforderlich ist.",
      },
    },
    {
      "@type": "Question",
      name: "Wird mein Foto auf einen Server hochgeladen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Die Hintergrund-Entfernung wird im Browser durchgeführt. Das ausgewählte Bild wird lokal verarbeitet und nicht an einen NEXORA-Bildverarbeitungsserver gesendet. Die KI-Bibliothek lädt möglicherweise Modellressourcen von ihrem externen CDN herunter.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Bildformate werden unterstützt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Tool unterstützt JPG-, PNG- und WebP-Bilder. Die maximale Upload-Größe beträgt 25 MB.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich ohne Wasserzeichen herunterladen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. NEXORA fügt dem generierten PNG kein Wasserzeichen hinzu.",
      },
    },
    {
      "@type": "Question",
      name: "Wie entferne ich den Hintergrund ohne Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lade dein Foto zu NEXORA hoch. Die KI im Browser entfernt den Hintergrund und erstellt ein transparentes PNG, das du kostenlos herunterladen kannst.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Hintergrund-Entferner",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Kostenloser browserbasierter Bild-Hintergrund-Entferner zum Erstellen transparenter PNGs und Bilder mit wählbaren Hintergrundfarben.",
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
      name: "Startseite",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Hintergrund-Entferner",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "So entfernst du einen Bildhintergrund",
  description: "Entferne einen Bildhintergrund und lade ein transparentes PNG mit NEXORA herunter.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Bild hochladen",
      text: "Lade ein JPG-, PNG- oder WebP-Bild in den NEXORA Hintergrund-Entferner hoch.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Hintergrund entfernen",
      text: "Die KI im Browser verarbeitet das Bild und entfernt den Hintergrund.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Hintergrund wählen",
      text: "Wähle Transparent, Weiß, Blau oder Rot als Ausgabe-Hintergrund.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Ergebnis herunterladen",
      text: "Lade das verarbeitete Bild als PNG ohne NEXORA-Wasserzeichen herunter.",
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
