import type { Metadata } from "next";
import CompressImageClient from "./CompressImageClient";

export const metadata: Metadata = {
  title: "Image Compressor - Reduce Image Size to 20KB, 50KB, 100KB, 200KB Worldwide | NEXORA",
  description: "Compress JPG, PNG and WebP images online worldwide. Choose target file size from 20KB to 500KB, preview your result and download. Free browser-based image compressor - 100% Private, No Watermark, HD Quality.",
  keywords: ["compress image to 20kb", "compress image to 50kb", "compress image to 100kb", "20kb photo maker", "image compressor worldwide", "compress jpg to 20kb", "passport photo 20kb", "upsc photo compressor 20kb"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb" },
  openGraph: {
    title: "Free Image Compressor - Reduce Image Size to 20KB Worldwide | NEXORA",
    description: "Compress JPG, PNG and WebP images to a chosen file size worldwide. Free browser-based image compression with preview and download. 100% Private.",
    url: "https://nexora-tools-drab.vercel.app/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"]
  }
};

export default function Page() {
  return <CompressImageClient />;
}
