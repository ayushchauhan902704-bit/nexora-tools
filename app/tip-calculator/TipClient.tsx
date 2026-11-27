"use client";

import { useMemo, useState } from "react";

const CURRENCIES = ["$", "€", "£", "₹"];

const TIP_PRESETS = [10, 15, 18, 20, 25];

export default function TipClient() {
  const [bill, setBill] = useState("");
  const [paid, setPaid] = useState("");
  const [currency, setCurrency] = useState("$");
  const [people, setPeople] = useState(1);
  const [tipPercent, setTipPercent] = useState(20);

  const billNum = Number(bill) || 0;
  const paidNum = Number(paid) || 0;

  const calculations = useMemo(() => {
    const tip = Math.max(0, paidNum - billNum);
    const tipRate = billNum > 0 ? (tip / billNum) * 100 : 0;
    const total = billNum + tip;
    const change = Math.max(0, paidNum - total);

    return {
      tip,
      tipRate,
      total,
      change,
      perPerson: people > 0 ? total / people : 0,
      tipPerPerson: people > 0 ? tip / people : 0,
    };
  }, [billNum, paidNum, people]);

  const money = (value: number) =>
    `${currency}${value.toFixed(2)}`;

  const handleBill = (value: string) => {
    setBill(value.replace(/^0+(?=\d)/, ""));
  };

  const handlePaid = (value: string) => {
    setPaid(value.replace(/^0+(?=\d)/, ""));
  };

  const setPresetTip = (percent: number) => {
    setTipPercent(percent);

    if (billNum > 0) {
      const calculatedPaid =
        billNum + (billNum * percent) / 100;

      setPaid(calculatedPaid.toFixed(2));
    }
  };

  return (
    <main className="tip-page">
      <div className="tip-container">

        {/* HEADER */}
        <header className="header">
          <div className="badge">
            <span>✦</span> Smart Tip Calculator
          </div>

          <h1>
            Tip <span>Calculator</span>
          </h1>

          <p>
            Enter the bill and payment to instantly calculate the tip.
          </p>
        </header>

        {/* MAIN */}
        <div className="main">

          {/* INPUT CARD */}
          <section className="card input-card">

            <div className="top-row">
              <div>
                <span className="label">BILL AMOUNT</span>
                <h2>How much was the bill?</h2>
              </div>

              <div className="currencies">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    className={currency === c ? "active" : ""}
                    onClick={() => setCurrency(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* BILL */}
            <div className="big-input">
              <span>{currency}</span>

              <input
                type="number"
                min="0"
                value={bill}
                placeholder="0"
                onChange={(e) => handleBill(e.target.value)}
              />
            </div>

            {/* PAID */}
            <div className="paid-row">
              <div className="field">
                <label>Customer paid</label>

                <div className="small-input">
                  <span>{currency}</span>

                  <input
                    type="number"
                    min="0"
                    value={paid}
                    placeholder="0"
                    onChange={(e) => handlePaid(e.target.value)}
                  />
                </div>
              </div>

              <div className="difference">
                <span>Tip</span>
                <strong>
                  {money(calculations.tip)}
                </strong>
              </div>
            </div>

            {/* TIP PRESETS */}
            <div className="tip-section">
              <div className="tip-title">
                <span>Quick tip</span>
                <b>{tipPercent}%</b>
              </div>

              <div className="tips">
                {TIP_PRESETS.map((value) => (
                  <button
                    key={value}
                    className={tipPercent === value ? "selected" : ""}
                    onClick={() => setPresetTip(value)}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            {/* PEOPLE */}
            <div className="people-row">
              <div>
                <span className="label">SPLIT BILL</span>
                <h3>People</h3>
              </div>

              <div className="counter">
                <button
                  onClick={() =>
                    setPeople(Math.max(1, people - 1))
                  }
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
          </section>

          {/* RESULT CARD */}
          <section className="card result-card">

            <div className="result-top">
              <div>
                <span className="label">RESULT</span>
                <h2>Your tip</h2>
              </div>

              <div className="live">
                <i></i> Live
              </div>
            </div>

            <div className="tip-result">
              <span>Tip amount</span>

              <strong>
                {money(calculations.tip)}
              </strong>

              <small>
                {calculations.tipRate.toFixed(1)}% of bill
              </small>
            </div>

            <div className="rows">

              <div>
                <span>Bill</span>
                <b>{money(billNum)}</b>
              </div>

              <div>
                <span>Tip</span>
                <b className="green">
                  {money(calculations.tip)}
                </b>
              </div>

              <div className="total">
                <span>Total</span>
                <b>{money(calculations.total)}</b>
              </div>

              {calculations.change > 0 && (
                <div>
                  <span>Change</span>
                  <b className="green">
                    {money(calculations.change)}
                  </b>
                </div>
              )}
            </div>

            <div className="per-person">
              <div>
                <span>Per person</span>
                <small>
                  {people} {people === 1 ? "person" : "people"}
                </small>
              </div>

              <strong>
                {money(calculations.perPerson)}
              </strong>
            </div>

            <div className="mini-note">
              Tip per person: {money(calculations.tipPerPerson)}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer>
          Free • No sign-up • Instant calculation
        </footer>
      </div>

      <style jsx>{`
        .tip-page {
          min-height: 100vh;
          background: #f4f6fa;
          color: #171b28;
          padding: 18px 12px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .tip-container {
          width: 100%;
          max-width: 900px;
          margin: auto;
        }

        /* HEADER */

        .header {
          text-align: center;
          margin-bottom: 14px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: 1px solid #e1e5ed;
          background: #fff;
          border-radius: 999px;
          color: #737d90;
          font-size: 9px;
          font-weight: 800;
        }

        .badge span {
          color: #665cf6;
        }

        .header h1 {
          margin: 8px 0 3px;
          font-size: 30px;
          line-height: 1;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .header h1 span {
          color: #665cf6;
        }

        .header p {
          margin: 0;
          color: #858e9f;
          font-size: 10px;
        }

        /* MAIN */

        .main {
          display: grid;
          grid-template-columns: 1fr 0.88fr;
          gap: 10px;
        }

        .card {
          border: 1px solid #e3e6ed;
          background: #fff;
          border-radius: 17px;
          box-shadow: 0 8px 28px rgba(30, 40, 70, 0.045);
        }

        .input-card,
        .result-card {
          padding: 15px;
        }

        /* TOP */

        .top-row,
        .result-top,
        .people-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .label {
          display: block;
          color: #9aa2b1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        h2 {
          margin: 3px 0 0;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        h3 {
          margin: 2px 0 0;
          font-size: 12px;
          font-weight: 850;
        }

        /* CURRENCY */

        .currencies {
          display: flex;
          gap: 2px;
          padding: 3px;
          background: #f0f2f6;
          border-radius: 9px;
        }

        .currencies button {
          width: 25px;
          height: 25px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #818a9b;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .currencies button.active {
          background: #fff;
          color: #665cf6;
          box-shadow: 0 2px 6px rgba(30, 40, 70, 0.08);
        }

        /* BIG INPUT */

        .big-input {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 3px 12px;
          border: 1px solid #e4e7ed;
          background: #f8f9fb;
          border-radius: 11px;
        }

        .big-input span {
          color: #929aaa;
          font-size: 18px;
          font-weight: 900;
        }

        .big-input input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 6px 0;
          color: #171c29;
          font-size: 24px;
          font-weight: 900;
        }

        input::placeholder {
          color: #b5bac4;
          opacity: 1;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* PAID */

        .paid-row {
          display: grid;
          grid-template-columns: 1fr 0.55fr;
          gap: 8px;
          margin-top: 9px;
        }

        .field label {
          display: block;
          margin-bottom: 4px;
          color: #697285;
          font-size: 9px;
          font-weight: 850;
        }

        .small-input {
          display: flex;
          align-items: center;
          padding: 7px 9px;
          border: 1px solid #e5e8ee;
          background: #fafbfc;
          border-radius: 9px;
        }

        .small-input span {
          color: #9aa2b0;
          font-size: 11px;
          font-weight: 800;
          margin-right: 4px;
        }

        .small-input input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 14px;
          font-weight: 850;
          color: #1c2230;
        }

        .difference {
          padding: 7px 10px;
          border-radius: 9px;
          background: #f0fdf7;
          border: 1px solid #d9f3e7;
        }

        .difference span {
          display: block;
          color: #7b9388;
          font-size: 8px;
          font-weight: 800;
        }

        .difference strong {
          display: block;
          margin-top: 2px;
          color: #159767;
          font-size: 15px;
        }

        /* TIPS */

        .tip-section {
          margin-top: 9px;
        }

        .tip-title {
          display: flex;
          justify-content: space-between;
          color: #7e8797;
          font-size: 9px;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .tip-title b {
          color: #665cf6;
        }

        .tips {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }

        .tips button {
          padding: 7px 2px;
          border: 1px solid #e4e7ed;
          background: #fff;
          color: #697286;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .tips button.selected {
          background: #665cf6;
          border-color: #665cf6;
          color: #fff;
          box-shadow: 0 4px 10px rgba(102, 92, 246, 0.18);
        }

        /* PEOPLE */

        .people-row {
          margin-top: 10px;
          padding-top: 9px;
          border-top: 1px solid #edf0f4;
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .counter button {
          width: 26px;
          height: 26px;
          border: 1px solid #e2e6ed;
          background: #fff;
          color: #4f5869;
          border-radius: 7px;
          font-size: 16px;
          cursor: pointer;
        }

        .counter strong {
          min-width: 16px;
          text-align: center;
          font-size: 12px;
        }

        /* RESULT */

        .live {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #879091;
          font-size: 8px;
          font-weight: 800;
        }

        .live i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2fc98a;
        }

        .tip-result {
          margin-top: 10px;
          padding: 14px;
          border-radius: 13px;
          background: linear-gradient(135deg, #6259f5, #827bf8);
          color: #fff;
        }

        .tip-result span {
          display: block;
          font-size: 8px;
          font-weight: 800;
          opacity: 0.78;
        }

        .tip-result strong {
          display: block;
          margin-top: 1px;
          font-size: 29px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .tip-result small {
          display: block;
          margin-top: 4px;
          font-size: 8px;
          opacity: 0.8;
        }

        .rows {
          margin-top: 8px;
        }

        .rows > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 0;
          border-bottom: 1px solid #edf0f3;
        }

        .rows span {
          color: #858e9e;
          font-size: 9px;
        }

        .rows b {
          color: #252b38;
          font-size: 10px;
        }

        .rows .green {
          color: #159767;
        }

        .rows .total span {
          color: #343b49;
          font-weight: 900;
        }

        .rows .total b {
          font-size: 15px;
          font-weight: 900;
        }

        /* PER PERSON */

        .per-person {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 9px;
          padding: 10px 11px;
          border: 1px solid #e5e2ff;
          background: #f7f6ff;
          border-radius: 10px;
        }

        .per-person span {
          display: block;
          color: #666f81;
          font-size: 9px;
          font-weight: 850;
        }

        .per-person small {
          display: block;
          color: #9ba2af;
          font-size: 8px;
          margin-top: 1px;
        }

        .per-person strong {
          color: #665cf6;
          font-size: 17px;
        }

        .mini-note {
          text-align: center;
          color: #9aa1ad;
          font-size: 8px;
          margin-top: 5px;
        }

        /* FOOTER */

        footer {
          text-align: center;
          color: #a1a8b4;
          font-size: 8px;
          margin-top: 10px;
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .tip-page {
            padding: 10px 9px 15px;
          }

          .header {
            margin-bottom: 8px;
          }

          .badge {
            padding: 4px 9px;
            font-size: 8px;
          }

          .header h1 {
            margin: 5px 0 2px;
            font-size: 25px;
          }

          .header p {
            font-size: 8px;
          }

          .main {
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .input-card,
          .result-card {
            padding: 11px;
            border-radius: 13px;
          }

          .label {
            font-size: 7px;
          }

          h2 {
            font-size: 13px;
          }

          .big-input {
            margin-top: 7px;
            padding: 2px 9px;
          }

          .big-input span {
            font-size: 15px;
          }

          .big-input input {
            font-size: 20px;
            padding: 5px 0;
          }

          .paid-row {
            margin-top: 6px;
          }

          .field label {
            font-size: 8px;
          }

          .small-input {
            padding: 6px 8px;
          }

          .small-input input {
            font-size: 12px;
          }

          .difference {
            padding: 6px 8px;
          }

          .difference strong {
            font-size: 13px;
          }

          .tip-section {
            margin-top: 6px;
          }

          .tips button {
            padding: 6px 2px;
            font-size: 8px;
          }

          .people-row {
            margin-top: 7px;
            padding-top: 7px;
          }

          .result-top {
            margin-bottom: 0;
          }

          .tip-result {
            margin-top: 7px;
            padding: 11px;
            border-radius: 11px;
          }

          .tip-result strong {
            font-size: 25px;
          }

          .rows {
            margin-top: 5px;
          }

          .rows > div {
            padding: 5px 0;
          }

          .per-person {
            margin-top: 6px;
            padding: 8px 9px;
          }

          .per-person strong {
            font-size: 15px;
          }

          footer {
            margin-top: 7px;
          }
        }

        /* VERY SMALL PHONES */

        @media (max-height: 700px) and (max-width: 700px) {
          .tip-page {
            padding-top: 7px;
          }

          .header h1 {
            font-size: 22px;
          }

          .header p {
            display: none;
          }

          .main {
            gap: 5px;
          }

          .input-card,
          .result-card {
            padding: 9px;
          }

          .tip-result {
            padding: 9px;
          }

          .tip-result strong {
            font-size: 22px;
          }

          .rows > div {
            padding: 4px 0;
          }

          .per-person {
            padding: 6px 8px;
          }

          footer {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
