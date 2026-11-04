import type { Metadata } from "next";
import dynamic from "next/dynamic";

const VideoCompressorClient = dynamic(() => import("./VideoCompressorClient"), { ssr: false });

export const metadata: Metadata = {
  title: "Free Video Compressor Online to 5MB, 10MB, 20MB Worldwide No.1 | NEXORA",
  description: "Free video compressor online worldwide to compress video to 5MB, 10MB, 20MB. Online video size reducer, MP4 video compressor, WhatsApp 16MB & Discord 8MB compressor with audio, no watermark, 100% private client-side.",
  keywords: ["compress video to 5MB", "compress video to 10MB", "compress video to 20MB", "video compressor", "whatsapp video compressor", "discord video compressor", "mp4 video compressor", "video compressor with audio", "no watermark", "compress video on iPhone"],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/video-compressor" },
  openGraph: {
    title: "Free Video Compressor Online to 5MB, 10MB, 20MB | NEXORA No.1 Worldwide",
    description: "Reduce video file size online worldwide. Free MP4 video compressor, WhatsApp & Discord compressor, with audio, no watermark, 100% private.",
    url: "https://nexora-tools-drab.vercel.app/video-compressor",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"]
  }
};

export default function Page() {
  return <VideoCompressorClient />;
}
