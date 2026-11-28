"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Mode = "loan" | "emi";
type TenureUnit = "years" | "months";

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
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

type LoanResult = {
  principal: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  months: number;
  rate: number;
};

type EmiResult = {
  maxLoan: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  months: number;
  rate: number;
};

type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

function numberValue(value: string): number {
  if (!value.trim()) return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatMoney(
  value: number,
  currency: Currency,
  decimals = 0
): string {
  if (!Number.isFinite(value)) {
    return `${currency.symbol}0`;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return (
      currency.symbol +
      value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  }
}

/* -------------------------------------------------------
   STANDARD REDUCING-BALANCE EMI CALCULATION
------------------------------------------------------- */

function calculateLoan(
  principal: number,
  annualRate: number,
  months: number
): LoanResult | null {
  if (
    principal <= 0 ||
    annualRate < 0 ||
    months <= 0 ||
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(months)
  ) {
    return null;
  }

  const monthlyRate = annualRate / 100 / 12;

  let emi: number;

  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);

    emi =
      (principal * monthlyRate * factor) /
      (factor - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = Math.max(
    0,
    totalPayment - principal
  );

  return {
    principal,
    emi,
    totalInterest,
    totalPayment,
    months,
    rate: annualRate,
  };
}

/* -------------------------------------------------------
   REVERSE EMI CALCULATOR
   EMI + RATE + TENURE -> MAXIMUM LOAN
------------------------------------------------------- */

function calculateMaxLoan(
  emi: number,
  annualRate: number,
  months: number
): EmiResult | null {
  if (
    emi <= 0 ||
    annualRate < 0 ||
    months <= 0 ||
    !Number.isFinite(emi) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(months)
  ) {
    return null;
  }

  const monthlyRate = annualRate / 100 / 12;

  let maxLoan: number;

  if (monthlyRate === 0) {
    maxLoan = emi * months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);

    maxLoan =
      (emi * (factor - 1)) /
      (monthlyRate * factor);
  }

  const totalPayment = emi * months;

  const totalInterest = Math.max(
    0,
    totalPayment - maxLoan
  );

  return {
    maxLoan,
    emi,
    totalInterest,
    totalPayment,
    months,
    rate: annualRate,
  };
}

/* -------------------------------------------------------
   AMORTIZATION SCHEDULE
------------------------------------------------------- */

function buildAmortization(
  principal: number,
  emi: number,
  rate: number,
  months: number
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];

  let balance = principal;

  const monthlyRate = rate / 100 / 12;

  for (let month = 1; month <= months; month++) {
    const interest =
      monthlyRate > 0
        ? balance * monthlyRate
        : 0;

    let principalPart =
      monthlyRate === 0
        ? emi
        : emi - interest;

    if (month === months) {
      principalPart = balance;
    }

    const payment =
      principalPart + interest;

    balance = Math.max(
      0,
      balance - principalPart
    );

    rows.push({
      month,
      payment,
      principal: principalPart,
      interest,
      balance,
    });
  }

  return rows;
}

