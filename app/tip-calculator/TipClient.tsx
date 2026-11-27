"use client";

import { useMemo, useState } from "react";

const CURRENCIES = ["$", "€", "£", "₹"];

const TIP_PRESETS = [
  { value: 10, label: "10%" },
  { value: 15, label: "15%" },
  { value: 18, label: "18%" },
  { value: 20, label: "20%" },
  { value: 25, label: "25%" },
];

export default function TipClient() {
  const [bill, setBill] = useState(100);
  const [paid, setPaid] = useState(125);
  const [currency, setCurrency] = useState("$");
  const [people, setPeople] = useState(2);
  const [tipPercent, setTipPercent] = useState(20);
  const [mode, setMode] = useState<"paid" | "percent">("paid");

  const calculations = useMemo(() => {
    const safeBill = Math.max(0, bill);
    const safePaid = Math.max(0, paid);

    let tipAmount = 0;

    if (mode === "paid") {
      tipAmount = Math.max(0, safePaid - safeBill);
    } else {
      tipAmount = (safeBill * tipPercent) / 100;
    }

    const total = safeBill + tipAmount;
    const actualTipPercent =
      safeBill > 0 ? (tipAmount / safeBill) * 100 : 0;

    const change = Math.max(0, safePaid - total);
    const short = Math.max(0, total - safePaid);

    const perPersonTotal = people > 0 ? total / people : total;
    const perPersonTip = people > 0 ? tipAmount / people : tipAmount;

    return {
      safeBill,
      safePaid,
      tipAmount,
      total,
      actualTipPercent,
      change,
      short,
      perPersonTotal,
      perPersonTip,
    };
  }, [bill, paid, people, tipPercent, mode]);

  const money = (value: number) =>
    `${currency}${value.toFixed(2)}`;

  const updateBill = (value: number) => {
    const nextBill = Math.max(0, value);
    setBill(nextBill);

    if (mode === "paid") {
      setPaid(nextBill + (nextBill * tipPercent) / 100);
    }
  };

  const updateTip = (value: number) => {
    setTipPercent(value);

    if (mode === "percent") {
      setPaid(bill + (bill * value) / 100);
    }
  };

  const usePresetBill = (value: number) => {
    setBill(value);
    setPaid(value + (value * tipPercent) / 100);
  };

  return (
    <main className="tip-page">
      <div className="tip-shell">

        {/* HEADER */}
        <header className="tip-header">
          <div className="brand-pill">
            <span>✦</span>
            Smart Tip Calculator
          </div>

          <h1>
            Calculate Your <span>Tip</span>
          </h1>

          <p>
            Enter the bill and payment amount to instantly find the tip,
            total, and amount to split.
          </p>
        </header>

        {/* MAIN GRID */}
        <section className="main-grid">

          {/* LEFT */}
          <div className="card calculator-card">

            {/* CURRENCY */}
            <div className="section-top">
              <div>
                <span className="eyebrow">BILL DETAILS</span>
                <h2>How much was the bill?</h2>
              </div>

              <div className="currency-group">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    className={currency === c ? "currency active" : "currency"}
                    onClick={() => setCurrency(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* BILL */}
            <div className="money-input-wrap">
              <span>{currency}</span>

              <input
                type="number"
                min="0"
                value={bill}
                onChange={(e) => updateBill(Number(e.target.value))}
                aria-label="Bill amount"
              />
            </div>

            {/* QUICK BILL */}
            <div className="quick-row">
              {[25, 50, 100, 150, 200].map((value) => (
                <button
                  key={value}
                  onClick={() => usePresetBill(value)}
                  className="quick-btn"
                >
                  {currency}{value}
                </button>
              ))}
            </div>

            {/* MODE */}
            <div className="mode-switch">
              <button
                className={mode === "paid" ? "selected" : ""}
                onClick={() => setMode("paid")}
              >
                Customer paid
              </button>

              <button
                className={mode === "percent" ? "selected" : ""}
                onClick={() => {
                  setMode("percent");
                  setPaid(bill + (bill * tipPercent) / 100);
                }}
              >
                Choose tip %
              </button>
            </div>

            {/* PAID */}
            {mode === "paid" ? (
              <div className="input-section">
                <label>
                  Customer paid
                  <small>Enter the amount received</small>
                </label>

                <div className="secondary-input">
                  <span>{currency}</span>

                  <input
                    type="number"
                    min="0"
                    value={paid}
                    onChange={(e) => setPaid(Number(e.target.value))}
                  />
                </div>

                <div className="helper">
                  Tip is automatically calculated from the difference.
                </div>
              </div>
            ) : (
              <div className="input-section">
                <label>
                  Tip percentage
                  <small>Choose a percentage</small>
                </label>

                <div className="tip-presets">
                  {TIP_PRESETS.map((tip) => (
                    <button
                      key={tip.value}
                      onClick={() => updateTip(tip.value)}
                      className={
                        tipPercent === tip.value ? "tip active" : "tip"
                      }
                    >
                      {tip.label}
                    </button>
                  ))}
                </div>

                <div className="range-wrap">
                  <div className="range-value">
                    <span>Custom tip</span>
                    <strong>{tipPercent}%</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={tipPercent}
                    onChange={(e) => updateTip(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* PEOPLE */}
            <div className="people-section">
              <div>
                <span className="eyebrow">SPLIT THE BILL</span>
                <h3>How many people?</h3>
              </div>

              <div className="people-control">
                <button
                  onClick={() => setPeople(Math.max(1, people - 1))}
                >
                  −
                </button>

                <strong>{people}</strong>

                <button
                  onClick={() => setPeople(people + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card result-card">

            <div className="result-head">
              <div>
                <span className="eyebrow">YOUR RESULT</span>
                <h2>Tip summary</h2>
              </div>

              <div className="status">
                <span></span>
                Calculated
              </div>
            </div>

            {/* TIP HERO */}
            <div className="tip-hero">
              <span>Tip amount</span>

              <strong>
                {money(calculations.tipAmount)}
              </strong>

              <div>
                {calculations.actualTipPercent.toFixed(1)}% of the bill
              </div>
            </div>

            {/* ROWS */}
            <div className="result-list">

              <div className="result-row">
                <span>Bill amount</span>
                <strong>{money(calculations.safeBill)}</strong>
              </div>

              <div className="result-row">
                <span>Tip</span>
                <strong className="green">
                  {money(calculations.tipAmount)}
                </strong>
              </div>

              <div className="result-row total-row">
                <span>Total</span>
                <strong>{money(calculations.total)}</strong>
              </div>

              {calculations.change > 0 && (
                <div className="result-row change-row">
                  <span>Change</span>
                  <strong>{money(calculations.change)}</strong>
                </div>
              )}

              {calculations.short > 0 && (
                <div className="result-row warning-row">
                  <span>Amount still needed</span>
                  <strong>{money(calculations.short)}</strong>
                </div>
              )}
            </div>

            {/* PER PERSON */}
            <div className="split-box">
              <div>
                <span>Per person</span>
                <small>
                  {people} {people === 1 ? "person" : "people"}
                </small>
              </div>

              <strong>
                {money(calculations.perPersonTotal)}
              </strong>
            </div>

            <div className="small-note">
              Includes {money(calculations.perPersonTip)} tip per person.
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="info-card">
          <div className="info-icon">✓</div>

          <div>
            <h3>How does this tip calculator work?</h3>

            <p>
              Enter your bill amount and the amount the customer paid.
              The calculator automatically finds the tip, calculates the
              effective tip percentage, shows the final total, and works
              out the amount per person.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span>Free to use</span>
          <span>•</span>
          <span>No sign-up</span>
          <span>•</span>
          <span>Instant calculation</span>
        </footer>
      </div>

      <style jsx>{`
        .tip-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(72, 94, 170, 0.08), transparent 34%),
            #f5f7fb;
          color: #182033;
          padding: 28px 18px 42px;
          font-family:
            Inter,
            ui-sans-serif,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .tip-shell {
          width: 100%;
          max-width: 1040px;
          margin: 0 auto;
        }

        .tip-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 24px;
        }

        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 12px;
          border: 1px solid #e2e6ef;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          color: #667085;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .brand-pill span {
          color: #635bff;
          font-size: 13px;
        }

        .tip-header h1 {
          margin: 13px 0 7px;
          font-size: clamp(30px, 5vw, 46px);
          line-height: 1;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .tip-header h1 span {
          color: #635bff;
        }

        .tip-header p {
          margin: 0 auto;
          color: #7a8498;
          font-size: 13px;
          line-height: 1.6;
          max-width: 560px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 16px;
        }

        .card {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e5e8ef;
          border-radius: 22px;
          box-shadow: 0 12px 40px rgba(30, 40, 70, 0.055);
        }

        .calculator-card {
          padding: 22px;
        }

        .result-card {
          padding: 22px;
          background:
            linear-gradient(145deg, #ffffff 0%, #fbfaff 60%, #f5f3ff 100%);
        }

        .section-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .eyebrow {
          display: block;
          color: #8a93a5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        h2 {
          margin: 4px 0 0;
          font-size: 18px;
          letter-spacing: -0.02em;
          font-weight: 850;
        }

        .currency-group {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #f1f3f7;
          border-radius: 11px;
        }

        .currency {
          width: 30px;
          height: 30px;
          border: 0;
          background: transparent;
          border-radius: 8px;
          color: #788195;
          font-weight: 800;
          cursor: pointer;
        }

        .currency.active {
          background: white;
          color: #635bff;
          box-shadow: 0 2px 8px rgba(20, 30, 60, 0.08);
        }

        .money-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 5px 15px;
          background: #f7f8fb;
          border: 1px solid #e6e9f0;
          border-radius: 14px;
        }

        .money-input-wrap span {
          color: #8a93a5;
          font-size: 20px;
          font-weight: 800;
        }

        .money-input-wrap input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #171d2b;
          font-size: 28px;
          font-weight: 900;
          padding: 9px 0;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        .quick-row {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .quick-btn {
          flex: 1;
          border: 1px solid #e5e8ef;
          background: white;
          color: #687286;
          border-radius: 9px;
          padding: 7px 4px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .quick-btn:hover {
          border-color: #c9c5ff;
          color: #635bff;
        }

        .mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          padding: 4px;
          margin-top: 18px;
          background: #f0f2f6;
          border-radius: 11px;
        }

        .mode-switch button {
          border: 0;
          background: transparent;
          color: #7b8497;
          padding: 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .mode-switch button.selected {
          background: white;
          color: #282e3d;
          box-shadow: 0 2px 7px rgba(30, 40, 70, 0.07);
        }

        .input-section {
          margin-top: 16px;
        }

        .input-section label {
          display: flex;
          flex-direction: column;
          gap: 3px;
          color: #394154;
          font-size: 12px;
          font-weight: 850;
        }

        .input-section label small {
          color: #929aaa;
          font-size: 10px;
          font-weight: 500;
        }

        .secondary-input {
          display: flex;
          align-items: center;
          margin-top: 8px;
          padding: 10px 13px;
          border: 1px solid #e5e8ef;
          border-radius: 12px;
          background: #fafbfc;
        }

        .secondary-input span {
          color: #8b94a7;
          font-weight: 800;
          margin-right: 6px;
        }

        .secondary-input input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 19px;
          color: #1d2432;
          font-weight: 850;
        }

        .helper {
          margin-top: 6px;
          color: #929aaa;
          font-size: 9px;
        }

        .tip-presets {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          margin-top: 9px;
        }

        .tip {
          padding: 9px 3px;
          border: 1px solid #e4e7ee;
          border-radius: 9px;
          background: white;
          color: #626c7f;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .tip.active {
          border-color: #635bff;
          background: #635bff;
          color: white;
          box-shadow: 0 5px 14px rgba(99, 91, 255, 0.2);
        }

        .range-wrap {
          margin-top: 12px;
        }

        .range-value {
          display: flex;
          justify-content: space-between;
          color: #929aaa;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .range-value strong {
          color: #635bff;
        }

        .range-wrap input {
          width: 100%;
          accent-color: #635bff;
        }

        .people-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 19px;
          padding-top: 17px;
          border-top: 1px solid #edf0f4;
        }

        .people-section h3 {
          margin: 4px 0 0;
          font-size: 13px;
          font-weight: 850;
        }

        .people-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .people-control button {
          width: 31px;
          height: 31px;
          border: 1px solid #e2e6ed;
          background: white;
          border-radius: 9px;
          font-size: 18px;
          color: #505a6d;
          cursor: pointer;
        }

        .people-control strong {
          min-width: 25px;
          text-align: center;
          font-size: 15px;
        }

        .result-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #718092;
          font-size: 9px;
          font-weight: 800;
        }

        .status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #35c98b;
          box-shadow: 0 0 0 4px rgba(53, 201, 139, 0.1);
        }

        .tip-hero {
          margin-top: 16px;
          padding: 18px;
          border-radius: 17px;
          background:
            linear-gradient(135deg, #625cff, #827cff);
          color: white;
          box-shadow: 0 12px 30px rgba(99, 91, 255, 0.18);
        }

        .tip-hero span {
          display: block;
          opacity: 0.78;
          font-size: 10px;
          font-weight: 800;
        }

        .tip-hero strong {
          display: block;
          margin-top: 2px;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .tip-hero div {
          margin-top: 6px;
          font-size: 10px;
          opacity: 0.85;
        }

        .result-list {
          margin-top: 14px;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #edf0f4;
          font-size: 11px;
        }

        .result-row span {
          color: #7d8799;
        }

        .result-row strong {
          color: #252c3b;
          font-size: 12px;
        }

        .result-row .green {
          color: #159a68;
        }

        .total-row {
          padding-top: 13px;
        }

        .total-row span {
          color: #343b4a;
          font-weight: 850;
        }

        .total-row strong {
          font-size: 18px;
        }

        .change-row strong {
          color: #159a68;
        }

        .warning-row strong {
          color: #d97706;
        }

        .split-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          padding: 13px 14px;
          border: 1px solid #e5e2ff;
          background: #f7f6ff;
          border-radius: 13px;
        }

        .split-box span {
          display: block;
          color: #626b7d;
          font-size: 10px;
          font-weight: 800;
        }

        .split-box small {
          display: block;
          color: #959dad;
          font-size: 9px;
          margin-top: 2px;
        }

        .split-box strong {
          color: #635bff;
          font-size: 21px;
        }

        .small-note {
          text-align: center;
          color: #929aaa;
          font-size: 9px;
          margin-top: 7px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 16px;
          padding: 16px;
          background: white;
          border: 1px solid #e5e8ef;
          border-radius: 16px;
        }

        .info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #eeedff;
          color: #635bff;
          font-weight: 900;
          font-size: 12px;
        }

        .info-card h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 900;
        }

        .info-card p {
          margin: 5px 0 0;
          color: #7d8799;
          font-size: 10px;
          line-height: 1.65;
        }

        footer {
          display: flex;
          justify-content: center;
          gap: 8px;
          color: #a0a7b5;
          font-size: 9px;
          margin-top: 18px;
        }

        @media (max-width: 760px) {
          .tip-page {
            padding: 18px 12px 30px;
          }

          .tip-header {
            margin-bottom: 17px;
          }

          .tip-header h1 {
            font-size: 31px;
          }

          .tip-header p {
            font-size: 11px;
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .calculator-card,
          .result-card {
            padding: 16px;
            border-radius: 18px;
          }

          .section-top {
            align-items: center;
          }

          .quick-row {
            gap: 4px;
          }

          .quick-btn {
            font-size: 9px;
          }

          .tip-presets {
            gap: 5px;
          }

          .tip {
            font-size: 10px;
          }

          .tip-hero {
            padding: 16px;
          }

          .tip-hero strong {
            font-size: 31px;
          }
        }

        @media (max-width: 400px) {
          .currency-group {
            transform: scale(0.9);
            transform-origin: right center;
          }

          .section-top h2 {
            font-size: 16px;
          }

          .quick-btn {
            padding: 6px 2px;
          }
        }
      `}</style>
    </main>
  );
}
