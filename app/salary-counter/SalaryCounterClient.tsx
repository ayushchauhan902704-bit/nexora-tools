"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

const UNITS = [
  { id: "hour", label: "Hour" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

function formatMoney(
  value: number,
  symbol: string,
  decimals = 2
): string {
  if (!Number.isFinite(value)) {
    return `${symbol}0`;
  }

  return (
    symbol +
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

function safeNumber(value: string): number {
  if (value.trim() === "") return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function SalaryCounterClient() {
  const [amount, setAmount] = useState("");
  const [salaryUnit, setSalaryUnit] = useState("month");
  const [currency, setCurrency] = useState("USD");

  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const [started, setStarted] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const [now, setNow] = useState(() => Date.now());

  /*
   * This stores the amount already earned during previous
   * completed/paused sessions.
   */
  const [baseEarned, setBaseEarned] = useState(0);

  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  /*
   * Update the live clock only while the counter is running.
   */
  useEffect(() => {
    if (!started) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [started]);

  const selectedCurrency =
    CURRENCIES.find((item) => item.code === currency) ??
    CURRENCIES[0];

  const salary = safeNumber(amount);

  /*
   * Convert the selected salary period into annual salary.
   */
  const yearlySalary = useMemo(() => {
    if (salary <= 0) return 0;

    switch (salaryUnit) {
      case "hour":
        return salary * hoursPerDay * daysPerWeek * 52;

      case "day":
        return salary * daysPerWeek * 52;

      case "week":
        return salary * 52;

      case "month":
        return salary * 12;

      case "year":
        return salary;

      default:
        return 0;
    }
  }, [
    salary,
    salaryUnit,
    hoursPerDay,
    daysPerWeek,
  ]);

  /*
   * Estimated working hours in one year.
   */
  const yearlyWorkHours =
    hoursPerDay * daysPerWeek * 52;

  const perHour =
    yearlyWorkHours > 0
      ? yearlySalary / yearlyWorkHours
      : 0;

  const perMinute = perHour / 60;
  const perSecond = perHour / 3600;

  const perDay = perHour * hoursPerDay;
  const perWeek = perDay * daysPerWeek;
  const perMonth = yearlySalary / 12;

  const hasValidSalary = salary > 0;
  const canStart = hasValidSalary && perSecond > 0;

  /*
   * Current session earnings.
   */
  const currentSessionEarned =
    started && sessionStart !== null
      ? Math.max(
          0,
          ((now - sessionStart) / 1000) * perSecond
        )
      : 0;

  /*
   * Total displayed earnings.
   *
   * baseEarned = previous completed/paused sessions
   * currentSessionEarned = current running session
   */
  const liveEarned =
    baseEarned + currentSessionEarned;

  /*
   * Start / Resume.
   *
   * Important:
   * We do NOT reset baseEarned here.
   */
  const startCounter = () => {
    if (!canStart) {
      setMessage(
        "Enter a salary greater than zero to start."
      );
      return;
    }

    setMessage("");
    setCopied(false);

    setNow(Date.now());
    setSessionStart(Date.now());
    setStarted(true);
  };

  /*
   * Stop / Pause.
   *
   * The current session is converted into baseEarned exactly once.
   * Then sessionStart is cleared so it cannot be counted again.
   */
  const stopCounter = () => {
    if (
      started &&
      sessionStart !== null
    ) {
      const elapsedSeconds =
        Math.max(
          0,
          (Date.now() - sessionStart) / 1000
        );

      const earnedThisSession =
        elapsedSeconds * perSecond;

      setBaseEarned(
        (previous) =>
          previous + earnedThisSession
      );
    }

    setStarted(false);
    setSessionStart(null);
    setNow(Date.now());
  };

  /*
   * Reset everything.
   */
  const resetTool = () => {
    setAmount("");
    setSalaryUnit("month");
    setCurrency("USD");

    setHoursPerDay(8);
    setDaysPerWeek(5);

    setStarted(false);
    setSessionStart(null);

    setBaseEarned(0);
    setNow(Date.now());

    setCopied(false);
    setMessage("");
  };

  /*
   * Copy calculation summary.
   */
  const copySummary = async () => {
    if (!hasValidSalary) {
      setMessage(
        "Enter your salary before copying the results."
      );
      return;
    }

    const text = [
      "Live Salary Counter",
      "",
      `Salary: ${formatMoney(
        salary,
        selectedCurrency.symbol,
        2
      )} / ${salaryUnit}`,
      `Per second: ${formatMoney(
        perSecond,
        selectedCurrency.symbol,
        4
      )}`,
      `Per minute: ${formatMoney(
        perMinute,
        selectedCurrency.symbol,
        2
      )}`,
      `Per hour: ${formatMoney(
        perHour,
        selectedCurrency.symbol,
        2
      )}`,
      `Per day: ${formatMoney(
        perDay,
        selectedCurrency.symbol,
        2
      )}`,
      `Per week: ${formatMoney(
        perWeek,
        selectedCurrency.symbol,
        2
      )}`,
      `Per month: ${formatMoney(
        perMonth,
        selectedCurrency.symbol,
        2
      )}`,
      `Per year: ${formatMoney(
        yearlySalary,
        selectedCurrency.symbol,
        2
      )}`,
      "",
      `Earned in counter: ${formatMoney(
        liveEarned,
        selectedCurrency.symbol,
        2
      )}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);
      setMessage("");

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setMessage(
        "Copy is not available in this browser."
      );
    }
  };

  /*
   * Share tool.
   */
  const shareTool = async () => {
    const shareData = {
      title: "Live Salary Counter",
      text:
        "Calculate your estimated earnings per second, minute, hour, day, week, month and year.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setMessage("Tool link copied.");

        window.setTimeout(() => {
          setMessage("");
        }, 1800);
      }
    } catch {
      // Sharing cancelled by the user.
    }
  };

  const statItems = [
    {
      label: "Per second",
      value: formatMoney(
        perSecond,
        selectedCurrency.symbol,
        4
      ),
    },
    {
      label: "Per minute",
      value: formatMoney(
        perMinute,
        selectedCurrency.symbol,
        2
      ),
    },
    {
      label: "Per hour",
      value: formatMoney(
        perHour,
        selectedCurrency.symbol,
        2
      ),
    },
    {
      label: "Per day",
      value: formatMoney(
        perDay,
        selectedCurrency.symbol,
        2
      ),
    },
    {
      label: "Per week",
      value: formatMoney(
        perWeek,
        selectedCurrency.symbol,
        2
      ),
    },
    {
      label: "Per month",
      value: formatMoney(
        perMonth,
        selectedCurrency.symbol,
        2
      ),
    },
    {
      label: "Per year",
      value: formatMoney(
        yearlySalary,
        selectedCurrency.symbol,
        2
      ),
    },
  ];

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(180deg,#f8fafc 0%,#ffffff 45%,#f5f7fb 100%)",
      color: "#101828",
      fontFamily:
        "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      padding: "20px 14px 42px",
    },

    container: {
      width: "100%",
      maxWidth: "900px",
      margin: "0 auto",
    },

    topBrand: {
      textAlign: "center",
      fontSize: "10px",
      fontWeight: 900,
      letterSpacing: "0.8px",
      color: "#667085",
      marginBottom: "9px",
      textTransform: "uppercase",
    },

    header: {
      textAlign: "center",
      marginBottom: "15px",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#ffffff",
      border: "1px solid #e4e7ec",
      color: "#475467",
      fontSize: "9px",
      fontWeight: 900,
      letterSpacing: "0.4px",
      boxShadow:
        "0 4px 18px rgba(16,24,40,.04)",
    },

    badgeDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#16a34a",
      boxShadow:
        "0 0 0 4px rgba(22,163,74,.10)",
    },

    h1: {
      margin: "10px 0 0",
      fontSize: "clamp(26px,7vw,39px)",
      lineHeight: 1.05,
      letterSpacing: "-1.7px",
      fontWeight: 950,
      color: "#101828",
    },

    subtitle: {
      maxWidth: "600px",
      margin: "7px auto 0",
      fontSize: "12px",
      lineHeight: 1.55,
      color: "#667085",
    },

    hero: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "22px",
      background:
        "linear-gradient(135deg,#101828 0%,#182538 58%,#0f766e 145%)",
      color: "#fff",
      padding: "19px 16px 17px",
      boxShadow:
        "0 18px 55px rgba(16,24,40,.15)",
    },

    heroGlow: {
      position: "absolute",
      width: "220px",
      height: "220px",
      borderRadius: "50%",
      background:
        "rgba(81,225,208,.08)",
      right: "-100px",
      top: "-110px",
    },

    heroInner: {
      position: "relative",
      textAlign: "center",
    },

    liveBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      border:
        "1px solid rgba(255,255,255,.13)",
      background:
        "rgba(255,255,255,.08)",
      borderRadius: "999px",
      padding: "5px 10px",
      fontSize: "8px",
      fontWeight: 900,
      letterSpacing: "0.7px",
    },

    heroLabel: {
      marginTop: "12px",
      color: "#aab4c5",
      fontSize: "8px",
      fontWeight: 900,
      letterSpacing: "1px",
    },

    liveValue: {
      marginTop: "2px",
      color: "#51e1d0",
      fontSize:
        "clamp(34px,10vw,58px)",
      lineHeight: 1.05,
      fontWeight: 950,
      letterSpacing: "-2.5px",
      fontVariantNumeric: "tabular-nums",
    },

    rate: {
      marginTop: "4px",
      color: "#b8c2d3",
      fontSize: "10px",
    },

    heroStats: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginTop: "14px",
    },

    heroStat: {
      background:
        "rgba(255,255,255,.075)",
      border:
        "1px solid rgba(255,255,255,.08)",
      borderRadius: "12px",
      padding: "9px",
      textAlign: "left",
    },

    heroStatLabel: {
      color: "#aab4c5",
      fontSize: "7px",
      fontWeight: 900,
      letterSpacing: ".7px",
    },

    heroStatValue: {
      marginTop: "3px",
      color: "#fff",
      fontSize: "15px",
      fontWeight: 950,
    },

    actions: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "7px",
      marginTop: "13px",
    },

    primaryButton: {
      border: 0,
      borderRadius: "999px",
      padding: "9px 16px",
      background: "#51e1d0",
      color: "#061412",
      fontSize: "9px",
      fontWeight: 950,
      cursor: "pointer",
    },

    secondaryButton: {
      border:
        "1px solid rgba(255,255,255,.14)",
      borderRadius: "999px",
      padding: "8px 14px",
      background:
        "rgba(255,255,255,.07)",
      color: "#fff",
      fontSize: "9px",
      fontWeight: 900,
      cursor: "pointer",
    },

    card: {
      marginTop: "11px",
      background: "#fff",
      border: "1px solid #e6eaf0",
      borderRadius: "18px",
      padding: "15px",
      boxShadow:
        "0 7px 28px rgba(16,24,40,.04)",
    },

    cardTitle: {
      fontSize: "12px",
      fontWeight: 950,
      color: "#101828",
      marginBottom: "11px",
    },

    label: {
      display: "block",
      marginBottom: "5px",
      color: "#667085",
      fontSize: "8px",
      fontWeight: 900,
      letterSpacing: ".5px",
      textTransform: "uppercase",
    },

    salaryRow: {
      display: "grid",
      gridTemplateColumns:
        "minmax(0,1fr) 110px",
      gap: "7px",
    },

    input: {
      width: "100%",
      height: "43px",
      boxSizing: "border-box",
      border: "1px solid #dfe3e8",
      borderRadius: "10px",
      background: "#f8fafc",
      color: "#101828",
      padding: "0 12px",
      fontSize: "17px",
      fontWeight: 900,
      outline: "none",
    },

    select: {
      width: "100%",
      height: "43px",
      boxSizing: "border-box",
      border: "1px solid #dfe3e8",
      borderRadius: "10px",
      background: "#f8fafc",
      color: "#101828",
      padding: "0 8px",
      fontSize: "11px",
      fontWeight: 800,
      outline: "none",
    },

    currencyRow: {
      display: "flex",
      gap: "5px",
      overflowX: "auto",
      paddingBottom: "1px",
      scrollbarWidth: "none",
    },

    currencyButton: {
      flex: "0 0 auto",
      minWidth: "52px",
      height: "35px",
      borderRadius: "9px",
      fontSize: "9px",
      fontWeight: 900,
      cursor: "pointer",
    },

    settingsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginTop: "12px",
    },

    rangeValue: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "9px",
      color: "#667085",
      fontWeight: 800,
      marginBottom: "3px",
    },

    range: {
      width: "100%",
      accentColor: "#6b5ce7",
      cursor: "pointer",
    },

    earningsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "13px 1px 7px",
    },

    earningsTitle: {
      fontSize: "12px",
      fontWeight: 950,
    },

    earningsHint: {
      fontSize: "8px",
      color: "#98a2b3",
      fontWeight: 800,
    },

    earningsGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(145px,1fr))",
      gap: "7px",
    },

    earningCard: {
      background: "#fff",
      border: "1px solid #e7eaf0",
      borderRadius: "14px",
      padding: "11px",
      boxShadow:
        "0 4px 18px rgba(16,24,40,.03)",
    },

    earningLabel: {
      fontSize: "8px",
      color: "#98a2b3",
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: ".45px",
    },

    earningValue: {
      marginTop: "5px",
      fontSize: "16px",
      fontWeight: 950,
      color: "#101828",
      wordBreak: "break-word",
    },

    earningSub: {
      marginTop: "2px",
      fontSize: "8px",
      color: "#98a2b3",
    },

    info: {
      marginTop: "10px",
      padding: "11px 12px",
      borderRadius: "13px",
      border:
        "1px solid #c9f3ec",
      background: "#f0fdfa",
      color: "#475467",
      fontSize: "9px",
      lineHeight: 1.6,
    },

    message: {
      marginTop: "8px",
      textAlign: "center",
      color: "#b42318",
      fontSize: "9px",
      fontWeight: 800,
    },

    footer: {
      textAlign: "center",
      marginTop: "17px",
      color: "#98a2b3",
      fontSize: "8px",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBrand}>
          thenexoratools
        </div>

        <header style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            FREE • LIVE SALARY CALCULATOR
          </div>

          <h1 style={styles.h1}>
            Live Salary Counter
          </h1>

          <p style={styles.subtitle}>
            See your estimated earnings per second,
            minute, hour, day, week, month and year.
          </p>
        </header>

        <section
          style={styles.hero}
          aria-live="polite"
        >
          <div style={styles.heroGlow} />

          <div style={styles.heroInner}>
            <div style={styles.liveBadge}>
              <span
                style={{
                  color: "#51e1d0",
                }}
              >
                {started ? "●" : "○"}
              </span>

              {started
                ? "LIVE NOW"
                : baseEarned > 0
                ? "PAUSED"
                : "READY TO START"}
            </div>

            <div style={styles.heroLabel}>
              {started
                ? "EARNED THIS SESSION"
                : baseEarned > 0
                ? "EARNED THIS SESSION (PAUSED)"
                : "LIVE EARNINGS"}
            </div>

            <div style={styles.liveValue}>
              {formatMoney(
                liveEarned,
                selectedCurrency.symbol,
                2
              )}
            </div>

            <div style={styles.rate}>
              {hasValidSalary
                ? `+ ${formatMoney(
                    perSecond,
                    selectedCurrency.symbol,
                    4
                  )} per second`
                : "Enter your salary to calculate your live rate"}
            </div>

            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatLabel}>
                  PER HOUR
                </div>

                <div style={styles.heroStatValue}>
                  {formatMoney(
                    perHour,
                    selectedCurrency.symbol,
                    2
                  )}
                </div>
              </div>

              <div style={styles.heroStat}>
                <div style={styles.heroStatLabel}>
                  PER MONTH
                </div>

                <div style={styles.heroStatValue}>
                  {formatMoney(
                    perMonth,
                    selectedCurrency.symbol,
                    2
                  )}
                </div>
              </div>
            </div>

            <div style={styles.actions}>
              {!started ? (
                <button
                  type="button"
                  onClick={startCounter}
                  style={{
                    ...styles.primaryButton,
                    opacity:
                      canStart ? 1 : 0.55,
                    cursor:
                      canStart
                        ? "pointer"
                        : "not-allowed",
                  }}
                  disabled={!canStart}
                >
                  {baseEarned > 0
                    ? "▶ RESUME COUNTER"
                    : "▶ START COUNTER"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCounter}
                  style={styles.primaryButton}
                >
                  ■ STOP COUNTER
                </button>
              )}

              <button
                type="button"
                onClick={copySummary}
                style={{
                  ...styles.secondaryButton,
                  opacity:
                    hasValidSalary
                      ? 1
                      : 0.55,
                }}
                disabled={!hasValidSalary}
              >
                {copied
                  ? "✓ COPIED"
                  : "COPY RESULTS"}
              </button>

              <button
                type="button"
                onClick={shareTool}
                style={styles.secondaryButton}
              >
                SHARE
              </button>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardTitle}>
            Salary Details
          </div>

          <label
            style={styles.label}
            htmlFor="salary"
          >
            Salary amount
          </label>

          <div style={styles.salaryRow}>
            <input
              id="salary"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={amount}
              placeholder="Enter salary"
              onChange={(e) => {
                const value =
                  e.target.value;

                if (
                  value === "" ||
                  Number(value) >= 0
                ) {
                  setAmount(value);
                  setMessage("");
                }
              }}
              style={styles.input}
              aria-label="Salary amount"
            />

            <select
              value={salaryUnit}
              onChange={(e) =>
                setSalaryUnit(
                  e.target.value
                )
              }
              style={styles.select}
              aria-label="Salary period"
            >
              {UNITS.map((unit) => (
                <option
                  key={unit.id}
                  value={unit.id}
                >
                  Per{" "}
                  {unit.label.toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <label
            style={{
              ...styles.label,
              marginTop: "12px",
            }}
          >
            Currency
          </label>

          <div style={styles.currencyRow}>
            {CURRENCIES.map((item) => {
              const active =
                currency === item.code;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() =>
                    setCurrency(
                      item.code
                    )
                  }
                  aria-label={`Use ${item.name}`}
                  style={{
                    ...styles.currencyButton,
                    border: active
                      ? "1px solid #6b5ce7"
                      : "1px solid #e4e7ec",
                    background: active
                      ? "#f1efff"
                      : "#f8fafc",
                    color: active
                      ? "#604ff0"
                      : "#475467",
                  }}
                >
                  {item.symbol}{" "}
                  {item.code}
                </button>
              );
            })}
          </div>

          <div style={styles.settingsGrid}>
            <div>
              <div
                style={styles.rangeValue}
              >
                <span>
                  Hours per day
                </span>

                <b
                  style={{
                    color:
                      "#101828",
                  }}
                >
                  {hoursPerDay}h
                </b>
              </div>

              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={styles.range}
                aria-label="Hours worked per day"
              />
            </div>

            <div>
              <div
                style={styles.rangeValue}
              >
                <span>
                  Days per week
                </span>

                <b
                  style={{
                    color:
                      "#101828",
                  }}
                >
                  {daysPerWeek}d
                </b>
              </div>

              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={daysPerWeek}
                onChange={(e) =>
                  setDaysPerWeek(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={styles.range}
                aria-label="Working days per week"
              />
            </div>
          </div>

          {message && (
            <div
              role="alert"
              style={styles.message}
            >
              {message}
            </div>
          )}
        </section>

        <section>
          <div
            style={styles.earningsHeader}
          >
            <div
              style={
                styles.earningsTitle
              }
            >
              Earnings Breakdown
            </div>

            <div
              style={
                styles.earningsHint
              }
            >
              ESTIMATED RATE
            </div>
          </div>

          <div style={styles.earningsGrid}>
            {statItems.map((item) => (
              <div
                key={item.label}
                style={
                  styles.earningCard
                }
              >
                <div
                  style={
                    styles.earningLabel
                  }
                >
                  {item.label}
                </div>

                <div
                  style={
                    styles.earningValue
                  }
                >
                  {item.value}
                </div>

                <div
                  style={
                    styles.earningSub
                  }
                >
                  Based on your salary
                  and work schedule
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.info}>
          <b
            style={{
              color: "#101828",
            }}
          >
            How it works:
          </b>{" "}
          Your salary is converted to an
          annual amount using your selected
          pay period. The annual amount is
          then divided by your estimated
          working hours to calculate your
          hourly, minute and second rates.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            marginTop: "11px",
          }}
        >
          <button
            type="button"
            onClick={resetTool}
            style={{
              border:
                "1px solid #e4e7ec",
              background: "#fff",
              color: "#667085",
              borderRadius: "999px",
              padding: "7px 14px",
              fontSize: "8px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            RESET CALCULATOR
          </button>
        </div>

        <footer style={styles.footer}>
          Free • No registration • Works in
          your browser
        </footer>
      </div>
    </main>
  );
}
