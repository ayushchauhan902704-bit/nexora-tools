import type { Metadata } from "next";
import PassportClient from "./PassportClient";

const SITE_URL = "https://nexora-tools.com";
const PAGE_URL = `${SITE_URL}/passport-size-photo-maker/pt`;

export const metadata: Metadata = {
  title: "Foto 3x4 Online Grátis | Foto Passaporte, Visto, 20KB e 50KB | NEXORA",
  description:
    "Faça foto 3x4 online grátis, foto para passaporte, visto, 20KB e 50KB. Defina tamanho e KB personalizado. HD, sem marca d'água, tudo no navegador.",
  keywords: [
    "foto 3x4 online",
    "foto para passaporte",
    "fazer foto 3x4 online",
    "foto 3x4 gratis",
    "foto passaporte online",
    "redimensionar foto 20kb",
    "diminuir foto para 20kb",
    "foto visto americano",
    "foto 3x4 tamanho",
    "criador de foto 3x4",
  ],
  authors: [{ name: "Ayush Chauhan" }],
  creator: "NEXORA",
  publisher: "NEXORA",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${SITE_URL}/passport-size-photo-maker`,
      "hi-Latn": `${SITE_URL}/passport-size-photo-maker/hi`,
      es: `${SITE_URL}/passport-size-photo-maker/es`,
      pt: PAGE_URL,
      fr: `${SITE_URL}/passport-size-photo-maker/fr`,
      "zh-CN": `${SITE_URL}/passport-size-photo-maker/zh`,
      ar: `${SITE_URL}/passport-size-photo-maker/ar`,
      de: `${SITE_URL}/passport-size-photo-maker/de`,
      id: `${SITE_URL}/passport-size-photo-maker/id`,
      "x-default": `${SITE_URL}/passport-size-photo-maker`,
    },
  },
  openGraph: {
    title: "Foto 3x4 Online Grátis | Foto Passaporte, Visto, 20KB e 50KB",
    description:
      "Faça foto 3x4 online grátis, foto para passaporte, visto, 20KB e 50KB. Tamanho e KB personalizado, sem marca d'água.",
    url: PAGE_URL,
    type: "website",
    siteName: "NEXORA",
    locale: "pt_BR",
    images: [
      {
        url: `${SITE_URL}/og-passport.jpg`,
        width: 1200,
        height: 630,
        alt: "NEXORA Foto 3x4 Online Grátis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foto 3x4 Online Grátis | NEXORA",
    description:
      "Faça foto 3x4 online grátis, foto para passaporte, visto, 20KB e 50KB com tamanho personalizado.",
    images: [`${SITE_URL}/og-passport.jpg`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como fazer foto 3x4 online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Envie sua foto, selecione o tamanho de passaporte ou documento necessário e baixe o JPG processado. A ferramenta funciona direto no seu navegador e é grátis.",
      },
    },
    {
      "@type": "Question",
      name: "Como fazer uma foto 20KB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Selecione uma opção de 20KB como SSC, IBPS ou Railway, ou insira 20 no campo de KB personalizado. A ferramenta comprime a imagem para ficar dentro da meta selecionada.",
      },
    },
    {
      "@type": "Question",
      name: "Como fazer uma foto 50KB?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Selecione a opção UPSC ou Formulário de Banco, ou insira 50 no campo de KB personalizado. A ferramenta comprime a imagem para ficar dentro da meta selecionada.",
      },
    },
    {
      "@type": "Question",
      name: "Posso inserir meu próprio tamanho de foto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Você pode inserir largura e altura personalizadas em pixels. O intervalo suportado é de 50 a 2000 pixels para cada dimensão.",
      },
    },
    {
      "@type": "Question",
      name: "Minha foto é privada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O processamento da imagem é feito no seu navegador. A ferramenta não precisa enviar sua foto para um servidor para processamento normal.",
      },
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
      <PassportClient />
    </>
  );
}
