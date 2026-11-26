import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://thenexoratools.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "THE NEXORA TOOLS - Free Online Tools",
    template: "%s | THE NEXORA TOOLS",
  },

  description:
    "Free online tools for everyday tasks. Fast, simple, private and easy to use.",

  authors: [
    {
      name: "Ayush Chauhan",
      url: `${SITE_URL}/about`,
    },
  ],

  creator: "Ayush Chauhan",
  publisher: "THE NEXORA TOOLS",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    siteName: "THE NEXORA TOOLS",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "THE NEXORA TOOLS",
        alternateName: [
          "THE NEXORA",
          "thenexora",
          "thenexoratools",
        ],
        description:
          "Free online tools for everyday tasks.",
        inLanguage: "en",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },

      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "THE NEXORA TOOLS",
        alternateName: "THE NEXORA",
        url: SITE_URL,
        logo: `${SITE_URL}/ayushchauhan.jpg`,
        founder: {
          "@id": `${SITE_URL}/#ayush`,
        },
        email: "ayushchauhan902704@gmail.com",
      },

      {
        "@type": "Person",
        "@id": `${SITE_URL}/#ayush`,
        name: "Ayush Chauhan",
        url: `${SITE_URL}/about`,
        image: `${SITE_URL}/ayushchauhan.jpg`,
        jobTitle: "Founder of THE NEXORA TOOLS",
        description:
          "Ayush Chauhan is the founder of THE NEXORA TOOLS, a free online tools platform.",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3441427422658895"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </head>

      <body
        style={{
          margin: 0,
          background: "#080b14",
        }}
      >
        {children}
      </body>
    </html>
  );
}
