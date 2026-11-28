import type { Metadata } from "next";
import SalaryCounterClient from "./SalaryCounterClient";

const SITE_URL = "https://thenexoratools.com";
const PAGE_URL = `${SITE_URL}/live-salary-counter`;

export const metadata: Metadata = {
  title:
    "Live Salary Counter - Calculate Earnings Per Second | NEXORA",

  description:
    "Use NEXORA's free Live Salary Counter to calculate your estimated earnings per second, minute, hour, day, week, month and year from your salary.",

  keywords: [
    "live salary counter",
    "salary counter",
    "salary per second calculator",
    "earnings per second calculator",
    "salary calculator",
    "income per second calculator",
    "live income calculator",
    "salary per hour calculator",
    "salary per month calculator",
    "salary per year calculator",
    "earnings calculator",
    "paycheck calculator",
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
      "Live Salary Counter - Calculate Earnings Per Second | NEXORA",
    description:
      "Calculate your estimated salary and earnings per second, minute, hour, day, week, month and year with NEXORA's free Live Salary Counter.",
    siteName: "NEXORA",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Live Salary Counter - Calculate Earnings Per Second | NEXORA",
    description:
      "Free live salary calculator that shows your estimated earnings per second, minute, hour, day, week, month and year.",
  },
};

const faqItems = [
  {
    question: "What is a Live Salary Counter?",
    answer:
      "A Live Salary Counter estimates how much you earn over time based on your salary, pay period and working schedule. It can display estimated earnings per second, minute, hour, day, week, month and year.",
  },
  {
    question: "How does the salary counter calculate earnings per second?",
    answer:
      "The calculator first converts your selected salary period into an estimated annual salary. It then divides the annual salary by your estimated working hours in a year and converts the hourly rate into minute and second rates.",
  },
  {
    question: "Can I calculate salary from monthly income?",
    answer:
      "Yes. Select Month as your salary period, enter your monthly salary, choose your currency and set your working hours and days per week.",
  },
  {
    question: "Can I use this salary counter with different currencies?",
    answer:
      "Yes. The calculator supports USD, EUR, GBP, INR, CAD, AUD and JPY. The calculation is performed using the salary amount you enter and the selected currency symbol.",
  },
  {
    question: "Can I change my working hours and days?",
    answer:
      "Yes. You can adjust your estimated working hours per day and working days per week. These settings are used to calculate your estimated hourly, daily, weekly and smaller time-based earnings.",
  },
  {
    question: "Is the Live Salary Counter free?",
    answer:
      "Yes. NEXORA's Live Salary Counter is free to use and does not require registration.",
  },
  {
    question: "Does the salary counter upload my salary information?",
    answer:
      "The calculator performs its calculations directly in your browser. Your salary input is used by the calculator to produce the displayed results.",
  },
];

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Live Salary Counter",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description:
          "A free online salary counter that calculates estimated earnings per second, minute, hour, day, week, month and year.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "NEXORA",
          url: SITE_URL,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <SalaryCounterClient />

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 14px 50px",
          fontFamily:
            "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          color: "#101828",
        }}
      >
        <div
          style={{
            marginTop: "28px",
            padding: "18px",
            border: "1px solid #e6eaf0",
            borderRadius: "18px",
            background: "#ffffff",
          }}
        >
          <h2
            style={{
              margin: "0 0 9px",
              fontSize: "18px",
              lineHeight: 1.3,
              fontWeight: 900,
            }}
          >
            Live Salary Counter
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              lineHeight: 1.7,
              color: "#667085",
            }}
          >
            Use this free salary counter to estimate how much
            you earn every second, minute, hour, day, week,
            month and year. Enter your salary, select your pay
            period and adjust your working schedule to get a
            personalized earnings breakdown.
          </p>
        </div>

        <div
          style={{
            marginTop: "12px",
            padding: "18px",
            border: "1px solid #e6eaf0",
            borderRadius: "18px",
            background: "#ffffff",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "17px",
              fontWeight: 900,
            }}
          >
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {faqItems.map((item) => (
              <details
                key={item.question}
                style={{
                  border: "1px solid #e7eaf0",
                  borderRadius: "12px",
                  padding: "11px 12px",
                  background: "#fafbfc",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "11px",
                    lineHeight: 1.5,
                    fontWeight: 850,
                    color: "#101828",
                  }}
                >
                  {item.question}
                </summary>

                <p
                  style={{
                    margin: "9px 0 1px",
                    fontSize: "10px",
                    lineHeight: 1.7,
                    color: "#667085",
                  }}
                >
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
