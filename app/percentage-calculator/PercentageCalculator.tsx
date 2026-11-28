"use client";

import { useMemo, useState } from "react";

type Mode = "of" | "what" | "reverse" | "change";
type ChangeType = "increase" | "decrease";

const pink = "#ec4899";
const purple = "#7c3aed";

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  const rounded = parseFloat(value.toFixed(2));
  return rounded.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function cleanNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("of");

  const [percentage, setPercentage] = useState("");
  const [number, setNumber] = useState("");

  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");

  const [knownValue, setKnownValue] = useState("");
  const [knownPercentage, setKnownPercentage] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("");

  const [base, setBase] = useState("");
  const [changePercentage, setChangePercentage] = useState("");
  const [changeType, setChangeType] =
    useState<ChangeType>("increase");

  const result = useMemo(() => {
    if (mode === "of") {
      const p = cleanNumber(percentage);
      const n = cleanNumber(number);

      if (p === null || n === null) return null;

      const answer = (n * p) / 100;

      return {
        value: answer,
        title: `${formatNumber(p)}% of ${formatNumber(n)}`,
        formula: `${formatNumber(n)} × ${formatNumber(p)} ÷ 100 = ${formatNumber(answer)}`,
      };
    }

    if (mode === "what") {
      const x = cleanNumber(part);
      const y = cleanNumber(whole);

      if (x === null || y === null || y === 0) return null;

      const answer = (x / y) * 100;

      return {
        value: answer,
        title: `${formatNumber(x)} is what percentage of ${formatNumber(y)}?`,
        formula: `(${formatNumber(x)} ÷ ${formatNumber(y)}) × 100 = ${formatNumber(answer)}%`,
      };
    }

    if (mode === "reverse") {
      const value = cleanNumber(knownValue);
      const known = cleanNumber(knownPercentage);
      const target = cleanNumber(targetPercentage);

      if (
        value === null ||
        known === null ||
        target === null ||
        known === 0
      ) {
        return null;
      }

      const wholeAmount = value / (known / 100);
      const answer = wholeAmount * (target / 100);

      return {
        value: answer,
        title: `If ${formatNumber(value)} is ${formatNumber(
          known
        )}%, then ${formatNumber(target)}% is`,
        formula: `Whole = ${formatNumber(value)} ÷ ${formatNumber(
          known
        )}% × 100 = ${formatNumber(wholeAmount)} → ${formatNumber(
          target
        )}% = ${formatNumber(answer)}`,
      };
    }

    const b = cleanNumber(base);
    const p = cleanNumber(changePercentage);

    if (b === null || p === null) return null;

    const difference = (b * p) / 100;
    const answer =
      changeType === "increase" ? b + difference : b - difference;

    return {
      value: answer,
      title:
        changeType === "increase"
          ? `${formatNumber(p)}% increase on ${formatNumber(b)}`
          : `${formatNumber(p)}% decrease on ${formatNumber(b)}`,
      formula:
        changeType === "increase"
          ? `${formatNumber(b)} + ${formatNumber(
              difference
            )} = ${formatNumber(answer)}`
          : `${formatNumber(b)} - ${formatNumber(
              difference
            )} = ${formatNumber(answer)}`,
      difference,
    };
  }, [
    mode,
    percentage,
    number,
    part,
    whole,
    knownValue,
    knownPercentage,
    targetPercentage,
    base,
    changePercentage,
    changeType,
  ]);

  const reset = () => {
    setPercentage("");
    setNumber("");
    setPart("");
    setWhole("");
    setKnownValue("");
    setKnownPercentage("");
    setTargetPercentage("");
    setBase("");
    setChangePercentage("");
    setChangeType("increase");
  };

  const copyResult = async () => {
    if (!result) return;

    const text = `${result.title} = ${formatNumber(result.value)}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Result copied.");
    } catch {
      alert("Unable to copy the result.");
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e9e7ef",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 8px 35px rgba(20, 10, 40, 0.05)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 14px",
    border: "1px solid #ddd9e7",
    borderRadius: 12,
    outline: "none",
    background: "#ffffff",
    color: "#18151f",
    fontSize: 15,
    boxSizing: "border-box",
  };

  const tabStyle = (
    active: boolean
  ): React.CSSProperties => ({
    flex: 1,
    minWidth: 130,
    border: active
      ? `2px solid ${pink}`
      : "1px solid #e4e1e9",
    background: active ? "#fff0f7" : "#ffffff",
    color: active ? pink : "#575260",
    borderRadius: 12,
    padding: "12px 10px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  });

  return (
    <div className="page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f7f6fa;
        }

        button,
        input {
          font-family: inherit;
        }

        input::placeholder {
          color: #b8b3bf;
          font-weight: 500;
        }

        input:focus {
          border-color: ${pink} !important;
          box-shadow: 0 0 0 3px rgba(236,72,153,.10);
        }

        button {
          transition: .15s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }

        .container {
          width: min(900px, calc(100% - 24px));
          margin: auto;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .result {
          margin-top: 16px;
          padding: 18px;
          border-radius: 16px;
          text-align: center;
          background: linear-gradient(135deg, #fff0f7, #f1edff);
          border: 1px solid #f1ddea;
        }

        .resultValue {
          color: ${pink};
          font-size: 30px;
          font-weight: 950;
          margin-top: 4px;
        }

        .small {
          font-size: 12px;
          line-height: 1.7;
          color: #696572;
        }

        .sectionTitle {
          font-size: 17px;
          font-weight: 900;
          margin: 0;
        }

        .featureGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .feature {
          border: 1px solid #ece9f0;
          border-radius: 14px;
          padding: 13px;
          background: #fcfbfd;
        }

        .feature b {
          display: block;
          font-size: 12px;
          color: #26212d;
          margin-bottom: 4px;
        }

        .feature span {
          font-size: 11px;
          color: #77717d;
          line-height: 1.5;
        }

        @media (max-width: 620px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .featureGrid {
            grid-template-columns: 1fr;
          }

          .container {
            width: min(100% - 18px, 900px);
          }

          .card {
            padding: 16px !important;
            border-radius: 17px !important;
          }

          h1 {
            font-size: 24px !important;
          }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(255,255,255,.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e9e7ef",
        }}
      >
        <div
          className="container"
          style={{
            minHeight: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#18151f",
              fontWeight: 950,
              fontSize: 21,
              letterSpacing: -0.8,
            }}
          >
            NEX<span style={{ color: pink }}>ORA</span>
          </a>

          <a
            href="/"
            style={{
              color: pink,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            ← All Tools
          </a>
        </div>
      </header>

      <main className="container" style={{ padding: "22px 0 50px" }}>
        {/* MAIN TOOL */}
        <section className="card" style={cardStyle}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 10px",
              borderRadius: 999,
              background: "#fff0f7",
              color: pink,
              border: "1px solid #f5d7e7",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.2,
            }}
          >
            FREE • INSTANT • EASY TO USE
          </div>

          <h1
            style={{
              margin: "10px 0 6px",
              fontSize: 27,
              lineHeight: 1.15,
              letterSpacing: -0.9,
              fontWeight: 950,
            }}
          >
            Percentage Calculator
          </h1>

          <p
            style={{
              margin: 0,
              color: "#716c78",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Calculate percentages, find the percentage of an amount,
            reverse percentages, and calculate increases or decreases.
          </p>

          <div className="tabs" style={{ marginTop: 18 }}>
            <button
              onClick={() => setMode("of")}
              style={tabStyle(mode === "of")}
            >
              % of Amount
            </button>

            <button
              onClick={() => setMode("what")}
              style={tabStyle(mode === "what")}
            >
              What %?
            </button>

            <button
              onClick={() => setMode("reverse")}
              style={tabStyle(mode === "reverse")}
            >
              Reverse %
            </button>

            <button
              onClick={() => setMode("change")}
              style={tabStyle(mode === "change")}
            >
              Increase / Decrease
            </button>
          </div>

          {/* % OF AMOUNT */}
          {mode === "of" && (
            <div style={{ marginTop: 18 }}>
              <div className="grid">
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Percentage
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={percentage}
                    onChange={(e) =>
                      setPercentage(e.target.value)
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Amount
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={number}
                    onChange={(e) =>
                      setNumber(e.target.value)
                    }
                    placeholder="470"
                  />
                </div>
              </div>

              {result && (
                <div className="result">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#4f4956",
                    }}
                  >
                    {result.title}
                  </div>

                  <div className="resultValue">
                    {formatNumber(result.value)}
                  </div>

                  <div className="small">
                    {result.formula}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WHAT % */}
          {mode === "what" && (
            <div style={{ marginTop: 18 }}>
              <div className="grid">
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Part / Value
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={part}
                    onChange={(e) =>
                      setPart(e.target.value)
                    }
                    placeholder="40"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Total / Whole
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={whole}
                    onChange={(e) =>
                      setWhole(e.target.value)
                    }
                    placeholder="200"
                  />
                </div>
              </div>

              {result && (
                <div className="result">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#4f4956",
                    }}
                  >
                    {result.title}
                  </div>

                  <div className="resultValue">
                    {formatNumber(result.value)}%
                  </div>

                  <div className="small">
                    {result.formula}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REVERSE % */}
          {mode === "reverse" && (
            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  padding: "11px 13px",
                  background: "#faf8ff",
                  border: "1px solid #ece6ff",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#5f5968",
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                Example: If <b>40 is 10%</b>, what is <b>90%</b>?
              </div>

              <div className="grid">
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Known Value
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={knownValue}
                    onChange={(e) =>
                      setKnownValue(e.target.value)
                    }
                    placeholder="40"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    This Value Is %
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={knownPercentage}
                    onChange={(e) =>
                      setKnownPercentage(e.target.value)
                    }
                    placeholder="10"
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  Find %
                </label>

                <input
                  style={inputStyle}
                  type="number"
                  inputMode="decimal"
                  value={targetPercentage}
                  onChange={(e) =>
                    setTargetPercentage(e.target.value)
                  }
                  placeholder="90"
                />
              </div>

              {result && (
                <div className="result">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#4f4956",
                    }}
                  >
                    {result.title}
                  </div>

                  <div className="resultValue">
                    {formatNumber(result.value)}
                  </div>

                  <div className="small">
                    {result.formula}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INCREASE / DECREASE */}
          {mode === "change" && (
            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <button
                  onClick={() => setChangeType("increase")}
                  style={{
                    ...tabStyle(changeType === "increase"),
                    minWidth: 0,
                  }}
                >
                  Increase
                </button>

                <button
                  onClick={() => setChangeType("decrease")}
                  style={{
                    ...tabStyle(changeType === "decrease"),
                    minWidth: 0,
                  }}
                >
                  Decrease
                </button>
              </div>

              <div className="grid">
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Original Amount
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={base}
                    onChange={(e) =>
                      setBase(e.target.value)
                    }
                    placeholder="150"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Percentage
                  </label>

                  <input
                    style={inputStyle}
                    type="number"
                    inputMode="decimal"
                    value={changePercentage}
                    onChange={(e) =>
                      setChangePercentage(e.target.value)
                    }
                    placeholder="20"
                  />
                </div>
              </div>

              {result && (
                <div className="result">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#4f4956",
                    }}
                  >
                    {result.title}
                  </div>

                  <div className="resultValue">
                    {formatNumber(result.value)}
                  </div>

                  <div className="small">
                    {result.formula}
                    {"difference" in result &&
                      ` • Difference: ${formatNumber(
                        result.difference
                      )}`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
            }}
          >
            <button
              onClick={copyResult}
              disabled={!result}
              style={{
                flex: 1,
                border: "none",
                background: result ? pink : "#ddd9df",
                color: "#fff",
                borderRadius: 12,
                height: 44,
                fontWeight: 900,
                cursor: result ? "pointer" : "not-allowed",
              }}
            >
              Copy Result
            </button>

            <button
              onClick={reset}
              style={{
                flex: 1,
                border: "1px solid #e2dfe6",
                background: "#fff",
                color: "#514b58",
                borderRadius: 12,
                height: 44,
                fontWeight: 850,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {/* QUICK EXAMPLES */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">Quick Examples</h2>

          <div className="featureGrid">
            <div className="feature">
              <b>10% of 470</b>
              <span>470 × 10 ÷ 100 = 47</span>
            </div>

            <div className="feature">
              <b>40 is what % of 200?</b>
              <span>40 ÷ 200 × 100 = 20%</span>
            </div>

            <div className="feature">
              <b>40 is 10%. What is 90%?</b>
              <span>40 ÷ 10 × 90 = 360</span>
            </div>

            <div className="feature">
              <b>20% increase on 150</b>
              <span>150 + 30 = 180</span>
            </div>
          </div>
        </section>

        {/* ABOUT TOOL */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">
            What Is a Percentage Calculator?
          </h2>

          <p className="small" style={{ marginTop: 9 }}>
            A percentage calculator helps you quickly calculate a
            percentage of an amount, find what percentage one number
            is of another, solve reverse percentage problems, and
            calculate percentage increases or decreases.
          </p>

          <h3
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: purple,
              margin: "18px 0 6px",
            }}
          >
            How to Use It
          </h3>

          <ol
            className="small"
            style={{
              paddingLeft: 20,
              margin: 0,
            }}
          >
            <li>Choose the calculation you need.</li>
            <li>Enter the numbers.</li>
            <li>Get the result instantly.</li>
            <li>Copy or reset the result when needed.</li>
          </ol>

          <h3
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: purple,
              margin: "18px 0 6px",
            }}
          >
            Common Uses
          </h3>

          <p className="small" style={{ margin: 0 }}>
            Use it for marks, discounts, shopping, price changes,
            salary changes, business calculations, finance,
            schoolwork, and everyday percentage problems.
          </p>
        </section>

        {/* FEATURES */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">Built for a Better Experience</h2>

          <div className="featureGrid">
            <div className="feature">
              <b>Fast Calculation</b>
              <span>
                Results update immediately while you type.
              </span>
            </div>

            <div className="feature">
              <b>Simple Interface</b>
              <span>
                Clear inputs and easy-to-understand calculations.
              </span>
            </div>

            <div className="feature">
              <b>Mobile Friendly</b>
              <span>
                Designed for phones, tablets and desktop screens.
              </span>
            </div>

            <div className="feature">
              <b>No Registration</b>
              <span>
                Start calculating without creating an account.
              </span>
            </div>

            <div className="feature">
              <b>Copy Result</b>
              <span>
                Copy the calculated result with one tap.
              </span>
            </div>

            <div className="feature">
              <b>Useful Error Handling</b>
              <span>
                Invalid or incomplete values are handled clearly.
              </span>
            </div>
          </div>
        </section>

        {/* FORMULAS */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">Percentage Formulas</h2>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                padding: 12,
                background: "#faf9fc",
                borderRadius: 11,
                fontSize: 12,
                color: "#504a57",
              }}
            >
              <b>X% of Y</b>
              <br />
              Y × X ÷ 100
            </div>

            <div
              style={{
                padding: 12,
                background: "#faf9fc",
                borderRadius: 11,
                fontSize: 12,
                color: "#504a57",
              }}
            >
              <b>What percentage is X of Y?</b>
              <br />
              X ÷ Y × 100
            </div>

            <div
              style={{
                padding: 12,
                background: "#faf9fc",
                borderRadius: 11,
                fontSize: 12,
                color: "#504a57",
              }}
            >
              <b>Reverse percentage</b>
              <br />
              Known Value ÷ Known % × Target %
            </div>

            <div
              style={{
                padding: 12,
                background: "#faf9fc",
                borderRadius: 11,
                fontSize: 12,
                color: "#504a57",
              }}
            >
              <b>Percentage change</b>
              <br />
              Original × Percentage ÷ 100
            </div>
          </div>
        </section>

        {/* QUALITY / TRUST */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">
            Tool Quality & Privacy
          </h2>

          <ul
            className="small"
            style={{
              paddingLeft: 20,
              marginBottom: 0,
            }}
          >
            <li>Clear purpose and simple workflow.</li>
            <li>Accurate mathematical formulas.</li>
            <li>No unnecessary registration.</li>
            <li>No unnecessary popups.</li>
            <li>Responsive mobile-friendly design.</li>
            <li>Readable results and formulas.</li>
            <li>Useful reset and copy actions.</li>
            <li>No fake ratings, reviews or user statistics.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">
            Frequently Asked Questions
          </h2>

          <div style={{ marginTop: 14 }}>
            <details style={{ marginBottom: 10 }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 850,
                  fontSize: 13,
                }}
              >
                How do I calculate 10% of 470?
              </summary>

              <p className="small">
                Enter 10 as the percentage and 470 as the amount.
                The result is 47.
              </p>
            </details>

            <details style={{ marginBottom: 10 }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 850,
                  fontSize: 13,
                }}
              >
                What is the easiest way to find a percentage?
              </summary>

              <p className="small">
                Use the % of Amount mode. Enter the percentage and
                the amount to get the result instantly.
              </p>
            </details>

            <details style={{ marginBottom: 10 }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 850,
                  fontSize: 13,
                }}
              >
                If 40 is 10%, what is 90%?
              </summary>

              <p className="small">
                The answer is 360. The calculator first finds the
                full amount and then calculates 90% of it.
              </p>
            </details>

            <details style={{ marginBottom: 10 }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 850,
                  fontSize: 13,
                }}
              >
                Can I calculate discounts?
              </summary>

              <p className="small">
                Yes. Select Increase / Decrease, choose Decrease,
                and enter the original amount and discount percentage.
              </p>
            </details>

            <details>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 850,
                  fontSize: 13,
                }}
              >
                Does it work on mobile?
              </summary>

              <p className="small">
                Yes. The calculator is designed for phones, tablets
                and desktop browsers.
              </p>
            </details>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <section
          className="card"
          style={{ ...cardStyle, marginTop: 16 }}
        >
          <h2 className="sectionTitle">Related Tools</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
            }}
          >
            <a
              href="/discount-calculator"
              style={{
                textDecoration: "none",
                color: pink,
                background: "#fff0f7",
                border: "1px solid #f5d7e7",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              Discount Calculator
            </a>

            <a
              href="/loan-emi-calculator"
              style={{
                textDecoration: "none",
                color: purple,
                background: "#f4f1ff",
                border: "1px solid #e5defe",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              Loan EMI Calculator
            </a>

            <a
              href="/age-calculator"
              style={{
                textDecoration: "none",
                color: "#44404a",
                background: "#f7f6f8",
                border: "1px solid #e5e2e8",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              Age Calculator
            </a>

            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "#44404a",
                background: "#f7f6f8",
                border: "1px solid #e5e2e8",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              All Tools
            </a>
          </div>
        </section>

        {/* LAST UPDATED */}
        <div
          style={{
            textAlign: "center",
            fontSize: 10.5,
            color: "#96919b",
            marginTop: 18,
          }}
        >
          Percentage Calculator • Free to use • No registration required
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid #e9e7ef",
          background: "#ffffff",
          padding: "28px 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 950,
                fontSize: 16,
                color: "#18151f",
              }}
            >
              NEX<span style={{ color: pink }}>ORA</span>
            </div>

            <div
              style={{
                color: "#85808a",
                fontSize: 11,
                marginTop: 5,
              }}
            >
              Free, fast and simple online tools.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              fontSize: 11,
              fontWeight: 750,
            }}
          >
            <a href="/about" style={{ color: "#6e6873" }}>
              About
            </a>

            <a href="/contact" style={{ color: "#6e6873" }}>
              Contact
            </a>

            <a href="/privacy" style={{ color: "#6e6873" }}>
              Privacy
            </a>

            <a href="/terms" style={{ color: "#6e6873" }}>
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
