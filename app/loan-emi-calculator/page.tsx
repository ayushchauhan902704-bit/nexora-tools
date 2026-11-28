import type { Metadata } from "next";
import LoanEMIClient from "./LoanEMIClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/loan-emi-calculator`;

const faqItems = [
  {
    question: "What is an EMI?",
    answer:
      "EMI stands for Equated Monthly Instalment. It is the regular payment made toward a loan over a selected repayment period.",
  },
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated using the standard reducing-balance formula based on the principal amount, monthly interest rate and number of monthly payments.",
  },
  {
    question:
      "Can I use this calculator for home, car or personal loans?",
    answer:
      "Yes. The calculator can be used for different types of loans when you know the loan amount, interest rate and repayment period.",
  },
  {
    question: "What happens when the interest rate is 0%?",
    answer:
      "At 0% interest, the principal is divided equally across the selected number of monthly payments.",
  },
  {
    question:
      "Can I calculate the maximum loan amount from my EMI?",
    answer:
      "Yes. Use the EMI Calculator mode, enter the monthly EMI you can afford, interest rate and repayment tenure, and the calculator estimates the corresponding maximum loan amount.",
  },
  {
    question: "Does a longer loan tenure reduce EMI?",
    answer:
      "Usually, yes. A longer repayment period generally lowers the monthly EMI but can increase the total interest paid over the life of the loan.",
  },
  {
    question: "Can I estimate loan prepayment savings?",
    answer:
      "Yes. Loan Calculator mode includes an optional monthly prepayment estimate that can show potential interest savings and the estimated reduction in repayment time.",
  },
  {
    question: "Are the calculator results guaranteed by a lender?",
    answer:
      "No. The results are mathematical estimates for planning purposes. Actual lender calculations may differ because of fees, taxes, insurance, rate changes, rounding and lender-specific terms.",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title:
    "Loan & EMI Calculator Online – Monthly Payment, Interest & Loan Amount | NEXORA",

  description:
    "Free online Loan and EMI Calculator. Calculate monthly EMI, total interest, total repayment, or estimate the maximum loan amount from your affordable EMI. Supports multiple currencies and flexible loan tenures.",

  keywords: [
    "loan calculator",
    "emi calculator",
    "loan emi calculator",
    "emi calculator online",
    "monthly emi calculator",
    "loan payment calculator",
    "home loan calculator",
    "car loan calculator",
    "personal loan calculator",
    "maximum loan calculator",
    "loan interest calculator",
    "emi payment calculator",
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
      "Loan & EMI Calculator Online – Monthly Payment & Interest | NEXORA",
    description:
      "Calculate monthly EMI, total interest, total repayment, or estimate the maximum loan amount from your affordable EMI with NEXORA.",
    siteName: "NEXORA",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Loan & EMI Calculator Online | NEXORA",
    description:
      "Free Loan and EMI Calculator for monthly payments, total interest, total repayment and maximum loan estimates.",
  },

  category: "Finance",
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NEXORA Loan & EMI Calculator",
  url: PAGE_URL,
  description:
    "Free online Loan and EMI Calculator for calculating monthly EMI, total interest, total repayment and estimated maximum loan amount.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with JavaScript enabled.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  isAccessibleForFree: true,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "NEXORA",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Loan & EMI Calculator",
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
      <LoanEMIClient />

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
