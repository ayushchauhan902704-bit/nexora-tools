"use client";

import { useMemo, useState } from "react";

const CURRENCIES = ["$", "€", "£", "₹"];
const TIP_PRESETS = [10, 15, 18, 20, 25];

function cleanNumber(value: string) {
  return value.replace(/^0+(?=\d)/, "");
}

export default function TipClient() {
  const [bill, setBill] = useState("");
  const [paid, setPaid] = useState("");
  const [currency, setCurrency] = useState("$");
  const [people, setPeople] = useState(1);
  const [tipPercent, setTipPercent] = useState(20);
  const [copied, setCopied] = useState(false);

  const billNum = Number(bill) || 0;
  const paidNum = Number(paid) || 0;

  const calculations = useMemo(() => {
    /*
      NORMAL TIP:
      Example:
      Bill = 500
      Tip = 20%
      Suggested tip = 100
      Suggested total = 600
    */
    const suggestedTip =
      billNum > 0 ? (billNum * tipPercent) / 100 : 0;

    const suggestedTotal = billNum + suggestedTip;

    const hasPaidAmount = paid.trim() !== "";

    /*
      SMART PAYMENT LOGIC

      If customer has paid enough to cover the bill:
      actual tip = paid - bill

      Example:
      Bill = 500
      Paid = 1000
      Actual tip = 500
      Total = 1000
      Change = 0

      If customer has not paid enough:
      use selected percentage as the expected tip.
    */

    let actualTip = suggestedTip;
    let total = suggestedTotal;
    let change = 0;
    let amountDue = 0;
    let paymentTip = false;

    if (hasPaidAmount) {
      if (paidNum >= billNum && billNum > 0) {
        const extraPaid = paidNum - billNum;

        actualTip = extraPaid;
        total = paidNum;
        paymentTip = true;

        change = 0;
        amountDue = 0;
      } else if (paidNum < suggestedTotal) {
        actualTip = suggestedTip;
        total = suggestedTotal;

        amountDue = suggestedTotal - paidNum;
        change = 0;
      }
    }

    const billPerPerson =
      people > 0 ? billNum / people : 0;

    const tipPerPerson =
      people > 0 ? actualTip / people : 0;

    const totalPerPerson =
      people > 0 ? total / people : 0;

    return {
      suggestedTip,
      suggestedTotal,
      actualTip,
      total,
      change,
      amountDue,
      billPerPerson,
      tipPerPerson,
      perPerson: totalPerPerson,
      hasPaidAmount,
      paymentTip,
    };
  }, [billNum, paidNum, paid, people, tipPercent]);

  const money = (value: number) => {
    return `${currency}${value.toFixed(2)}`;
  };

  const handleBill = (value: string) => {
    const clean = cleanNumber(value);
    setBill(clean);

    /*
      Do not automatically overwrite customer payment.
      This prevents the user's manually entered payment
      from being destroyed when they edit the bill.
    */
  };

  const handlePaid = (value: string) => {
    const clean = cleanNumber(value);
    setPaid(clean);
  };

  const setPresetTip = (percent: number) => {
    setTipPercent(percent);
  };

  const resetCalculator = () => {
    setBill("");
    setPaid("");
    setCurrency("$");
    setPeople(1);
    setTipPercent(20);
    setCopied(false);
  };

  const copySummary = async () => {
    const lines = [
      "Tip Calculator Result",
      `Bill: ${money(billNum)}`,
      `Tip: ${money(calculations.actualTip)}`,
      `Tip percentage: ${
        billNum > 0
          ? ((calculations.actualTip / billNum) * 100).toFixed(1)
          : "0.0"
      }%`,
      `Total: ${money(calculations.total)}`,
    ];

    if (calculations.hasPaidAmount) {
      lines.push(`Paid: ${money(paidNum)}`);

      if (calculations.change > 0) {
        lines.push(`Change: ${money(calculations.change)}`);
      }

      if (calculations.amountDue > 0) {
        lines.push(`Amount Due: ${money(calculations.amountDue)}`);
      }
    }

    lines.push(
      `People: ${people}`,
      `Per person: ${money(calculations.perPerson)}`
    );

    const summary = lines.join("\n");

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  };

  const actualTipPercent =
    billNum > 0
      ? (calculations.actualTip / billNum) * 100
      : 0;

  const displayTipPercent =
    calculations.paymentTip
      ? actualTipPercent
      : tipPercent;

  return (
    <main className="tip-page">
      <div className="tip-container">

        {/* BRAND */}
        <div className="top-brand">
          <div className="brand">thenexoratools</div>

          <div className="badge">
            <span>✦</span>
            Smart Tip Calculator
          </div>
        </div>

        {/* HEADER */}
        <header className="header">
          <h1>
            Tip <span>Calculator</span>
          </h1>

          <p>
            Calculate tips, total bills, payment, change and split payments instantly.
          </p>
        </header>

        {/* MAIN CALCULATOR */}
        <div className="main">

          {/* INPUT CARD */}
          <section className="card input-card">

            <div className="top-row">
              <div>
                <span className="label">BILL AMOUNT</span>

                <h2>
                  How much was the bill?
                </h2>
              </div>

              <div className="currencies">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={currency === c ? "active" : ""}
                    onClick={() => setCurrency(c)}
                    aria-label={`Use ${c} currency`}
                    aria-pressed={currency === c}
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
                step="0.01"
                value={bill}
                placeholder="0"
                inputMode="decimal"
                aria-label="Bill amount"
                onChange={(e) => handleBill(e.target.value)}
              />
            </div>

            {/* CUSTOMER PAID */}
            <div className="paid-row">

              <div className="field">
                <label htmlFor="paid">
                  Customer paid
                </label>

                <div className="small-input">
                  <span>{currency}</span>

                  <input
                    id="paid"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paid}
                    placeholder="Optional"
                    inputMode="decimal"
                    aria-label="Customer paid amount"
                    onChange={(e) =>
                      handlePaid(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="difference">

                <span>
                  {calculations.paymentTip
                    ? "Actual tip"
                    : "Suggested tip"}
                </span>

                <strong>
                  {money(calculations.actualTip)}
                </strong>

              </div>
            </div>

            {/* TIP PERCENTAGE */}
            <div className="tip-section">

              <div className="tip-title">
                <span>
                  {calculations.paymentTip
                    ? "Actual tip"
                    : "Quick tip"}
                </span>

                <b>
                  {displayTipPercent.toFixed(1)}%
                </b>
              </div>

              <div className="tips">

                {TIP_PRESETS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      tipPercent === value
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setPresetTip(value)
                    }
                    aria-pressed={
                      tipPercent === value
                    }
                  >
                    {value}%
                  </button>
                ))}

              </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="payment-note">

              {calculations.paymentTip ? (
                <>
                  <span>Payment calculation</span>

                  <p>
                    {money(paidNum)} paid −{" "}
                    {money(billNum)} bill ={" "}
                    <strong>
                      {money(calculations.actualTip)}
                    </strong>{" "}
                    tip
                  </p>
                </>
              ) : (
                <>
                  <span>Tip calculation</span>

                  <p>
                    {money(billNum)} ×{" "}
                    {tipPercent}% ={" "}
                    <strong>
                      {money(calculations.suggestedTip)}
                    </strong>{" "}
                    tip
                  </p>
                </>
              )}

            </div>

            {/* SPLIT BILL */}
            <div className="people-row">

              <div>
                <span className="label">
                  SPLIT BILL
                </span>

                <h3>People</h3>
              </div>

              <div className="counter">

                <button
                  type="button"
                  aria-label="Decrease number of people"
                  disabled={people <= 1}
                  onClick={() =>
                    setPeople(
                      Math.max(1, people - 1)
                    )
                  }
                >
                  −
                </button>

                <strong>
                  {people}
                </strong>

                <button
                  type="button"
                  aria-label="Increase number of people"
                  disabled={people >= 100}
                  onClick={() =>
                    setPeople(
                      Math.min(100, people + 1)
                    )
                  }
                >
                  +
                </button>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={resetCalculator}
              >
                Reset
              </button>

              <button
                type="button"
                className="copy-btn"
                onClick={copySummary}
              >
                {copied
                  ? "Copied ✓"
                  : "Copy Result"}
              </button>

            </div>

          </section>

          {/* RESULT CARD */}
          <section className="card result-card">

            <div className="result-top">

              <div>
                <span className="label">
                  RESULT
                </span>

                <h2>
                  Your tip
                </h2>
              </div>

              <div className="live">
                <i></i>
                Live
              </div>

            </div>

            {/* BIG TIP */}
            <div className="tip-result">

              <span>
                {calculations.paymentTip
                  ? "Actual tip"
                  : "Tip amount"}
              </span>

              <strong>
                {money(calculations.actualTip)}
              </strong>

              <small>
                {displayTipPercent.toFixed(1)}% of bill
              </small>

            </div>

            {/* RESULT ROWS */}
            <div className="rows">

              <div>
                <span>
                  Bill
                </span>

                <b>
                  {money(billNum)}
                </b>
              </div>

              <div>
                <span>
                  Tip
                </span>

                <b className="green">
                  {money(calculations.actualTip)}
                </b>
              </div>

              <div className="total">
                <span>
                  Total
                </span>

                <b>
                  {money(calculations.total)}
                </b>
              </div>

              {calculations.hasPaidAmount &&
                calculations.paymentTip && (
                  <div>
                    <span>
                      Paid
                    </span>

                    <b>
                      {money(paidNum)}
                    </b>
                  </div>
                )}

              {calculations.hasPaidAmount &&
                calculations.change > 0 && (
                  <div>
                    <span>
                      Change
                    </span>

                    <b className="green">
                      {money(calculations.change)}
                    </b>
                  </div>
                )}

              {calculations.hasPaidAmount &&
                calculations.amountDue > 0 && (
                  <div>
                    <span>
                      Amount due
                    </span>

                    <b className="due">
                      {money(calculations.amountDue)}
                    </b>
                  </div>
                )}

            </div>

            {/* PER PERSON */}
            <div className="per-person">

              <div>

                <span>
                  Per person
                </span>

                <small>
                  {people}{" "}
                  {people === 1
                    ? "person"
                    : "people"}{" "}
                  • Bill{" "}
                  {money(
                    calculations.billPerPerson
                  )}{" "}
                  + Tip{" "}
                  {money(
                    calculations.tipPerPerson
                  )}
                </small>

              </div>

              <strong>
                {money(
                  calculations.perPerson
                )}
              </strong>

            </div>

            <div className="mini-note">
              Bill{" "}
              {money(
                calculations.billPerPerson
              )}{" "}
              + Tip{" "}
              {money(
                calculations.tipPerPerson
              )}{" "}
              ={" "}
              {money(
                calculations.perPerson
              )}{" "}
              per person
            </div>

          </section>

        </div>

        {/* SPACE */}
        <div className="seo-space"></div>

        {/* SEO CONTENT */}
        <section className="seo-content">

          <article className="seo-block">

            <h2>
              What Is a Tip Calculator?
            </h2>

            <p>
              A tip calculator helps you calculate a tip,
              final bill, payment amount, change and the
              amount each person should pay. Enter your bill,
              choose a tip percentage and optionally enter
              the amount paid by the customer.
            </p>

          </article>

          <article className="seo-block">

            <h2>
              How to Use This Tip Calculator
            </h2>

            <p>
              Enter the bill amount and select a tip
              percentage. If you know how much the customer
              actually paid, enter that amount too. The
              calculator can then determine the actual tip,
              total payment, change or remaining amount due.
            </p>

          </article>

          <article className="seo-block">

            <h2>
              Calculate Tip From Customer Payment
            </h2>

            <p>
              This calculator can also work backwards from
              the amount paid. For example, if the bill is
              $500 and the customer pays $1,000, the extra
              $500 is calculated as the tip and the total
              payment is $1,000.
            </p>

          </article>

          <article className="seo-block">

            <h2>
              Tip Calculator Features
            </h2>

            <ul>
              <li>
                Calculate percentage-based tips instantly.
              </li>

              <li>
                Calculate the actual tip from customer payment.
              </li>

              <li>
                Calculate the final bill including tip.
              </li>

              <li>
                Calculate change from customer payment.
              </li>

              <li>
                Calculate the remaining amount due.
              </li>

              <li>
                Split the bill between multiple people.
              </li>

              <li>
                Supports dollar, euro, pound and rupee symbols.
              </li>

              <li>
                Works directly in your browser.
              </li>

              <li>
                No account or sign-up required.
              </li>
            </ul>

          </article>

          <article className="seo-block">

            <h2>
              Restaurant Tip Calculator
            </h2>

            <p>
              Use this calculator for restaurants, cafes,
              hotels and other services. You can calculate
              a standard percentage tip or determine the
              actual tip when the customer's payment amount
              is known.
            </p>

          </article>

          <article className="seo-block">

            <h2>
              Split Bill Calculator
            </h2>

            <p>
              When several people share a bill, select the
              number of people to instantly calculate each
              person's share of the bill and tip.
            </p>

          </article>

          <article className="seo-block">

            <h2>
              Tip Percentage Guide
            </h2>

            <p>
              Common tip percentages include 10%, 15%, 18%,
              20% and 25%. The appropriate percentage depends
              on the country, service and personal preference.
            </p>

          </article>

          {/* RELATED */}
          <section className="related-tools">

            <h2>
              Related Calculators
            </h2>

            <div className="related-grid">

              <a href="/percentage-calculator">
                Percentage Calculator
              </a>

              <a href="/emi-calculator">
                EMI Calculator
              </a>

              <a href="/age-calculator">
                Age Calculator
              </a>

              <a href="/bmi-calculator">
                BMI Calculator
              </a>

            </div>

          </section>

          {/* FAQ */}
          <section className="faq-section">

            <h2>
              Tip Calculator FAQ
            </h2>

            <details>
              <summary>
                Is this tip calculator free?
              </summary>

              <p>
                Yes. The calculator is free to use and
                does not require registration or a paid
                subscription.
              </p>
            </details>

            <details>
              <summary>
                How is the tip calculated?
              </summary>

              <p>
                When no customer payment is entered,
                the tip is calculated by multiplying
                the bill by the selected percentage.
                When a sufficient customer payment is
                entered, the calculator can determine
                the actual tip from the extra amount paid.
              </p>
            </details>

            <details>
              <summary>
                If the bill is $500 and the customer pays
                $1,000, what is the tip?
              </summary>

              <p>
                The extra $500 is treated as the actual
                tip. The total payment is $1,000 and
                there is no change.
              </p>
            </details>

            <details>
              <summary>
                Can I split the bill between people?
              </summary>

              <p>
                Yes. Increase the number of people and
                the calculator will show each person's
                share of the bill and tip.
              </p>
            </details>

            <details>
              <summary>
                Can I calculate change?
              </summary>

              <p>
                Yes. If the payment amount is greater
                than the calculated total, the calculator
                can show the remaining change.
              </p>
            </details>

            <details>
              <summary>
                Can I see how much is still owed?
              </summary>

              <p>
                Yes. If the amount paid is not enough
                to cover the expected bill and tip,
                the remaining amount due is displayed.
              </p>
            </details>

            <details>
              <summary>
                Does the calculator work on mobile?
              </summary>

              <p>
                Yes. It is designed for phones, tablets
                and desktop browsers.
              </p>
            </details>

            <details>
              <summary>
                Do I need to install an app?
              </summary>

              <p>
                No. The calculator works directly in
                a modern web browser.
              </p>
            </details>

          </section>

          {/* TRUST */}
          <section className="trust-note">

            <h2>
              Simple, Fast and Easy to Use
            </h2>

            <p>
              This calculator keeps tip and payment
              calculations simple. Calculations are
              performed directly in your browser, so
              you do not need an account just to
              calculate a tip.
            </p>

          </section>

        </section>

        <footer>
          Free • No sign-up • Instant calculation • thenexoratools
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

        .top-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .brand {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #171b28;
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

        .header {
          text-align: center;
          margin-bottom: 14px;
        }

        .header h1 {
          margin: 4px 0 5px;
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
          font-size: 12px;
          line-height: 1.5;
        }

        .main {
          display: grid;
          grid-template-columns: 1fr 0.88fr;
          gap: 10px;
          align-items: start;
        }

        .card {
          border: 1px solid #e3e6ed;
          background: #fff;
          border-radius: 17px;
          box-shadow:
            0 8px 28px rgba(30, 40, 70, 0.045);
        }

        .input-card,
        .result-card {
          padding: 15px;
        }

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
          box-shadow:
            0 2px 6px rgba(30, 40, 70, 0.08);
        }

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
          min-width: 0;
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
          box-shadow:
            0 4px 10px rgba(102, 92, 246, 0.18);
        }

        .payment-note {
          margin-top: 9px;
          padding: 8px 10px;
          border-radius: 9px;
          background: #f7f7ff;
          border: 1px solid #e7e5ff;
        }

        .payment-note span {
          display: block;
          color: #8d94a4;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .payment-note p {
          margin: 3px 0 0;
          color: #6f7788;
          font-size: 9px;
          line-height: 1.5;
        }

        .payment-note strong {
          color: #665cf6;
        }

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

        .counter button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .counter strong {
          min-width: 16px;
          text-align: center;
          font-size: 12px;
        }

        .actions {
          display: flex;
          gap: 6px;
          margin-top: 9px;
        }

        .actions button {
          flex: 1;
          border-radius: 8px;
          padding: 7px 8px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .secondary-btn {
          border: 1px solid #e2e6ed;
          background: #fff;
          color: #697286;
        }

        .copy-btn {
          border: 1px solid #665cf6;
          background: #665cf6;
          color: #fff;
        }

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
          background:
            linear-gradient(
              135deg,
              #6259f5,
              #827bf8
            );
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

        .rows .due {
          color: #c87916;
        }

        .rows .total span {
          color: #343b49;
          font-weight: 900;
        }

        .rows .total b {
          font-size: 15px;
          font-weight: 900;
        }

        .per-person {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
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
          line-height: 1.5;
        }

        .per-person strong {
          color: #665cf6;
          font-size: 17px;
          white-space: nowrap;
        }

        .mini-note {
          text-align: center;
          color: #9aa1ad;
          font-size: 8px;
          margin-top: 5px;
          line-height: 1.5;
        }

        .seo-space {
          height: 82px;
        }

        .seo-content {
          max-width: 820px;
          margin: 0 auto;
          color: #697285;
        }

        .seo-block,
        .related-tools,
        .faq-section,
        .trust-note {
          margin-bottom: 28px;
        }

        .seo-content h2 {
          color: #252b38;
          font-size: 20px;
          line-height: 1.3;
          margin: 0 0 9px;
          font-weight: 900;
        }

        .seo-content p {
          margin: 0;
          font-size: 15px;
          line-height: 1.75;
        }

        .seo-content ul {
          margin: 7px 0 0;
          padding-left: 21px;
        }

        .seo-content li {
          font-size: 15px;
          line-height: 1.75;
          margin: 2px 0;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .related-grid a {
          display: block;
          padding: 11px 8px;
          border: 1px solid #e5e8ee;
          background: #fff;
          border-radius: 9px;
          color: #665cf6;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          text-align: center;
        }

        .faq-section details {
          border-bottom: 1px solid #e8ebf0;
          padding: 11px 0;
        }

        .faq-section summary {
          cursor: pointer;
          color: #3e4655;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.5;
        }

        .faq-section details p {
          padding-top: 7px;
        }

        .trust-note {
          padding: 16px;
          border: 1px solid #e6e8ee;
          background: #fff;
          border-radius: 11px;
        }

        footer {
          text-align: center;
          color: #a1a8b4;
          font-size: 11px;
          margin-top: 10px;
        }

        @media (max-width: 700px) {

          .tip-page {
            padding: 10px 9px 18px;
          }

          .top-brand {
            margin-bottom: 6px;
          }

          .brand {
            font-size: 10px;
          }

          .badge {
            padding: 4px 9px;
            font-size: 8px;
          }

          .header {
            margin-bottom: 9px;
          }

          .header h1 {
            margin: 4px 0 3px;
            font-size: 25px;
          }

          .header p {
            font-size: 10px;
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

          .payment-note {
            margin-top: 6px;
            padding: 7px 8px;
          }

          .payment-note p {
            font-size: 8px;
          }

          .people-row {
            margin-top: 7px;
            padding-top: 7px;
          }

          .actions {
            margin-top: 7px;
          }

          .actions button {
            padding: 7px 6px;
            font-size: 8px;
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
            padding: 6px 0;
          }

          .per-person {
            margin-top: 6px;
            padding: 8px 9px;
          }

          .per-person strong {
            font-size: 15px;
          }

          .seo-space {
            height: 60px;
          }

          .seo-content h2 {
            font-size: 18px;
          }

          .seo-content p,
          .seo-content li {
            font-size: 14px;
            line-height: 1.7;
          }

          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .related-grid a {
            font-size: 11px;
            padding: 10px 5px;
          }

          .faq-section summary {
            font-size: 13px;
          }

          footer {
            margin-top: 7px;
            font-size: 10px;
          }
        }

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

          .seo-space {
            height: 55px;
          }
        }

      `}</style>
    </main>
  );
}
