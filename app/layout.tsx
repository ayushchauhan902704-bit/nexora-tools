import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "THE NEXORA TOOLS - 30 Free Online Tools by Ayush Chauhan",
  description: "THE NEXORA TOOLS by Ayush Chauhan - 30 Free Online Tools. Compress Image to 20KB, Background Remover, Passport Photo Maker, JPG to PDF, Video Compressor. No Watermark, 100% Free, Private. Visit thenexoratools.com",
  keywords: ["THE NEXORA", "thenexora", "thenexoratools", "Ayush Chauhan", "Nexora Tools", "free online tools", "compress image to 20kb", "background remover"],
  authors: [{ name: "Ayush Chauhan", url: "https://thenexoratools.com/about" }],
  creator: "Ayush Chauhan",
  publisher: "THE NEXORA TOOLS",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://thenexoratools.com" },
  openGraph: {
    title: "THE NEXORA TOOLS - 30 Free Online Tools by Ayush Chauhan",
    description: "30 Free Tools - No Watermark, 100% Free, Private. Founded by Ayush Chauhan.",
    url: "https://thenexoratools.com",
    siteName: "THE NEXORA TOOLS",
    type: "website",
    images: [{ url: "https://thenexoratools.com/ayushchauhan.jpg", width: 1200, height: 630, alt: "Ayush Chauhan - Founder of THE NEXORA TOOLS" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://thenexoratools.com/#website",
        url: "https://thenexoratools.com",
        name: "THE NEXORA TOOLS",
        alternateName: ["THE NEXORA", "thenexora", "thenexoratools"],
        description: "30 Free Online Tools by Ayush Chauhan - No Watermark, 100% Free, Private.",
        inLanguage: "en",
        publisher: { "@id": "https://thenexoratools.com/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "https://thenexoratools.com/#organization",
        name: "THE NEXORA TOOLS",
        alternateName: "THE NEXORA",
        url: "https://thenexoratools.com",
        logo: "https://thenexoratools.com/ayushchauhan.jpg",
        founder: { "@id": "https://thenexoratools.com/#ayush" },
        email: "ayushchauhan902704@gmail.com"
      },
      {
        "@type": "Person",
        "@id": "https://thenexoratools.com/#ayush",
        name: "Ayush Chauhan",
        url: "https://thenexoratools.com",
        image: "https://thenexoratools.com/ayushchauhan.jpg",
        jobTitle: "Founder of THE NEXORA TOOLS",
        description: "Ayush Chauhan is the founder of THE NEXORA TOOLS (thenexoratools.com), a free online tools platform with 30 free tools."
      }
    ]
  };
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body style={{ margin: 0, background: "#ffffff" }}>{children}</body>
    </html>
  );
}
