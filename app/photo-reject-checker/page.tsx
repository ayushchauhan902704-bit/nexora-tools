import type { Metadata } from "next";
import PhotoCheckerClient from "./PhotoCheckerClient";

export const metadata: Metadata = {
  title: "Will Your Photo Be Rejected? Free Photo Checker for SSC, UPSC, NEET | NEXORA",
  description: "Check if your photo will be rejected for SSC, UPSC, IBPS, NEET, Passport. Free instant check for size, format, white background & clarity. 100% private.",
  alternates: { canonical: "https://thenexoratools.com/photo-reject-checker" },
  openGraph: {
    title: "Will Your Photo Be Rejected? Check in 2 Seconds",
    description: "Free photo checker for SSC, UPSC, NEET, Passport. Size, Format, Background check.",
    url: "https://thenexoratools.com/photo-reject-checker",
    type: "website",
  },
};

export default function Page() {
  return <PhotoCheckerClient />;
}
