import type { Metadata } from "next";
import VideoTool from "./VideoTool";

export const metadata: Metadata = {
  title: "Video Compressor to 500KB, 1MB, 5MB, 10MB, 20MB, 100MB Online Free | NEXORA",
  description: "Free video compressor online. Compress video to 500KB, 1MB, 2MB, 5MB, 10MB, 20MB, 50MB, 100MB. MP4 video compressor, WhatsApp video compressor, reduce video size without watermark, 100x fast.",
  keywords: ["video compressor", "compress video to 500kb", "compress video to 1mb", "compress video to 5mb", "compress video to 10mb", "compress video to 20mb", "compress video to 100mb", "video compressor online free", "mp4 video compressor", "whatsapp video compressor", "reduce video size"],
  robots: "index, follow",
  alternates: { canonical: "https://nexora-tools.vercel.app/video-compressor" },
  openGraph: {
    title: "Video Compressor to 500KB - 100MB | 100x Fast Free | NEXORA",
    description: "Compress video to any size 500KB to 100MB. 100x fast, free, no watermark, with audio.",
    type: "website",
  },
};

export default function Page() {
  return <VideoTool />;
}
