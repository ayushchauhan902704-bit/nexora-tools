import type { Metadata } from "next";
import CPSTestClient from "./CPSTestClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/cps-test`;

export const metadata: Metadata = {
  title: "CPS Test – Clicks Per Second Test | Free Click Speed Test",
  description: "Free CPS Test and click speed test. Test clicks per second with 1, 5, 10, 30 or 60 second challenges, custom timer, 100 click test, peak CPS and consistency.",
  keywords: ["cps test","clicks per second test","click speed test","clicking speed test","mouse cps test","cps tester","click per second test","1 second cps test","5 second cps test","10 second cps test","30 second cps test","60 second cps test","100 click test","100 clicks challenge"],
  authors: [{ name: "Ayush Chauhan" }],
  creator: "NEXORA",
  publisher: "NEXORA",
  robots: { index: true, follow: true, "max-image-preview": "large", googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "CPS Test – Clicks Per Second Test | Free Click Speed Test",
    description: "Test your clicking speed with timed CPS challenges, a 100 click test, custom timer, peak CPS and consistency tracking.",
    url: PAGE_URL,
    siteName: "NEXORA",
    type: "website",
    locale: "en_IN",
    images: [{ url: `${SITE_URL}/og-cps.jpg`, width: 1200, height: 630, alt: "NEXORA CPS Test" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPS Test – Clicks Per Second Test",
    description: "Free online CPS and click speed test with timed challenges, 100 click test and personal best tracking.",
    images: [`${SITE_URL}/og-cps.jpg`],
  },
  category: "Technology",
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this CPS Test free?", acceptedAnswer: { "@type": "Answer", text: "Yes. The CPS Test is free to use and does not require registration." } },
    { "@type": "Question", name: "What is a good CPS score?", acceptedAnswer: { "@type": "Answer", text: "There is no universal perfect score. CPS depends on the input device, clicking technique and test conditions." } },
    { "@type": "Question", name: "Can I take a 1-second CPS test?", acceptedAnswer: { "@type": "Answer", text: "Yes. Select the 1-second option for a quick CPS speed test." } },
    { "@type": "Question", name: "Can I take a 5-second CPS test?", acceptedAnswer: { "@type": "Answer", text: "Yes. The 5-second CPS test is available as one of the standard test durations." } },
    { "@type": "Question", name: "What is the 100 Click Test?", acceptedAnswer: { "@type": "Answer", text: "It measures how quickly you can complete 100 clicks and calculates your CPS from the completion time." } },
    { "@type": "Question", name: "Does the CPS Test work on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. Touch input is supported on compatible Android, iPhone and tablet browsers." } },
    { "@type": "Question", name: "Does this test require an account?", acceptedAnswer: { "@type": "Answer", text: "No account or sign-up is required to run the test." } },
  ],
};

const howToSchema = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use CPS Test",
  description: "Test your clicks per second with timed challenges.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose duration", text: "Choose 1, 5, 10, 30 or 60 seconds or a custom timer." },
    { "@type": "HowToStep", position: 2, name: "Press Start", text: "Press Start Test to begin." },
    { "@type": "HowToStep", position: 3, name: "Click fast", text: "Click or tap the large testing area as quickly as possible." },
    { "@type": "HowToStep", position: 4, name: "View result", text: "View your CPS, peak speed and consistency." },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "CPS Test", item: PAGE_URL },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "NEXORA CPS Test", url: PAGE_URL, applicationCategory: "GameApplication", operatingSystem: "Web Browser",
  browserRequirements: "Requires a modern web browser with pointer or touch input.",
  description: "A free browser-based CPS test with timed click speed tests, custom duration, a 100 click challenge, peak CPS and consistency tracking.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "NEXORA", url: SITE_URL };
const organizationSchema = { "@context": "https://schema.org", "@type": "Organization", name: "NEXORA", url: SITE_URL };

export default function CPSTestPage() {
  const schemas = [faqSchema, howToSchema, breadcrumbSchema, webAppSchema, websiteSchema, organizationSchema];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <CPSTestClient />
    </>
  );
}
