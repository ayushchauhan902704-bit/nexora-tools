import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXORA Tools - 29+ Free Tools - Compress Image, Video Compressor, Image to Text",
  description: "29+ Free Tools by NEXORA - Compress Image to Exact KB, Video Compressor to Exact MB, Image to Text OCR, Text to Speech 40+ Languages, PDF Tools HD No Watermark, Private.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
