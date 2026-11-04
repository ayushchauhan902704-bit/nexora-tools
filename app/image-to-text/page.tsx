import type { Metadata } from "next";
import ImageToTextClient from "./ImageToTextClient";

export const metadata: Metadata = {
  title: "Image to Text - Extract Text From Image Free (OCR) Worldwide No.1 | NEXORA",
  description: "Free Image to Text Converter Worldwide - Extract Hindi & English text from JPG, PNG in 3 sec. 100% private, no upload, no signup, no watermark, HD. #1 OCR by NEXORA - Best for students, office work.",
  keywords: ["image to text", "image to text converter", "jpg to text", "png to text", "ocr online", "extract text from image", "hindi ocr", "image se text kaise nikale", "photo se text", "jpg to text hindi", "NEXORA ocr worldwide"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: "index, follow, max-image-preview:large",
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/image-to-text/" },
  openGraph: {
    title: "Image to Text - Extract Text From Image Free | NEXORA Worldwide No.1",
    description: "Best free OCR online worldwide - Extract Hindi + English text from image in 3 seconds. 100% private, no server upload.",
    url: "https://nexora-tools-drab.vercel.app/image-to-text/",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"]
  }
};

export default function Page() {
  return <ImageToTextClient />;
}
