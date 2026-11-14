import type { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/background-remover/pt`;

export const metadata: Metadata = {
  title:
    "Remover Fundo de Foto em 5 Segundos - Grátis, Sem Marca d'Água | NEXORA",

  description:
    "Remova o fundo de qualquer foto em apenas 5 segundos - 100% Grátis, IA de 1 Clique. PNG Transparente ou fundo Branco / Azul / Vermelho. Sem Photoshop, Sem Cadastro, Sem Marca d'Água. Teste Agora!",

  keywords: [
    "remover fundo de foto",
    "removedor de fundo",
    "tirar fundo de foto",
    "remover fundo de imagem",
    "png transparente",
    "remover fundo sem photoshop",
    "foto 3x4 fundo branco",
    "apagar fundo de foto",
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
      pt: PAGE_URL,
      "x-default": `${SITE_URL}/background-remover`,
    },
  },

  openGraph: {
    title:
      "Remover Fundo de Foto em 5 Segundos - Grátis, Sem Marca d'Água | NEXORA",

    description:
      "IA de 1 Clique - Remova o fundo da foto em 5 segundos. PNG Transparente ou fundo Branco / Azul / Vermelho. 100% Grátis, Sem Marca d'Água, Sem Cadastro.",

    url: PAGE_URL,

    siteName: "NEXORA",

    type: "website",

    locale: "pt_BR",

    images: [
      {
        url: `${SITE_URL}/og-background-remover.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Removedor de Fundo com IA Grátis - Remova o fundo em 5 segundos",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Remover Fundo de Foto em 5 Segundos - Grátis, Sem Marca d'Água",

    description:
      "Remova o fundo de qualquer foto em 5 segundos. IA grátis, PNG transparente, Sem Marca d'Água. Teste agora!",

    images: [`${SITE_URL}/og-background-remover.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como remover o fundo de uma foto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Envie uma imagem JPG, PNG ou WebP para o Removedor de Fundo NEXORA. A IA do navegador processa a imagem, remove o fundo e permite baixar o resultado como PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Posso remover o fundo sem Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O Removedor de Fundo NEXORA funciona direto no navegador, então você não precisa de Photoshop ou outro editor de desktop.",
      },
    },
    {
      "@type": "Question",
      name: "Posso criar um PNG transparente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Depois de remover o fundo, você pode baixar o resultado como PNG com fundo transparente.",
      },
    },
    {
      "@type": "Question",
      name: "Posso criar um fundo branco para foto 3x4?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Você pode escolher a opção de fundo Branco depois de remover o fundo original. Os requisitos de foto variam por país e documento, então sempre confira os requisitos oficiais do seu processo.",
      },
    },
    {
      "@type": "Question",
      name: "Funciona no iPhone e Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. A ferramenta foi feita para funcionar em navegadores modernos de celular e computador, incluindo iPhone, Android, Windows e Mac compatíveis.",
      },
    },
    {
      "@type": "Question",
      name: "O removedor de fundo é grátis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O Removedor de Fundo NEXORA é 100% grátis e não precisa criar conta ou fazer cadastro.",
      },
    },
    {
      "@type": "Question",
      name: "Minha foto é enviada para um servidor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O processamento de remoção de fundo é feito no navegador. A imagem é processada localmente no navegador em vez de ser enviada para um servidor de processamento de imagens da NEXORA. A biblioteca de IA pode baixar recursos do modelo a partir do seu CDN externo.",
      },
    },
    {
      "@type": "Question",
      name: "Quais formatos de imagem são aceitos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A ferramenta aceita imagens JPG, PNG e WebP. O tamanho máximo de envio é de 25 MB.",
      },
    },
    {
      "@type": "Question",
      name: "Posso baixar o resultado sem marca d'água?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. A NEXORA não adiciona marca d'água ao PNG gerado.",
      },
    },
    {
      "@type": "Question",
      name: "Como remover o fundo de uma foto sem Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Envie sua foto para a NEXORA. A IA do navegador remove o fundo e cria um PNG transparente que você pode baixar grátis.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NEXORA Removedor de Fundo",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  description:
    "Removedor de fundo de imagem grátis no navegador para criar PNG transparentes e imagens com cores de fundo selecionáveis.",
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
      name: "Início",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Removedor de Fundo",
      item: PAGE_URL,
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como Remover o Fundo de uma Imagem",
  description: "Remova o fundo de uma imagem e baixe um PNG transparente com a NEXORA.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Envie uma imagem",
      text: "Envie uma imagem JPG, PNG ou WebP para o Removedor de Fundo NEXORA.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Remova o fundo",
      text: "A IA do navegador processa a imagem e remove o fundo.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Escolha um fundo",
      text: "Escolha Transparente, Branco, Azul ou Vermelho como fundo de saída.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Baixe o resultado",
      text: "Baixe a imagem processada como PNG sem marca d'água da NEXORA.",
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
