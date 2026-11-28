"use client";

import { useMemo, useState } from "react";

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

type Result = {
  original: number;
  discountAmount: number;
  finalPrice: number;
  percentage: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedCurrency = useMemo(
    () =>
      CURRENCIES.find((item) => item.code === currency) ||
      CURRENCIES[0],
    [currency]
  );

  const calculateDiscount = () => {
    const original = Number(price);
    const percentage = Number(discount);

    if (!price.trim() || !discount.trim()) {
      setError(
        "Please enter both the original price and discount percentage."
      );
      setResult(null);
      return;
    }

    if (!Number.isFinite(original) || original <= 0) {
      setError("Please enter a price greater than 0.");
      setResult(null);
      return;
    }

    if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError("Discount percentage must be between 0% and 100%.");
      setResult(null);
      return;
    }

    const discountAmount = (original * percentage) / 100;
    const finalPrice = original - discountAmount;

    setError("");

    setResult({
      original,
      discountAmount,
      finalPrice,
      percentage,
    });

    if (typeof window !== "undefined") {
      const w = window as Window & {
        gtag?: (...args: unknown[]) => void;
      };

      w.gtag?.("event", "discount_calculated", {
        currency,
        discount_percentage: percentage,
      });
    }
  };

  const resetCalculator = () => {
    setPrice("");
    setDiscount("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;

    const text = [
      "NEXORA Discount Calculator",
      `Original Price: ${selectedCurrency.symbol}${formatNumber(
        result.original
      )}`,
      `Discount: ${result.percentage}%`,
      `Discount Amount: ${selectedCurrency.symbol}${formatNumber(
        result.discountAmount
      )}`,
      `Final Price: ${selectedCurrency.symbol}${formatNumber(
        result.finalPrice
      )}`,
      `Savings: ${selectedCurrency.symbol}${formatNumber(
        result.discountAmount
      )}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy the result. Please try again.");
    }
  };

  return (
    <div className="discount-page">
      <style jsx>{`
        .discount-page {
          --primary: #6c5ce7;
          --primary-dark: #5546cf;
          --text: #171925;
          --muted: #6c7180;
          --border: #e5e7ef;
          --bg: #f6f7fb;

          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(108, 92, 231, 0.08),
              transparent 430px
            ),
            var(--bg);

          color: var(--text);

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;

          padding-bottom: 48px;
        }

        .discount-page * {
          box-sizing: border-box;
        }

        .discount-page button,
        .discount-page input,
        .discount-page select {
          font-family: inherit;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;

          height: 62px;

          background: rgba(255, 255, 255, 0.93);
          backdrop-filter: blur(18px);

          border-bottom: 1px solid var(--border);
        }

        .topbar-inner {
          width: min(980px, calc(100% - 28px));
          height: 100%;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .logo {
          color: var(--text);
          text-decoration: none;

          font-size: 21px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .logo span {
          color: var(--primary);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .free-badge {
          color: #27743d;
          background: #edf9f0;
          border: 1px solid #cfe9d5;

          padding: 5px 10px;
          border-radius: 999px;

          font-size: 9px;
          font-weight: 900;
        }

        .back-link {
          color: var(--primary);
          text-decoration: none;

          font-size: 10.5px;
          font-weight: 850;
        }

        .container {
          width: min(980px, calc(100% - 28px));
          margin: auto;
        }

        .hero {
          max-width: 720px;
          margin: auto;

          text-align: center;

          padding: 27px 8px 19px;
        }

        .eyebrow {
          display: inline-flex;

          padding: 6px 11px;

          border-radius: 999px;

          color: #584cc9;
          background: #eeecff;
          border: 1px solid #dedaff;

          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.3px;
        }

        .hero h1 {
          margin: 11px 0 7px;

          font-size: clamp(28px, 6vw, 42px);
          line-height: 1.04;

          letter-spacing: -1.5px;
          font-weight: 950;
        }

        .hero p {
          max-width: 650px;
          margin: auto;

          color: var(--muted);

          font-size: 11.5px;
          line-height: 1.65;
        }

        .calculator {
          width: min(700px, 100%);
          margin: 0 auto 15px;

          background: #fff;

          border: 1px solid var(--border);
          border-radius: 19px;

          box-shadow:
            0 18px 55px rgba(34, 38, 60, 0.08),
            0 3px 10px rgba(34, 38, 60, 0.03);

          overflow: hidden;
        }

        .calculator-header {
          padding: 19px 20px 16px;

          border-bottom: 1px solid #edf0f4;
        }

        .calculator-header h2 {
          margin: 0;

          font-size: 16px;
          font-weight: 950;
        }

        .calculator-header p {
          margin: 4px 0 0;

          color: #7a7f8d;
          font-size: 10px;
        }

        .form {
          padding: 20px;
        }

        .fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field label {
          display: block;

          margin-bottom: 6px;

          color: #353947;

          font-size: 10.5px;
          font-weight: 900;
        }

        .input-box {
          height: 46px;

          display: flex;
          align-items: center;

          border: 1px solid #dfe2ea;
          border-radius: 11px;

          background: #fff;

          overflow: hidden;

          transition: 0.15s ease;
        }

        .input-box:focus-within {
          border-color: var(--primary);

          box-shadow:
            0 0 0 3px rgba(108, 92, 231, 0.1);
        }

        .currency-select {
          height: 100%;

          border: 0;
          border-right: 1px solid #e8e9ef;

          background: #f8f9fc;

          padding: 0 9px;

          color: #343743;

          font-size: 10.5px;
          font-weight: 850;

          outline: none;
        }

        .input {
          width: 100%;
          height: 100%;

          border: 0;
          outline: none;

          padding: 0 13px;

          background: transparent;

          color: #171925;

          font-size: 14px;
          font-weight: 650;
        }

        .input::placeholder {
          color: #a5a8b3;
        }

        .percent-wrapper {
          position: relative;
        }

        .percent-input {
          padding-right: 35px;
        }

        .percent-symbol {
          position: absolute;

          right: 13px;
          top: 50%;

          transform: translateY(-50%);

          color: #747986;

          font-size: 12px;
          font-weight: 900;
        }

        .error {
          margin-top: 11px;

          padding: 10px 12px;

          color: #9c2f2f;
          background: #fff2f2;

          border: 1px solid #ffd8d8;
          border-radius: 10px;

          font-size: 10px;
          font-weight: 750;

          line-height: 1.5;
        }

        .buttons {
          display: flex;
          gap: 8px;

          margin-top: 14px;
        }

        .calculate-button {
          flex: 1;

          border: 0;
          border-radius: 11px;

          padding: 13px 15px;

          color: #fff;

          background:
            linear-gradient(
              135deg,
              var(--primary),
              var(--primary-dark)
            );

          box-shadow:
            0 9px 22px rgba(108, 92, 231, 0.22);

          font-size: 11.5px;
          font-weight: 900;

          cursor: pointer;
        }

        .calculate-button:hover {
          transform: translateY(-1px);
        }

        .reset-button {
          border: 1px solid #dfe2e9;
          border-radius: 11px;

          background: #fff;

          color: #555a68;

          padding: 13px 16px;

          font-size: 10.5px;
          font-weight: 850;

          cursor: pointer;
        }

        .result {
          margin: 0 20px 20px;

          padding: 17px;

          border: 1px solid #ddd9ff;
          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #f2f0ff 0%,
              #f8fbff 100%
            );
        }

        .result-caption {
          text-align: center;

          color: #6d7180;

          font-size: 8.5px;
          font-weight: 900;

          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .final-price {
          margin: 4px 0 13px;

          color: #28213f;

          text-align: center;

          font-size: clamp(29px, 7vw, 40px);
          line-height: 1;

          font-weight: 950;
          letter-spacing: -1.3px;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .stat {
          padding: 9px 6px;

          text-align: center;

          background: rgba(255, 255, 255, 0.82);

          border: 1px solid rgba(221, 217, 255, 0.9);

          border-radius: 10px;
        }

        .stat-label {
          display: block;

          color: #777b89;

          font-size: 7.5px;
          font-weight: 800;

          text-transform: uppercase;
        }

        .stat-value {
          display: block;

          margin-top: 2px;

          color: #292d3b;

          font-size: 11px;
          font-weight: 950;
        }

        .copy-button {
          display: block;

          margin: 12px auto 0;

          border: 1px solid #d9d5ff;
          border-radius: 9px;

          background: #fff;

          color: #5b4fd0;

          padding: 8px 13px;

          font-size: 9.5px;
          font-weight: 900;

          cursor: pointer;
        }

        .content-card {
          background: #fff;

          border: 1px solid var(--border);
          border-radius: 16px;

          padding: 19px 20px;

          margin-top: 13px;
        }

        .content-card h2 {
          margin: 0 0 7px;

          font-size: 16px;
          line-height: 1.25;

          font-weight: 950;
          letter-spacing: -0.3px;
        }

        .content-card h3 {
          margin: 17px 0 6px;

          color: #5d50d3;

          font-size: 12px;
          font-weight: 950;
        }

        .content-card p,
        .content-card li {
          color: #626878;

          font-size: 10.5px;
          line-height: 1.75;
        }

        .content-card p {
          margin: 0;
        }

        .content-card ul,
        .content-card ol {
          margin: 7px 0 0;
          padding-left: 18px;
        }

        .formula {
          margin-top: 11px;

          padding: 11px 12px;

          border: 1px solid #ececf4;
          border-radius: 10px;

          background: #f8f8fc;

          color: #424652;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 9.5px;
          line-height: 1.8;
        }

        .faq {
          padding: 10px 0;

          border-top: 1px solid #edf0f4;
        }

        .faq:first-of-type {
          border-top: 0;
        }

        .faq summary {
          cursor: pointer;

          color: #292d39;

          font-size: 10.5px;
          font-weight: 900;

          list-style: none;
        }

        .faq summary::-webkit-details-marker {
          display: none;
        }

        .faq p {
          margin-top: 6px;
        }

        .related-tools {
          display: grid;
          grid-template-columns: repeat(3, 1fr);

          gap: 8px;

          margin-top: 10px;
        }

        .related-tool {
          display: block;

          padding: 10px;

          border: 1px solid #e4e7ef;
          border-radius: 10px;

          background: #fafbfe;

          color: #5148ad;

          text-decoration: none;

          font-size: 9.5px;
          font-weight: 900;
        }

        .related-tool:hover {
          border-color: #d3cff9;
        }

        .privacy-note {
          margin-top: 12px;

          padding: 10px 12px;

          border-radius: 10px;

          background: #f7faf8;
          border: 1px solid #e1eee5;

          color: #557060;

          font-size: 9.5px;
          font-weight: 700;

          line-height: 1.5;
        }

        .footer {
          width: min(980px, calc(100% - 28px));

          margin: 27px auto 0;

          padding: 22px 0 4px;

          border-top: 1px solid #e3e5eb;

          display: flex;
          justify-content: space-between;

          gap: 18px;

          flex-wrap: wrap;
        }

        .footer-brand {
          font-size: 13px;
          font-weight: 950;
        }

        .footer-text {
          margin-top: 5px;

          color: #7b7f8c;

          font-size: 9px;
          line-height: 1.7;
        }

        .footer-links {
          display: flex;
          align-items: center;

          gap: 11px;

          flex-wrap: wrap;
        }

        .footer-links a {
          color: #6d7180;

          text-decoration: none;

          font-size: 9px;
          font-weight: 750;
        }

        @media (max-width: 650px) {
          .topbar {
            height: 59px;
          }

          .container,
          .topbar-inner,
          .footer {
            width: min(100% - 20px, 980px);
          }

          .free-badge {
            display: none;
          }

          .hero {
            padding: 22px 5px 16px;
          }

          .hero h1 {
            font-size: 29px;
          }

          .hero p {
            font-size: 11px;
          }

          .calculator {
            border-radius: 16px;
          }

          .calculator-header,
          .form,
          .content-card {
            padding: 17px;
          }

          .fields {
            grid-template-columns: 1fr;
          }

          .result {
            margin: 0 17px 17px;
          }

          .related-tools {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="logo" aria-label="NEXORA home">
            NEX<span>ORA</span>
          </a>

          <div className="top-actions">
            <span className="free-badge">
              FREE • NO SIGN-UP
            </span>

            <a href="/" className="back-link">
              ← All Tools
            </a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">
            SHOPPING • PRICE CALCULATOR
          </span>

          <h1>Discount Calculator</h1>

          <p>
            Calculate discount amount, final price, and savings
            instantly. Enter a price and percentage to get a
            clear result in seconds.
          </p>
        </section>

        <section className="calculator" aria-label="Discount calculator">
          <div className="calculator-header">
            <h2>Calculate Your Discount</h2>

            <p>
              Enter the original price and discount percentage.
            </p>
          </div>

          <div className="form">
            <div className="fields">
              <div className="field">
                <label htmlFor="original-price">
                  Original Price
                </label>

                <div className="input-box">
                  <select
                    className="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    aria-label="Currency"
                  >
                    {CURRENCIES.map((item) => (
                      <option
                        key={item.code}
                        value={item.code}
                      >
                        {item.symbol} {item.code}
                      </option>
                    ))}
                  </select>

                  <input
                    id="original-price"
                    className="input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="1000"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        calculateDiscount();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="discount-percentage">
                  Discount Percentage
                </label>

                <div className="input-box percent-wrapper">
                  <input
                    id="discount-percentage"
                    className="input percent-input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="20"
                    value={discount}
                    onChange={(e) => {
                      setDiscount(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        calculateDiscount();
                      }
                    }}
                  />

                  <span className="percent-symbol">%</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            <div className="buttons">
              <button
                type="button"
                className="calculate-button"
                onClick={calculateDiscount}
              >
                Calculate Discount →
              </button>

              <button
                type="button"
                className="reset-button"
                onClick={resetCalculator}
              >
                Reset
              </button>
            </div>
          </div>

          {result && (
            <div className="result" aria-live="polite">
              <div className="result-caption">
                Final Price
              </div>

              <div className="final-price">
                {selectedCurrency.symbol}
                {formatNumber(result.finalPrice)}
              </div>

              <div className="result-grid">
                <div className="stat">
                  <span className="stat-label">
                    Original
                  </span>

                  <span className="stat-value">
                    {selectedCurrency.symbol}
                    {formatNumber(result.original)}
                  </span>
                </div>

                <div className="stat">
                  <span className="stat-label">
                    Discount
                  </span>

                  <span className="stat-value">
                    {result.percentage}%
                  </span>
                </div>

                <div className="stat">
                  <span className="stat-label">
                    You Save
                  </span>

                  <span className="stat-value">
                    {selectedCurrency.symbol}
                    {formatNumber(result.discountAmount)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="copy-button"
                onClick={copyResult}
              >
                {copied ? "✓ Result Copied" : "Copy Result"}
              </button>
            </div>
          )}
        </section>

        <section className="content-card">
          <h2>What Is a Discount Calculator?</h2>

          <p>
            A discount calculator helps you calculate the discount
            amount, final selling price, and money saved from a
            percentage-based offer. It is useful for shopping,
            sales, coupons, clearance deals, promotional prices,
            and everyday price comparisons.
          </p>

          <div className="formula">
            Discount Amount = Original Price × Discount % ÷ 100
            <br />
            Final Price = Original Price − Discount Amount
          </div>

          <h3>Example: 20% Off 1,000</h3>

          <p>
            For an item priced at 1,000 with a 20% discount, the
            discount amount is 200 and the final price is 800.
            You save 200.
          </p>
        </section>

        <section className="content-card">
          <h2>How to Calculate a Discount</h2>

          <ol>
            <li>Enter the original or listed price.</li>
            <li>
              Enter the discount percentage, such as 10%, 20%,
              or 50%.
            </li>
            <li>Choose your currency if required.</li>
            <li>
              Select Calculate Discount to see the final price
              and savings.
            </li>
          </ol>

          <h3>Example Calculation</h3>

          <div className="formula">
            Original Price = 2,500
            <br />
            Discount = 15%
            <br />
            Discount Amount = 2,500 × 15 ÷ 100 = 375
            <br />
            Final Price = 2,500 − 375 = 2,125
          </div>
        </section>

        <section className="content-card">
          <h2>Discount Calculator Features</h2>

          <ul>
            <li>
              Calculates final price and savings together.
            </li>
            <li>
              Supports multiple commonly used currencies.
            </li>
            <li>
              Works on mobile phones, tablets, and desktop
              browsers.
            </li>
            <li>
              No registration or account is required.
            </li>
            <li>
              Clear validation helps prevent invalid
              calculations.
            </li>
            <li>
              Copy the calculated result with one tap.
            </li>
            <li>
              Designed for fast everyday price calculations.
            </li>
          </ul>

          <div className="privacy-note">
            🔒 No file upload or account is required to calculate
            a discount.
          </div>
        </section>

        <section className="content-card">
          <h2>Use It for Shopping and Sales</h2>

          <p>
            Use this calculator for online shopping, store
            discounts, seasonal sales, coupon offers, clearance
            prices, percentage-off promotions, and price
            comparisons. Instead of calculating percentages
            manually, enter two values and get the result
            instantly.
          </p>

          <h3>Common Discount Examples</h3>

          <ul>
            <li>10% off a product price</li>
            <li>20% off during a sale</li>
            <li>30% or 40% promotional discounts</li>
            <li>50% off clearance offers</li>
            <li>75% off limited-time sales</li>
          </ul>
        </section>

        <section className="content-card">
          <h2>Frequently Asked Questions</h2>

          <details className="faq" open>
            <summary>
              What is a discount calculator?
            </summary>

            <p>
              A discount calculator calculates the discount
              amount and final price from an original price and
              discount percentage.
            </p>
          </details>

          <details className="faq">
            <summary>
              How do I calculate a 20% discount?
            </summary>

            <p>
              Multiply the original price by 20 and divide by
              100. For example, a 1,000 price with a 20%
              discount gives a 200 discount and an 800 final
              price.
            </p>
          </details>

          <details className="faq">
            <summary>
              What is the discount formula?
            </summary>

            <p>
              Discount Amount = Original Price × Discount
              Percentage ÷ 100. Final Price = Original Price −
              Discount Amount.
            </p>
          </details>

          <details className="faq">
            <summary>
              Can I use this calculator on my phone?
            </summary>

            <p>
              Yes. The calculator is designed for modern mobile
              phones, tablets, and desktop browsers.
            </p>
          </details>

          <details className="faq">
            <summary>
              Is this discount calculator free?
            </summary>

            <p>
              Yes. It is free to use and does not require
              registration.
            </p>
          </details>

          <details className="faq">
            <summary>
              Can I calculate a 50% or 75% discount?
            </summary>

            <p>
              Yes. The calculator accepts discount values from
              0% through 100%.
            </p>
          </details>
        </section>

        <section className="content-card">
          <h2>Related Calculators</h2>

          <div className="related-tools">
            <a
              className="related-tool"
              href="/percentage-calculator"
            >
              Percentage Calculator
            </a>

            <a
              className="related-tool"
              href="/age-calculator"
            >
              Age Calculator
            </a>

            <a
              className="related-tool"
              href="/loan-emi-calculator"
            >
              Loan EMI Calculator
            </a>
          </div>
        </section>

        <footer className="footer">
          <div>
            <div className="footer-brand">
              NEXORA — Free Online Tools
            </div>

            <div className="footer-text">
              Simple, useful browser tools for everyday tasks.
              <br />
              Built by Ayush Chauhan · India
            </div>
          </div>

          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
