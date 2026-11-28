import type { Metadata } from "next";
import InvoiceClient from "./InvoiceClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/invoice-generator`;

const faqItems = [
  {
    question: "Is this invoice generator free?",
    answer:
      "Yes. You can create an invoice using the tool without a subscription or account.",
  },
  {
    question: "Can I save the invoice as a PDF?",
    answer:
      "Yes. Open the invoice preview and use Print / Save PDF. Your browser's print dialog can save only the invoice as a PDF.",
  },
  {
    question: "Can I add tax and discounts?",
    answer:
      "Yes. You can add percentage-based tax and discount values. The invoice total updates automatically.",
  },
  {
    question: "Can I use different currencies?",
    answer:
      "Yes. The invoice generator supports INR, USD, EUR, GBP, CAD, AUD and JPY currency formats.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. You can enter the invoice information and create the invoice directly in your browser.",
  },
  {
    question: "Is my invoice data uploaded?",
    answer:
      "The invoice interface performs its calculations and invoice rendering in the browser. It does not require an account or server upload to create the invoice.",
  },
  {
    question: "Can I create invoices for services?",
    answer:
      "Yes. Add a service as an item and enter its quantity and price just like a physical product.",
  },
  {
    question: "Can I add payment terms?",
    answer:
      "Yes. The optional Note / Payment Terms field lets you add information such as payment deadlines or other customer instructions.",
  },
  {
    question: "Can I add a due date to my invoice?",
    answer:
      "Yes. You can set an invoice date and a due date. The due date is shown on the invoice preview and in the printed PDF.",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title:
    "Free Invoice Generator Online – Create Professional Invoices | thenexoratools",

  description:
    "Create professional invoices online for free. Add business and customer details, products or services, tax, discounts, due date and payment terms, then print or save your invoice as a PDF.",

  keywords: [
    "invoice generator",
    "free invoice generator",
    "invoice maker",
    "free invoice maker",
    "invoice generator online",
    "professional invoice generator",
    "online invoice maker",
    "create invoice online",
    "invoice PDF generator",
    "business invoice generator",
    "freelance invoice generator",
    "service invoice generator",
    "invoice generator with due date",
    "gst invoice generator",
  ],

  alternates: {
    canonical: PAGE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: PAGE_URL,
    title:
      "Free Invoice Generator Online – Create Professional Invoices | thenexoratools",
    description:
      "Create professional invoices online for free. Add items, tax, discounts, due date and payment terms, then print or save the invoice as a PDF.",
    siteName: "thenexoratools",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator Online | thenexoratools",
    description:
      "Create professional invoices online, calculate totals, add tax and discounts, and print or save your invoice as a PDF.",
  },

  category: "Business",
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "thenexoratools Invoice Generator",
  url: PAGE_URL,
  description:
    "Free online invoice generator for creating professional invoices with business details, customer information, products, services, tax, discounts, due date and payment terms.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with JavaScript enabled.",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Create professional invoices online",
    "Add multiple invoice items",
    "Calculate subtotal and total",
    "Add percentage tax",
    "Add percentage discount",
    "Multiple currency support",
    "Invoice date and due date",
    "Invoice preview",
    "Print or save as PDF",
    "Payment notes and terms",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "thenexoratools",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Invoice Generator",
      item: PAGE_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Page() {
  return (
    <>
      <InvoiceClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
