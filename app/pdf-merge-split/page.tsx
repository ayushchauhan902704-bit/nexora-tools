import type { Metadata } from "next";
import PdfMergeClient from "./PdfMergeClient";

export const metadata: Metadata = {
  title: "PDF Merge & Split - Combine & Split PDF Free No Watermark Worldwide | NEXORA",
  description: "Free PDF Merge & Split by NEXORA Worldwide - Merge multiple PDFs to one, split PDF pages. 100% Private browser-based using pdf-lib, no watermark, HD, free forever, iPhone compatible. Best PDF merger splitter.",
  keywords: ["pdf merge", "merge pdf", "split pdf", "pdf merger", "combine pdf", "pdf splitter", "merge pdf online free", "pdf merge no watermark", "iphone pdf merge"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/pdf-merge-split" },
  openGraph: {
    title: "PDF Merge & Split - Combine & Split PDF Free | NEXORA No.1 Worldwide",
    url: "https://nexora-tools-drab.vercel.app/pdf-merge-split",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"]
  }
};

export default function Page() {
  return <PdfMergeClient />;
}
