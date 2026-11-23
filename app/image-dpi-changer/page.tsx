import type { Metadata } from "next";
import DpiChangerClient from "./DpiChangerClient";

export const metadata: Metadata = {
  title: "Change Photo DPI Online - 10 to 1200 DPI in 1 Sec | NEXORA",
  description: "Change photo DPI from 10 to 1200 in 1 second. Free DPI changer for JPG, PNG, HEIC. Best for Passport, Visa, Amazon & Printing. No watermark, 100% private.",
  alternates: { canonical: "https://thenexoratools.com/image-dpi-changer" },
  openGraph: {
    title: "Change Photo DPI Online - 10 to 1200 DPI in 1 Sec",
    description: "Any DPI 10-1200. Best for Passport, Visa & Printing.",
    url: "https://thenexoratools.com/image-dpi-changer",
    type: "website",
  },
};

export default function Page() {
  return <DpiChangerClient />;
}
