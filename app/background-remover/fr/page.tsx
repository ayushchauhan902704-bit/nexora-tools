import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/fr`;

export const metadata: Metadata = {
  title:
    "Supprimer le Fond d'une Photo en 5 Secondes - Gratuit, Sans Filigrane | NEXORA",

  description:
    "Supprimez le fond de n'importe quelle photo en 5 secondes seulement - 100% Gratuit, IA en 1 Clic. PNG Transparent ou fond Blanc / Bleu / Rouge. Sans Photoshop, Sans Inscription, Sans Filigrane. Essayez Maintenant !",

  keywords: [
    "supprimer fond photo",
    "effacer fond photo",
    "enlever fond image",
    "détourer image",
    "fond transparent png",
    "supprimer fond sans photoshop",
    "photo identité fond blanc",
    "retirer fond photo",
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
    fr: PAGE_URL,
    "zh-CN": `${SITE_URL}/background-remover/zh`,
    ar: `${SITE_URL}/background-remover/ar`,
    de: `${SITE_URL}/background-remover/de`,
    id: `${SITE_URL}/background-remover/id`,
    "x-default": `${SITE_URL}/background-remover`,
  },
}, 

  openGraph: {
    title:
      "Supprimer le Fond d'une Photo en 5 Secondes - Gratuit, Sans Filigrane | NEXORA",

    description:
      "IA en 1 Clic - Supprimez le fond de votre photo en 5 secondes. PNG Transparent ou fond Blanc / Bleu / Rouge. 100% Gratuit, Sans Filigrane, Sans Inscription.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "fr_FR",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Suppresseur de Fond IA Gratuit - Supprimez le fond en 5 secondes",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Supprimer le Fond d'une Photo en 5 Secondes - Gratuit, Sans Filigrane",

    description:
      "Supprimez le fond de n'importe quelle photo en 5 secondes. IA gratuite, PNG transparent, Sans Filigrane. Essayez maintenant !",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment supprimer le fond d'une photo ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Téléchargez une image JPG, PNG ou WebP sur NEXORA Suppresseur de Fond. L'IA du navigateur traite l'image, supprime le fond et vous permet de télécharger le résultat en PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je supprimer le fond sans Photoshop ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. NEXORA Suppresseur de Fond fonctionne directement dans un navigateur web moderne, vous n'avez donc pas besoin de Photoshop ou d'un autre éditeur de bureau.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je créer un PNG transparent ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Après avoir supprimé le fond, vous pouvez télécharger le résultat en PNG avec fond transparent.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je créer un fond blanc pour une photo d'identité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Vous pouvez choisir l'option fond Blanc après avoir supprimé le fond d'origine. Les exigences de photo varient selon le pays et le document, vérifiez donc toujours les exigences officielles de votre démarche.",
      },
    },
    {
      "@type": "Question",
      name: "Ça fonctionne sur iPhone et Android ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. L'outil est conçu pour fonctionner dans les navigateurs mobiles et de bureau modernes, y compris les appareils iPhone, Android, Windows et Mac compatibles.",
      },
    },
    {
      "@type": "Question",
      name: "Le suppresseur de fond est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. NEXORA Suppresseur de Fond est 100% gratuit et ne nécessite pas de créer un compte ou de s'inscrire.",
      },
    },
    {
      "@type": "Question",
      name: "Ma photo est-elle envoyée vers un serveur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le traitement de suppression de fond est effectué dans le navigateur. L'image est traitée localement dans le navigateur au lieu d'être envoyée vers un serveur de traitement d'images NEXORA. La bibliothèque d'IA peut télécharger des ressources du modèle depuis son CDN externe.",
      },
    },
    {
      "@type": "Question",
      name: "Quels formats d'image sont acceptés ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'outil accepte les images JPG, PNG et WebP. La taille maximale de téléchargement est de 25 Mo.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je télécharger le résultat sans filigrane ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. NEXORA n'ajoute pas de filigrane au PNG généré.",
      },
    },
    {
      "@type": "Question",
      name: "Comment supprimer le fond d'une photo sans Photoshop ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Téléchargez votre photo sur NEXORA. L'IA du navigateur supprime le fond et crée un PNG transparent que vous pouvez télécharger gratuitement.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Suppresseur de Fond",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Suppresseur de fond d'image gratuit dans le navigateur pour créer des PNG transparents et des images avec des couleurs de fond au choix.",
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
      name: "Accueil",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Suppresseur de Fond",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment Supprimer le Fond d'une Image",
  description: "Supprimez le fond d'une image et téléchargez un PNG transparent avec NEXORA.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Téléchargez une image",
      text: "Téléchargez une image JPG, PNG ou WebP sur NEXORA Suppresseur de Fond.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Supprimez le fond",
      text: "L'IA du navigateur traite l'image et supprime le fond.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Choisissez un fond",
      text: "Choisissez Transparent, Blanc, Bleu ou Rouge comme fond de sortie.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Téléchargez le résultat",
      text: "Téléchargez l'image traitée en PNG sans filigrane NEXORA.",
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
