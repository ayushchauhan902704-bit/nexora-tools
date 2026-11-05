import type { Metadata } from "next";
import HumanizerTool from "./HumanizerTool";

export const metadata: Metadata = {
  title: "AI Text Humanizer Online Free - No Watermark | Nexora",
  description: "Humanize AI text in 2 seconds. Free AI to human text converter. Make AI text natural, bypass AI detection. No login, 100% private.",
  keywords: ["AI text humanizer", "humanize AI text", "AI to human text converter", "free AI humanizer", "humanize text online", "bypass AI detection", "make AI text natural", "rewrite AI content", "undetectable AI text"],
  alternates: { canonical: "https://nexora-tools.com/ai-text-humanizer" },
  openGraph: {
    title: "AI Text Humanizer Online Free - No Watermark | Nexora",
    description: "Paste AI text, get natural human-like text. Free, No Login, 100% Private.",
    url: "https://nexora-tools.com/ai-text-humanizer",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this AI text humanizer free?", acceptedAnswer: { "@type": "Answer", text: "Yes, it is 100% free. No login, no watermark, no limit." } },
    { "@type": "Question", name: "Does it bypass AI detection?", acceptedAnswer: { "@type": "Answer", text: "It rewrites robotic words into natural human words, which helps make text sound more natural." } },
    { "@type": "Question", name: "Is my data safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Your text is processed in your browser only. We never save or upload your text to any server." } },
    { "@type": "Question", name: "Can I use it for assignments and blogs?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can use it for blogs, assignments, emails and social media posts to make them sound natural." } },
    { "@type": "Question", name: "Is there any watermark?", acceptedAnswer: { "@type": "Answer", text: "No. Output is 100% clean with no watermark." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Humanize AI Text",
  step: [
    { "@type": "HowToStep", text: "Paste your AI text in the box." },
    { "@type": "HowToStep", text: "Click Humanize Text button." },
    { "@type": "HowToStep", text: "Copy the natural human-like output." },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools.com/" },
          { "@type": "ListItem", position: 2, name: "AI Text Humanizer", item: "https://nexora-tools.com/ai-text-humanizer" }
        ]
      }) }} />
      <HumanizerTool />
    </>
  );
}