export default function LoanEMIClient() {
  const [mode, setMode] =
    useState<Mode>("loan");

  const [currency, setCurrency] =
    useState("INR");

  /* -------------------------------
     LOAN CALCULATOR
  -------------------------------- */

  const [amount, setAmount] =
    useState("500000");

  const [rate, setRate] =
    useState("9.5");

  const [tenure, setTenure] =
    useState("5");

  const [tenureUnit, setTenureUnit] =
    useState<TenureUnit>("years");

  const [extraPayment, setExtraPayment] =
    useState("0");

  /* -------------------------------
     EMI CALCULATOR
  -------------------------------- */

  const [emiAmount, setEmiAmount] =
    useState("10000");

  const [emiRate, setEmiRate] =
    useState("9.5");

  const [emiTenure, setEmiTenure] =
    useState("5");

  const [emiTenureUnit, setEmiTenureUnit] =
    useState<TenureUnit>("years");

  /* -------------------------------
     UI STATE
  -------------------------------- */

  const [showSchedule, setShowSchedule] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [notice, setNotice] =
    useState("");

  const selectedCurrency =
    CURRENCIES.find(
      (item) => item.code === currency
    ) ?? CURRENCIES[0];

  /* -------------------------------
     MONTH CALCULATIONS
  -------------------------------- */

  const loanMonths = Math.max(
    1,
    Math.round(
      tenureUnit === "years"
        ? numberValue(tenure) * 12
        : numberValue(tenure)
    )
  );

  const emiMonths = Math.max(
    1,
    Math.round(
      emiTenureUnit === "years"
        ? numberValue(emiTenure) * 12
        : numberValue(emiTenure)
    )
  );

  /* -------------------------------
     LIVE RESULTS
  -------------------------------- */

  const loanResult = useMemo(
    () =>
      calculateLoan(
        numberValue(amount),
        numberValue(rate),
        loanMonths
      ),
    [amount, rate, loanMonths]
  );

  const emiResult = useMemo(
    () =>
      calculateMaxLoan(
        numberValue(emiAmount),
        numberValue(emiRate),
        emiMonths
      ),
    [emiAmount, emiRate, emiMonths]
  );

  const activeResult =
    mode === "loan"
      ? loanResult
      : emiResult;

  /* -------------------------------
     VALIDATION
  -------------------------------- */

  const validationError =
    mode === "loan"
      ? numberValue(amount) <= 0
        ? "Enter a loan amount greater than zero."
        : numberValue(amount) > 1000000000000
        ? "Enter a loan amount below 1 trillion."
        : numberValue(rate) < 0 ||
          numberValue(rate) > 100
        ? "Enter an interest rate between 0% and 100%."
        : numberValue(tenure) <= 0
        ? "Enter a loan tenure greater than zero."
        : loanMonths > 600
        ? "Loan tenure cannot exceed 50 years."
        : ""
      : numberValue(emiAmount) <= 0
      ? "Enter a monthly EMI greater than zero."
      : numberValue(emiAmount) >
        100000000000
      ? "Enter a monthly EMI below 100 billion."
      : numberValue(emiRate) < 0 ||
        numberValue(emiRate) > 100
      ? "Enter an interest rate between 0% and 100%."
      : numberValue(emiTenure) <= 0
      ? "Enter a tenure greater than zero."
      : emiMonths > 600
      ? "Tenure cannot exceed 50 years."
      : "";

  /* -------------------------------
     AMORTIZATION
  -------------------------------- */

  const schedule = useMemo(() => {
    if (mode === "loan" && loanResult) {
      return buildAmortization(
        loanResult.principal,
        loanResult.emi,
        loanResult.rate,
        loanResult.months
      );
    }

    if (mode === "emi" && emiResult) {
      return buildAmortization(
        emiResult.maxLoan,
        emiResult.emi,
        emiResult.rate,
        emiResult.months
      );
    }

    return [];
  }, [
    mode,
    loanResult,
    emiResult,
  ]);

  /* -------------------------------
     PREPAYMENT SAVINGS
  -------------------------------- */

  const extra =
    numberValue(extraPayment);

  const prepayment = useMemo(() => {
    if (
      mode !== "loan" ||
      !loanResult ||
      extra <= 0
    ) {
      return null;
    }

    let balance =
      loanResult.principal;

    const monthlyRate =
      loanResult.rate / 100 / 12;

    let month = 0;
    let totalPaid = 0;

    while (
      balance > 0.01 &&
      month < 1200
    ) {
      month++;

      const interest =
        monthlyRate > 0
          ? balance * monthlyRate
          : 0;

      const normalPrincipal =
        monthlyRate === 0
          ? loanResult.emi
          : loanResult.emi -
            interest;

      let principalPaid =
        normalPrincipal + extra;

      let payment =
        loanResult.emi + extra;

      if (principalPaid >= balance) {
        principalPaid = balance;
        payment =
          balance + interest;
      }

      balance = Math.max(
        0,
        balance - principalPaid
      );

      totalPaid += payment;
    }

    const interestWithExtra =
      Math.max(
        0,
        totalPaid -
          loanResult.principal
      );

    return {
      newMonths: month,
      monthsSaved: Math.max(
        0,
        loanResult.months -
          month
      ),
      savedInterest: Math.max(
        0,
        loanResult.totalInterest -
          interestWithExtra
      ),
      totalPaid,
    };
  }, [
    mode,
    loanResult,
    extra,
  ]);

  /* -------------------------------
     PRINCIPAL / INTEREST SPLIT
  -------------------------------- */

  const principalAmount =
    mode === "loan" && loanResult
      ? loanResult.principal
      : emiResult
      ? emiResult.maxLoan
      : 0;

  const principalPercent =
    activeResult &&
    activeResult.totalPayment > 0
      ? (principalAmount /
          activeResult.totalPayment) *
        100
      : 0;

  const interestPercent =
    activeResult
      ? Math.max(
          0,
          100 - principalPercent
        )
      : 0;

  /* -------------------------------
     RESET
  -------------------------------- */

  const reset = () => {
    setAmount("500000");
    setRate("9.5");
    setTenure("5");
    setTenureUnit("years");

    setExtraPayment("0");

    setEmiAmount("10000");
    setEmiRate("9.5");
    setEmiTenure("5");
    setEmiTenureUnit("years");

    setCurrency("INR");

    setShowSchedule(false);
    setCopied(false);
    setNotice("");
  };

  /* -------------------------------
     COPY
  -------------------------------- */

  const copyResults = async () => {
    if (!activeResult) return;

    let text = "";

    if (
      mode === "loan" &&
      loanResult
    ) {
      text = [
        "Loan Calculator",
        "",
        `Loan Amount: ${formatMoney(
          loanResult.principal,
          selectedCurrency
        )}`,
        `Interest Rate: ${loanResult.rate}%`,
        `Tenure: ${loanResult.months} months`,
        `Monthly EMI: ${formatMoney(
          loanResult.emi,
          selectedCurrency
        )}`,
        `Total Interest: ${formatMoney(
          loanResult.totalInterest,
          selectedCurrency
        )}`,
        `Total Payment: ${formatMoney(
          loanResult.totalPayment,
          selectedCurrency
        )}`,
        "",
        "Calculated with thenexoratools.com",
      ].join("\n");
    }

    if (
      mode === "emi" &&
      emiResult
    ) {
      text = [
        "EMI Calculator",
        "",
        `Monthly EMI: ${formatMoney(
          emiResult.emi,
          selectedCurrency
        )}`,
        `Interest Rate: ${emiResult.rate}%`,
        `Tenure: ${emiResult.months} months`,
        `Maximum Loan Amount: ${formatMoney(
          emiResult.maxLoan,
          selectedCurrency
        )}`,
        `Total Interest: ${formatMoney(
          emiResult.totalInterest,
          selectedCurrency
        )}`,
        `Total Payment: ${formatMoney(
          emiResult.totalPayment,
          selectedCurrency
        )}`,
        "",
        "Calculated with thenexoratools.com",
      ].join("\n");
    }

    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setNotice(
        "Copy is not available in this browser."
      );
    }
  };

  /* -------------------------------
     SHARE
  -------------------------------- */

  const share = async () => {
    const title =
      mode === "loan"
        ? "Loan Calculator"
        : "EMI Calculator";

    const text =
      mode === "loan"
        ? "Calculate monthly EMI, total interest and total repayment."
        : "Calculate the maximum loan amount based on your affordable EMI.";

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setNotice(
          "Tool link copied to your clipboard."
        );

        window.setTimeout(() => {
          setNotice("");
        }, 1800);
      }
    } catch {
      // User cancelled sharing.
    }
  };

  /* -------------------------------
     STYLES
  -------------------------------- */

  const styles: Record<
    string,
    CSSProperties
  > = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(180deg,#f7f8fc 0%,#ffffff 48%,#f6f7fb 100%)",
      color: "#151827",
      fontFamily:
        "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif",
      paddingBottom: 45,
    },

    container: {
      width:
        "min(900px,calc(100% - 22px))",
      margin: "0 auto",
    },

    top: {
      padding: "15px 0 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    brand: {
      fontSize: 17,
      fontWeight: 950,
      letterSpacing: "-.5px",
      textDecoration: "none",
      color: "#151827",
    },

    brandAccent: {
      color: "#6c5ce7",
    },

    topLink: {
      fontSize: 9,
      fontWeight: 850,
      color: "#667085",
      textDecoration: "none",
    },

    intro: {
      textAlign: "center",
      padding: "10px 4px 14px",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 9px",
      borderRadius: 999,
      background: "#f1efff",
      color: "#604ff0",
      border: "1px solid #e4e0ff",
      fontSize: 8,
      fontWeight: 950,
      letterSpacing: ".5px",
    },

    h1: {
      margin: "8px 0 4px",
      fontSize:
        "clamp(25px,7vw,38px)",
      lineHeight: 1.05,
      letterSpacing: "-1.6px",
      fontWeight: 950,
    },

    subtitle: {
      maxWidth: 590,
      margin: "0 auto",
      color: "#667085",
      fontSize: 10,
      lineHeight: 1.55,
    },

    tabs: {
      display: "grid",
      gridTemplateColumns:
        "1fr 1fr",
      gap: 6,
      padding: 5,
      borderRadius: 15,
      background: "#eef0f5",
      marginBottom: 10,
    },

    tab: {
      border: 0,
      borderRadius: 11,
      padding: "11px 7px",
      background: "transparent",
      color: "#667085",
      fontSize: 10,
      fontWeight: 950,
      cursor: "pointer",
    },

    activeTab: {
      background: "#ffffff",
      color: "#5c4bdd",
      boxShadow:
        "0 3px 13px rgba(16,24,40,.08)",
    },

    card: {
      background: "#ffffff",
      border: "1px solid #e6e9ef",
      borderRadius: 18,
      padding: 15,
      marginBottom: 10,
      boxShadow:
        "0 6px 28px rgba(16,24,40,.035)",
    },

    cardTitle: {
      fontSize: 12,
      fontWeight: 950,
      marginBottom: 4,
    },

    mini: {
      color: "#98a2b3",
      fontSize: 8,
      fontWeight: 800,
      lineHeight: 1.5,
    },

    label: {
      display: "block",
      margin: "11px 0 4px",
      color: "#475467",
      fontSize: 8,
      fontWeight: 900,
      letterSpacing: ".4px",
      textTransform: "uppercase",
    },

    inputRow: {
      display: "grid",
      gridTemplateColumns:
        "minmax(0,1fr) 115px",
      gap: 6,
    },

    input: {
      width: "100%",
      height: 42,
      boxSizing: "border-box",
      border:
        "1px solid #dfe3e8",
      borderRadius: 10,
      background: "#fbfcfd",
      color: "#151827",
      padding: "0 11px",
      fontSize: 14,
      fontWeight: 800,
      outline: "none",
    },

    select: {
      width: "100%",
      height: 42,
      boxSizing: "border-box",
      border:
        "1px solid #dfe3e8",
      borderRadius: 10,
      background: "#fbfcfd",
      color: "#151827",
      padding: "0 8px",
      fontSize: 9,
      fontWeight: 850,
      outline: "none",
    },

    currencyRow: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      paddingBottom: 2,
    },

    currency: {
      flex: "0 0 auto",
      border:
        "1px solid #e4e7ec",
      background: "#f8fafc",
      color: "#475467",
      borderRadius: 9,
      minWidth: 55,
      height: 33,
      fontSize: 8,
      fontWeight: 900,
      cursor: "pointer",
    },

    error: {
      marginTop: 8,
      padding: "8px 10px",
      borderRadius: 9,
      background: "#fff4f2",
      border:
        "1px solid #ffd9d4",
      color: "#b42318",
      fontSize: 9,
      fontWeight: 750,
    },

    notice: {
      marginTop: 8,
      padding: "8px 10px",
      borderRadius: 9,
      background: "#effcf6",
      border:
        "1px solid #cceedd",
      color: "#087443",
      fontSize: 9,
      fontWeight: 750,
    },

    result: {
      marginBottom: 10,
      borderRadius: 18,
      padding: 15,
      background:
        "linear-gradient(135deg,#f1efff 0%,#f8f7ff 100%)",
      border:
        "1px solid #dfdcff",
    },

    resultLabel: {
      textAlign: "center",
      color: "#667085",
      fontSize: 8,
      fontWeight: 900,
      letterSpacing: ".7px",
    },

    emi: {
      textAlign: "center",
      marginTop: 2,
      color: "#5141d5",
      fontSize:
        "clamp(28px,8vw,43px)",
      lineHeight: 1.05,
      fontWeight: 950,
      letterSpacing: "-1.5px",
      fontVariantNumeric:
        "tabular-nums",
      overflowWrap: "anywhere",
    },

    perMonth: {
      textAlign: "center",
      color: "#667085",
      fontSize: 9,
      marginTop: 3,
    },

    stats: {
      display: "grid",
      gridTemplateColumns:
        "repeat(3,1fr)",
      gap: 6,
      marginTop: 10,
    },

    stat: {
      background: "#ffffff",
      border:
        "1px solid #e8e8f2",
      borderRadius: 10,
      padding: "8px 5px",
      textAlign: "center",
      minWidth: 0,
    },

    statLabel: {
      color: "#98a2b3",
      fontSize: 7,
      fontWeight: 900,
      textTransform: "uppercase",
    },

    statValue: {
      marginTop: 3,
      color: "#151827",
      fontSize: 10,
      fontWeight: 950,
      wordBreak: "break-word",
    },

    chart: {
      marginTop: 10,
    },

    bar: {
      display: "flex",
      height: 10,
      overflow: "hidden",
      borderRadius: 999,
      background: "#eaecf0",
    },

    principalBar: {
      background: "#6c5ce7",
    },

    interestBar: {
      background: "#c9c4ff",
    },

    legend: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 5,
      color: "#667085",
      fontSize: 7,
      fontWeight: 800,
    },

    resultActions: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginTop: 10,
    },

    smallButton: {
      flex: 1,
      minWidth: 90,
      border:
        "1px solid #dfe3e8",
      background: "#ffffff",
      color: "#475467",
      borderRadius: 9,
      height: 34,
      fontSize: 8,
      fontWeight: 900,
      cursor: "pointer",
    },

    prepay: {
      marginTop: 10,
      padding: 12,
      borderRadius: 13,
      background: "#f0fdfa",
      border:
        "1px solid #c9f3ec",
    },

    prepayTitle: {
      fontSize: 10,
      fontWeight: 950,
      color: "#101828",
    },

    prepayText: {
      marginTop: 3,
      fontSize: 8,
      lineHeight: 1.55,
      color: "#667085",
    },

    saveValue: {
      marginTop: 7,
      fontSize: 18,
      fontWeight: 950,
      color: "#087f6b",
    },

    scheduleButton: {
      width: "100%",
      marginTop: 9,
      height: 36,
      border:
        "1px solid #dfe3e8",
      borderRadius: 9,
      background: "#ffffff",
      color: "#475467",
      fontSize: 8,
      fontWeight: 900,
      cursor: "pointer",
    },

    tableWrap: {
      marginTop: 9,
      overflowX: "auto",
      border:
        "1px solid #e7eaf0",
      borderRadius: 10,
    },

    table: {
      width: "100%",
      minWidth: 560,
      borderCollapse: "collapse",
      fontSize: 8,
    },

    th: {
      padding: 7,
      background: "#f8fafc",
      color: "#667085",
      textAlign: "right",
      borderBottom:
        "1px solid #e7eaf0",
      fontWeight: 900,
    },

    thFirst: {
      textAlign: "left",
    },

    td: {
      padding: 7,
      color: "#475467",
      textAlign: "right",
      borderBottom:
        "1px solid #f0f1f4",
      fontVariantNumeric:
        "tabular-nums",
    },

    tdFirst: {
      textAlign: "left",
      fontWeight: 800,
      color: "#151827",
    },

    infoTitle: {
      fontSize: 11,
      fontWeight: 950,
      marginBottom: 5,
    },

    paragraph: {
      fontSize: 9,
      lineHeight: 1.7,
      color: "#667085",
      margin: 0,
    },

    list: {
      margin: "7px 0 0",
      paddingLeft: 17,
      color: "#667085",
      fontSize: 9,
      lineHeight: 1.8,
    },

    formula: {
      marginTop: 12,
      padding: 10,
      borderRadius: 10,
      background: "#f8fafc",
      border:
        "1px solid #eaecf0",
    },

    formulaLabel: {
      fontSize: 8,
      fontWeight: 900,
      color: "#475467",
      marginBottom: 3,
    },

    formulaText: {
      fontSize: 10,
      fontWeight: 800,
      color: "#151827",
      wordBreak: "break-word",
    },

    formulaNote: {
      marginTop: 4,
      fontSize: 8,
      color: "#98a2b3",
    },

    faq: {
      border:
        "1px solid #e7eaf0",
      borderRadius: 11,
      padding: "9px 10px",
      background: "#fafbfc",
      marginTop: 6,
    },

    faqQuestion: {
      fontSize: 9,
      fontWeight: 900,
      color: "#151827",
      cursor: "pointer",
    },

    faqAnswer: {
      margin: "5px 0 0",
      fontSize: 8,
      lineHeight: 1.65,
      color: "#667085",
    },

    related: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 8,
    },

    relatedLink: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: 30,
      padding: "0 10px",
      borderRadius: 8,
      background: "#f5f3ff",
      border:
        "1px solid #e8e4ff",
      color: "#5c4bdd",
      textDecoration: "none",
      fontSize: 8,
      fontWeight: 850,
    },

    footer: {
      textAlign: "center",
      padding: "18px 0 0",
      color: "#98a2b3",
      fontSize: 8,
      lineHeight: 1.7,
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <header style={styles.top}>
          <a
            href="/"
            style={styles.brand}
            aria-label="thenexoratools home"
          >
            thenexora
            <span style={styles.brandAccent}>
              tools
            </span>
          </a>

          <a
            href="/"
            style={styles.topLink}
          >
            ← All Tools
          </a>
        </header>

        {/* HERO */}

        <section style={styles.intro}>
          <div style={styles.badge}>
            FREE • LOAN & EMI CALCULATOR
          </div>

          <h1 style={styles.h1}>
            {mode === "loan"
              ? "Loan Calculator"
              : "EMI Calculator"}
          </h1>

          <p style={styles.subtitle}>
            {mode === "loan"
              ? "Calculate your monthly EMI, total interest and total repayment in seconds."
              : "Enter the monthly EMI you can afford and estimate the maximum loan amount you could repay."}
          </p>
        </section>

        {/* MODE SWITCHER */}

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => {
              setMode("loan");
              setShowSchedule(false);
              setNotice("");
            }}
            style={{
              ...styles.tab,
              ...(mode === "loan"
                ? styles.activeTab
                : {}),
            }}
            aria-pressed={
              mode === "loan"
            }
          >
            🏦 Loan Calculator
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("emi");
              setShowSchedule(false);
              setNotice("");
            }}
            style={{
              ...styles.tab,
              ...(mode === "emi"
                ? styles.activeTab
                : {}),
            }}
            aria-pressed={
              mode === "emi"
            }
          >
            📊 EMI Calculator
          </button>
        </div>

        {/* INPUT CARD */}

        <section style={styles.card}>
          <div style={styles.cardTitle}>
            {mode === "loan"
              ? "Loan Details"
              : "EMI Details"}
          </div>

          <div style={styles.mini}>
            {mode === "loan"
              ? "Enter the loan amount, annual interest rate and repayment period."
              : "Enter the monthly EMI you can afford, annual interest rate and repayment period."}
          </div>

          {mode === "loan" ? (
            <>
              <label
                htmlFor="loan-amount"
                style={styles.label}
              >
                Loan Amount
              </label>

              <div style={styles.inputRow}>
                <input
                  id="loan-amount"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                  placeholder="500000"
                  style={styles.input}
                />

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                  style={styles.select}
                  aria-label="Currency"
                >
                  {CURRENCIES.map(
                    (item) => (
                      <option
                        key={
                          item.code
                        }
                        value={
                          item.code
                        }
                      >
                        {item.symbol}{" "}
                        {item.code}
                      </option>
                    )
                  )}
                </select>
              </div>

              <label
                htmlFor="loan-rate"
                style={styles.label}
              >
                Interest Rate (% per year)
              </label>

              <input
                id="loan-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={rate}
                onChange={(e) =>
                  setRate(
                    e.target.value
                  )
                }
                placeholder="9.5"
                style={styles.input}
              />

              <label
                htmlFor="loan-tenure"
                style={styles.label}
              >
                Loan Tenure
              </label>

              <div style={styles.inputRow}>
                <input
                  id="loan-tenure"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(
                      e.target.value
                    )
                  }
                  placeholder={
                    tenureUnit ===
                    "years"
                      ? "5"
                      : "60"
                  }
                  style={styles.input}
                />

                <select
                  value={
                    tenureUnit
                  }
                  onChange={(e) =>
                    setTenureUnit(
                      e.target
                        .value as TenureUnit
                    )
                  }
                  style={styles.select}
                >
                  <option value="years">
                    Years
                  </option>
                  <option value="months">
                    Months
                  </option>
                </select>
              </div>
            </>
          ) : (
            <>
              <label
                htmlFor="emi-amount"
                style={styles.label}
              >
                Monthly EMI You Can Pay
              </label>

              <div style={styles.inputRow}>
                <input
                  id="emi-amount"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={
                    emiAmount
                  }
                  onChange={(e) =>
                    setEmiAmount(
                      e.target.value
                    )
                  }
                  placeholder="10000"
                  style={styles.input}
                />

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                  style={styles.select}
                  aria-label="Currency"
                >
                  {CURRENCIES.map(
                    (item) => (
                      <option
                        key={
                          item.code
                        }
                        value={
                          item.code
                        }
                      >
                        {item.symbol}{" "}
                        {item.code}
                      </option>
                    )
                  )}
                </select>
              </div>

              <label
                htmlFor="emi-rate"
                style={styles.label}
              >
                Interest Rate (% per year)
              </label>

              <input
                id="emi-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={emiRate}
                onChange={(e) =>
                  setEmiRate(
                    e.target.value
                  )
                }
                placeholder="9.5"
                style={styles.input}
              />

              <label
                htmlFor="emi-tenure"
                style={styles.label}
              >
                Repayment Tenure
              </label>

              <div style={styles.inputRow}>
                <input
                  id="emi-tenure"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={
                    emiTenure
                  }
                  onChange={(e) =>
                    setEmiTenure(
                      e.target.value
                    )
                  }
                  placeholder={
                    emiTenureUnit ===
                    "years"
                      ? "5"
                      : "60"
                  }
                  style={styles.input}
                />

                <select
                  value={
                    emiTenureUnit
                  }
                  onChange={(e) =>
                    setEmiTenureUnit(
                      e.target
                        .value as TenureUnit
                    )
                  }
                  style={styles.select}
                >
                  <option value="years">
                    Years
                  </option>
                  <option value="months">
                    Months
                  </option>
                </select>
              </div>
            </>
          )}

          {/* CURRENCY */}

          <div
            style={{
              marginTop: 10,
            }}
          >
            <div
              style={{
                ...styles.mini,
                marginBottom: 5,
              }}
            >
              Currency
            </div>

            <div
              style={
                styles.currencyRow
              }
            >
              {CURRENCIES.map(
                (item) => {
                  const active =
                    item.code ===
                    currency;

                  return (
                    <button
                      key={
                        item.code
                      }
                      type="button"
                      onClick={() =>
                        setCurrency(
                          item.code
                        )
                      }
                      style={{
                        ...styles.currency,
                        border: active
                          ? "1px solid #6c5ce7"
                          : "1px solid #e4e7ec",
                        background:
                          active
                            ? "#f1efff"
                            : "#f8fafc",
                        color:
                          active
                            ? "#604ff0"
                            : "#475467",
                      }}
                    >
                      {item.symbol}{" "}
                      {item.code}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              style={styles.error}
            >
              {validationError}
            </div>
          )}

          {notice && (
            <div
              role="status"
              style={styles.notice}
            >
              {notice}
            </div>
          )}
        </section>

        {/* RESULT */}

        {activeResult &&
          !validationError && (
            <section
              style={styles.result}
              aria-live="polite"
            >
              <div
                style={
                  styles.resultLabel
                }
              >
                {mode === "loan"
                  ? "ESTIMATED MONTHLY EMI"
                  : "ESTIMATED MAXIMUM LOAN"}
              </div>

              <div
                style={styles.emi}
              >
                {mode === "loan" &&
                loanResult
                  ? formatMoney(
                      loanResult.emi,
                      selectedCurrency
                    )
                  : emiResult
                  ? formatMoney(
                      emiResult.maxLoan,
                      selectedCurrency
                    )
                  : formatMoney(
                      0,
                      selectedCurrency
                    )}
              </div>

              <div
                style={
                  styles.perMonth
                }
              >
                {mode === "loan"
                  ? "per month"
                  : `based on a ${formatMoney(
                      emiResult
                        ? emiResult.emi
                        : 0,
                      selectedCurrency
                    )} monthly EMI`}
              </div>

              {/* STATS */}

              <div
                style={styles.stats}
              >
                <div
                  style={styles.stat}
                >
                  <div
                    style={
                      styles.statLabel
                    }
                  >
                    {mode ===
                    "loan"
                      ? "Principal"
                      : "Loan Amount"}
                  </div>

                  <div
                    style={
                      styles.statValue
                    }
                  >
                    {formatMoney(
                      principalAmount,
                      selectedCurrency
                    )}
                  </div>
                </div>

                <div
                  style={styles.stat}
                >
                  <div
                    style={
                      styles.statLabel
                    }
                  >
                    Interest
                  </div>

                  <div
                    style={
                      styles.statValue
                    }
                  >
                    {formatMoney(
                      activeResult.totalInterest,
                      selectedCurrency
                    )}
                  </div>
                </div>

                <div
                  style={styles.stat}
                >
                  <div
                    style={
                      styles.statLabel
                    }
                  >
                    Total Payment
                  </div>

                  <div
                    style={
                      styles.statValue
                    }
                  >
                    {formatMoney(
                      activeResult.totalPayment,
                      selectedCurrency
                    )}
                  </div>
                </div>
              </div>

              {/* PAYMENT BREAKDOWN */}

              <div
                style={styles.chart}
              >
                <div
                  style={styles.bar}
                >
                  <div
                    style={{
                      ...styles.principalBar,
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          principalPercent
                        )
                      )}%`,
                    }}
                  />

                  <div
                    style={{
                      ...styles.interestBar,
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          interestPercent
                        )
                      )}%`,
                    }}
                  />
                </div>

                <div
                  style={
                    styles.legend
                  }
                >
                  <span>
                    Principal{" "}
                    {principalPercent.toFixed(
                      1
                    )}
                    %
                  </span>

                  <span>
                    Interest{" "}
                    {interestPercent.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* ACTIONS */}

              <div
                style={
                  styles.resultActions
                }
              >
                <button
                  type="button"
                  onClick={
                    copyResults
                  }
                  style={
                    styles.smallButton
                  }
                >
                  {copied
                    ? "✓ Copied"
                    : "Copy Results"}
                </button>

                <button
                  type="button"
                  onClick={
                    share
                  }
                  style={
                    styles.smallButton
                  }
                >
                  Share
                </button>

                <button
                  type="button"
                  onClick={
                    reset
                  }
                  style={
                    styles.smallButton
                  }
                >
                  Reset
                </button>
              </div>

              {/* PREPAYMENT */}

              {mode === "loan" && (
                <div
                  style={
                    styles.prepay
                  }
                >
                  <div
                    style={
                      styles.prepayTitle
                    }
                  >
                    Monthly Prepayment Savings
                  </div>

                  <div
                    style={
                      styles.prepayText
                    }
                  >
                    Enter an additional
                    amount you could
                    pay each month to
                    estimate potential
                    interest and tenure
                    savings.
                  </div>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={
                      extraPayment
                    }
                    onChange={(e) =>
                      setExtraPayment(
                        e.target
                          .value
                      )
                    }
                    placeholder="Example: 2000"
                    style={{
                      ...styles.input,
                      marginTop: 8,
                      background:
                        "#ffffff",
                    }}
                    aria-label="Extra monthly payment"
                  />

                  {prepayment &&
                    extra > 0 && (
                      <>
                        <div
                          style={
                            styles.saveValue
                          }
                        >
                          Save{" "}
                          {formatMoney(
                            prepayment.savedInterest,
                            selectedCurrency
                          )}
                        </div>

                        <div
                          style={
                            styles.prepayText
                          }
                        >
                          Estimated interest
                          savings. Your
                          loan could finish{" "}
                          <b>
                            {
                              prepayment.monthsSaved
                            }{" "}
                            month
                            {prepayment.monthsSaved !==
                            1
                              ? "s"
                              : ""}{" "}
                            earlier.
                          </b>
                        </div>
                      </>
                    )}
                </div>
              )}

              {/* EMI MODE TIP */}

              {mode === "emi" &&
                emiResult && (
                  <div
                    style={
                      styles.prepay
                    }
                  >
                    <div
                      style={
                        styles.prepayTitle
                      }
                    >
                      Keep Your EMI Affordable
                    </div>

                    <div
                      style={
                        styles.prepayText
                      }
                    >
                      A higher monthly
                      EMI generally allows
                      a larger loan amount
                      at the same rate and
                      tenure. A longer
                      tenure can reduce the
                      monthly EMI, but it
                      usually increases the
                      total interest paid.
                    </div>
                  </div>
                )}

              {/* SCHEDULE */}

              <button
                type="button"
                onClick={() =>
                  setShowSchedule(
                    (value) =>
                      !value
                  )
                }
                style={
                  styles.scheduleButton
                }
              >
                {showSchedule
                  ? "Hide Amortization Schedule"
                  : "View Amortization Schedule"}
              </button>

              {showSchedule && (
                <div
                  style={
                    styles.tableWrap
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            ...styles.th,
                            ...styles.thFirst,
                          }}
                        >
                          Month
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Payment
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Principal
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Interest
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {schedule
                        .slice(
                          0,
                          120
                        )
                        .map(
                          (
                            row
                          ) => (
                            <tr
                              key={
                                row.month
                              }
                            >
                              <td
                                style={{
                                  ...styles.td,
                                  ...styles.tdFirst,
                                }}
                              >
                                {
                                  row.month
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {formatMoney(
                                  row.payment,
                                  selectedCurrency
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {formatMoney(
                                  row.principal,
                                  selectedCurrency
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {formatMoney(
                                  row.interest,
                                  selectedCurrency
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {formatMoney(
                                  row.balance,
                                  selectedCurrency
                                )}
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>

                  {schedule.length >
                    120 && (
                    <div
                      style={{
                        padding:
                          "8px 10px",
                        color:
                          "#98a2b3",
                        fontSize: 8,
                      }}
                    >
                      Showing the first
                      120 months for a
                      compact view.
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

        {/* HOW IT WORKS */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            {mode === "loan"
              ? "Loan Calculator: How It Works"
              : "EMI Calculator: How It Works"}
          </div>

          <p
            style={
              styles.paragraph
            }
          >
            {mode === "loan"
              ? "Enter the amount you want to borrow, the annual interest rate and the repayment period. The calculator estimates your monthly EMI, total interest and total repayment using the standard reducing-balance EMI formula."
              : "Enter the monthly EMI you can afford, the annual interest rate and the repayment period. The calculator works backward from your EMI to estimate the maximum loan amount that fits those assumptions."}
          </p>

          <div
            style={
              styles.formula
            }
          >
            <div
              style={
                styles.formulaLabel
              }
            >
              {mode === "loan"
                ? "STANDARD EMI FORMULA"
                : "REVERSE EMI FORMULA"}
            </div>

            <div
              style={
                styles.formulaText
              }
            >
              {mode === "loan"
                ? "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)"
                : "P = EMI × ((1 + r)ⁿ − 1) ÷ (r × (1 + r)ⁿ)"}
            </div>

            <div
              style={
                styles.formulaNote
              }
            >
              P = principal • r =
              monthly interest rate •
              n = number of monthly
              payments
            </div>
          </div>
        </section>

        {/* STEPS */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            {mode === "loan"
              ? "How to Calculate Loan EMI"
              : "How to Estimate Your Maximum Loan"}
          </div>

          <ol
            style={styles.list}
          >
            {mode === "loan" ? (
              <>
                <li>
                  Enter your loan
                  amount.
                </li>

                <li>
                  Enter the annual
                  interest rate.
                </li>

                <li>
                  Select the repayment
                  tenure in years or
                  months.
                </li>

                <li>
                  Review your monthly
                  EMI, total interest
                  and total repayment.
                </li>
              </>
            ) : (
              <>
                <li>
                  Enter the monthly EMI
                  you can comfortably
                  pay.
                </li>

                <li>
                  Enter the annual
                  interest rate.
                </li>

                <li>
                  Select the repayment
                  tenure.
                </li>

                <li>
                  Review the estimated
                  maximum loan amount.
                </li>
              </>
            )}
          </ol>
        </section>

        {/* FEATURES */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            Why Use This Calculator?
          </div>

          <ul
            style={styles.list}
          >
            <li>
              Fast calculations directly
              in your browser.
            </li>

            <li>
              No registration required.
            </li>

            <li>
              Separate Loan and reverse
              EMI calculators.
            </li>

            <li>
              INR, USD, EUR, GBP, CAD,
              AUD and JPY support.
            </li>

            <li>
              Years or months for
              repayment periods.
            </li>

            <li>
              Monthly EMI, interest and
              total repayment shown
              together.
            </li>

            <li>
              Optional amortization
              schedule.
            </li>

            <li>
              Optional monthly
              prepayment savings
              estimate.
            </li>

            <li>
              Mobile-friendly design
              for phones, tablets and
              desktops.
            </li>
          </ul>
        </section>

        {/* LOAN VS EMI */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            Loan Calculator vs EMI Calculator
          </div>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 7,
              marginTop: 8,
            }}
          >
            <div
              style={{
                padding: 10,
                borderRadius: 11,
                background:
                  "#f8f7ff",
                border:
                  "1px solid #e8e4ff",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 950,
                  color:
                    "#5141d5",
                  marginBottom: 4,
                }}
              >
                LOAN CALCULATOR
              </div>

              <div
                style={{
                  fontSize: 8,
                  lineHeight: 1.6,
                  color:
                    "#667085",
                }}
              >
                You know the loan
                amount and want to
                calculate the monthly
                EMI.
              </div>
            </div>

            <div
              style={{
                padding: 10,
                borderRadius: 11,
                background:
                  "#f8f7ff",
                border:
                  "1px solid #e8e4ff",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 950,
                  color:
                    "#5141d5",
                  marginBottom: 4,
                }}
              >
                EMI CALCULATOR
              </div>

              <div
                style={{
                  fontSize: 8,
                  lineHeight: 1.6,
                  color:
                    "#667085",
                }}
              >
                You know the monthly
                EMI you can afford and
                want to estimate the
                maximum loan amount.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            Frequently Asked Questions
          </div>

          {(
            [
              [
                "What is an EMI?",
                "EMI stands for Equated Monthly Instalment. It is the regular payment made toward a loan over a selected repayment period.",
              ],
              [
                "How is EMI calculated?",
                "The calculator uses the standard reducing-balance EMI formula based on the principal, monthly interest rate and number of monthly payments.",
              ],
              [
                "Can I use this for home, car or personal loans?",
                "Yes. The calculator can be used for different loan types when you know the required loan amount, interest rate and repayment period.",
              ],
              [
                "What happens when the interest rate is 0%?",
                "At 0% interest, the principal is divided equally across the selected number of monthly payments.",
              ],
              [
                "Can I calculate maximum loan amount from EMI?",
                "Yes. Switch to EMI Calculator, enter the monthly EMI you can afford, interest rate and tenure, and the tool estimates the corresponding maximum loan amount.",
              ],
              [
                "Does a longer tenure reduce EMI?",
                "Usually, yes. A longer repayment period generally lowers the monthly EMI but can increase the total interest paid over the life of the loan.",
              ],
              [
                "Can I estimate prepayment savings?",
                "Yes. In Loan Calculator mode, enter an additional monthly payment to estimate potential interest savings and how much earlier the loan could be completed.",
              ],
              [
                "Are these results guaranteed by a lender?",
                "No. These are mathematical estimates. Actual lender calculations can differ because of fees, taxes, insurance, rate changes, rounding and lender-specific terms.",
              ],
            ] as [
              string,
              string
            ][]
          ).map(
            ([
              question,
              answer,
            ]) => (
              <details
                key={question}
                style={
                  styles.faq
                }
              >
                <summary
                  style={
                    styles.faqQuestion
                  }
                >
                  {question}
                </summary>

                <p
                  style={
                    styles.faqAnswer
                  }
                >
                  {answer}
                </p>
              </details>
            )
          )}
        </section>

        {/* PRIVACY / DISCLAIMER */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            Calculation & Privacy
          </div>

          <p
            style={
              styles.paragraph
            }
          >
            The calculator performs the
            displayed mathematical
            calculations in your browser
            and does not require an account
            or phone number. Avoid entering
            confidential banking credentials,
            account numbers or other
            sensitive financial information
            into any online calculator.
          </p>

          <p
            style={{
              ...styles.paragraph,
              marginTop: 8,
            }}
          >
            Results are estimates for
            planning purposes only. Actual
            loan terms, fees, interest
            calculations and approval
            criteria depend on the lender
            and the applicable loan
            agreement.
          </p>
        </section>

        {/* RELATED TOOLS */}

        <section
          style={styles.card}
        >
          <div
            style={
              styles.infoTitle
            }
          >
            Explore More Tools
          </div>

          <div
            style={
              styles.related
            }
          >
            <a
              href="/percentage-calculator"
              style={
                styles.relatedLink
              }
            >
              Percentage Calculator
            </a>

            <a
              href="/discount-calculator"
              style={
                styles.relatedLink
              }
            >
              Discount Calculator
            </a>

            <a
              href="/age-calculator"
              style={
                styles.relatedLink
              }
            >
              Age Calculator
            </a>

            <a
              href="/bmi-calculator"
              style={
                styles.relatedLink
              }
            >
              BMI Calculator
            </a>

            <a
              href="/"
              style={
                styles.relatedLink
              }
            >
              All Tools
            </a>
          </div>
        </section>

        {/* FOOTER */}

        <footer
          style={styles.footer}
        >
          Free Loan & EMI Calculator
          <br />
          No registration required
          <br />
          thenexoratools
        </footer>
      </div>
    </main>
  );
}
