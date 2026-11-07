import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "NEXORA Tools - 29+ Free Tools - Compress Image, Video Compressor, Image to Text",
  description: "29+ Free Tools by NEXORA - Compress Image to Exact KB, Video Compressor to Exact MB, Image to Text OCR, Text to Speech 40+ Languages, PDF Tools HD No Watermark, Private.",
  metadataBase: new URL("https://nexora-tools-drab.vercel.app"),
  robots: { index: true, follow: true },
    verification: { google: "zqASoTyCvuvQ5i316eF2-OKYLmt7vsrr7zVDET5CslY" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* GA - Ab har tool pe auto chalega */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-61NV39S2VE" />
        <Script id="gtag">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-61NV39S2VE');`}
        </Script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
