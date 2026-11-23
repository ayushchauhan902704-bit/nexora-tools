import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "THE NEXORA TOOLS - Free Online Tools by Ayush Chauhan",
  description: "30 Free Online Tools by Ayush Chauhan - Compress Image to 20KB, Background Remover, Passport Photo, Video Compressor. No Watermark, 100% Free, Private.",
  authors: [{ name: "Ayush Chauhan", url: "https://thenexoratools.com/about" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://thenexoratools.com" },
  openGraph: {
    title: "THE NEXORA TOOLS - Free Online Tools by Ayush Chauhan",
    description: "30 Free Tools - No Watermark, 100% Free, Private.",
    url: "https://thenexoratools.com",
    siteName: "THE NEXORA TOOLS",
    type: "website",
    images: [{ url: "https://thenexoratools.com/backgroundremover.jpg", width: 1200, height: 630, alt: "THE NEXORA TOOLS by Ayush Chauhan" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#ffffff" }}>{children}</body>
    </html>
  );
}
