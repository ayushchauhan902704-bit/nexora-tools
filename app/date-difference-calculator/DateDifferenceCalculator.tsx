"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type WeekdayKey =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type Result = {
  start: Date;
  end: Date;
  totalDays: number;
  totalWeeks: number;
  calendarYears: number;
  calendarMonths: number;
  remainingDays: number;
  weekdays: Record<WeekdayKey, number>;
};

const WEEKDAYS: WeekdayKey[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const COLORS = {
  pink: "#ec4899",
  pinkDark: "#db2777",
  pinkSoft: "#fdf2f8",
  pinkBorder: "#f9a8d4",
  purple: "#8b5cf6",
  text: "#18181b",
  muted: "#71717a",
  border: "#e4e4e7",
  bg: "#fafafa",
  white: "#ffffff",
  green: "#16a34a",
  greenSoft: "#f0fdf4",
  red: "#dc2626",
  redSoft: "#fef2f2",
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateToInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function diffCalendar(
  start: Date,
  end: Date
): {
  years: number;
  months: number;
  days: number;
} {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonthLastDay = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    ).getDate();
    days += previousMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function getInclusiveWeekdayCounts(
  start: Date,
  end: Date
): Record<WeekdayKey, number> {
  const counts: Record<WeekdayKey, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  while (current <= end) {
    const weekday = WEEKDAYS[current.getDay()];
    counts[weekday] += 1;
    current.setDate(current.getDate() + 1);
  }
  return counts;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function plural(
  value: number,
  singular: string,
  pluralWord?: string
) {
  return `${formatNumber(value)} ${
    value === 1 ? singular : pluralWord || `${singular}s`
  }`;
}

function trackEvent(name: string) {
  try {
    const gtag = (
      window as Window & {
        gtag?: (
          command: string,
          eventName: string,
          params?: Record<string, unknown>
        ) => void;
      }
    ).gtag;
    if (gtag) {
      gtag("event", name, {
        tool: "date_difference_calculator",
      });
    }
  } catch {
    // Analytics must never break the calculator.
  }
}

export default function DateDifferenceCalculator() {
  const today = useMemo(() => new Date(), []);

  const [d1, setD1] = useState(dateToInputValue(today));
  const [d2, setD2] = useState(
    dateToInputValue(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 30
      )
    )
  );

  const [includeStart, setIncludeStart] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    setError("");
    setCopied(false);

    const first = parseInputDate(d1);
    const second = parseInputDate(d2);

    if (!first || !second) {
      setError("Please select both dates before calculating.");
      return;
    }

    let start = first;
    let end = second;

    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    const totalMilliseconds =
      end.getTime() - start.getTime();

    const exclusiveDays = Math.round(
      totalMilliseconds / 86400000
    );

    const totalDays = includeStart
      ? exclusiveDays + 1
      : exclusiveDays;

    const calendar = diffCalendar(start, end);

    const weekdayEnd = new Date(end);

    if (!includeStart) {
      const weekdayStart = new Date(start);
      weekdayStart.setDate(weekdayStart.getDate() + 1);

      const counts =
        weekdayStart <= weekdayEnd
          ? getInclusiveWeekdayCounts(
              weekdayStart,
              weekdayEnd
            )
          : {
              Sunday: 0,
              Monday: 0,
              Tuesday: 0,
              Wednesday: 0,
              Thursday: 0,
              Friday: 0,
              Saturday: 0,
            };

      setResult({
        start,
        end,
        totalDays,
        totalWeeks: Math.floor(totalDays / 7),
        calendarYears: calendar.years,
        calendarMonths: calendar.months,
        remainingDays: calendar.days,
        weekdays: counts,
      });

      trackEvent("date_difference_calculated");

      return;
    }

    const weekdays = getInclusiveWeekdayCounts(
      start,
      weekdayEnd
    );

    setResult({
      start,
      end,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      calendarYears: calendar.years,
      calendarMonths: calendar.months,
      remainingDays: calendar.days,
      weekdays,
    });

    trackEvent("date_difference_calculated");
  };

  const reset = () => {
    setD1(dateToInputValue(today));

    setD2(
      dateToInputValue(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 30
        )
      )
    );

    setIncludeStart(true);
    setResult(null);
    setError("");
    setCopied(false);

    trackEvent("date_difference_reset");
  };

  const swapDates = () => {
    const oldD1 = d1;
    setD1(d2);
    setD2(oldD1);
    setResult(null);
    setError("");
    setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;

    const text = `
Date Difference Result

From: ${formatDate(result.start)}
To: ${formatDate(result.end)}

Total Days: ${formatNumber(result.totalDays)}
Total Weeks: ${formatNumber(result.totalWeeks)}

Calendar Difference:
${plural(result.calendarYears, "year")}
${plural(result.calendarMonths, "month")}
${plural(result.remainingDays, "day")}

Weekday Breakdown:
Sunday: ${formatNumber(result.weekdays.Sunday)}
Monday: ${formatNumber(result.weekdays.Monday)}
Tuesday: ${formatNumber(result.weekdays.Tuesday)}
Wednesday: ${formatNumber(result.weekdays.Wednesday)}
Thursday: ${formatNumber(result.weekdays.Thursday)}
Friday: ${formatNumber(result.weekdays.Friday)}
Saturday: ${formatNumber(result.weekdays.Saturday)}

Calculated with NEXORA Date Difference Calculator.
`.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      trackEvent("date_difference_copy");

      setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      setError(
        "Copy was not available in this browser. Please select and copy the result manually."
      );
    }
  };

  const shareResult = async () => {
    if (!result) return;

    const shareText = `Date difference: ${formatNumber(
      result.totalDays
    )} days between ${formatDate(result.start)} and ${formatDate(
      result.end
    )}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Date Difference Calculator",
          text: shareText,
          url: window.location.href,
        });

        trackEvent("date_difference_share");
      } else {
        await navigator.clipboard.writeText(
          `${shareText} ${window.location.href}`
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2200);
      }
    } catch {
      // User cancelled share.
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top, #fff7fb 0%, #fafafa 36%, #f7f7f8 100%)",
      color: COLORS.text,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Arial, sans-serif',
    },

    header: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "rgba(255,255,255,.88)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      borderBottom: `1px solid ${COLORS.border}`,
    },

    headerInner: {
      width: "min(980px, calc(100% - 28px))",
      margin: "0 auto",
      minHeight: 62,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
    },

    logo: {
      textDecoration: "none",
      fontWeight: 950,
      fontSize: 21,
      letterSpacing: "-1px",
      color: COLORS.text,
    },

    topLink: {
      textDecoration: "none",
      color: COLORS.pinkDark,
      fontSize: 12,
      fontWeight: 800,
    },

    container: {
      width: "min(980px, calc(100% - 28px))",
      margin: "0 auto",
      padding: "28px 0 60px",
    },

    hero: {
      textAlign: "center",
      maxWidth: 720,
      margin: "0 auto 22px",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "6px 11px",
      borderRadius: 999,
      background: COLORS.pinkSoft,
      color: COLORS.pinkDark,
      border: `1px solid ${COLORS.pinkBorder}`,
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: ".2px",
    },

    h1: {
      fontSize: "clamp(27px, 6vw, 43px)",
      lineHeight: 1.05,
      letterSpacing: "-1.7px",
      margin: "13px 0 9px",
      fontWeight: 950,
    },

    heroText: {
      color: COLORS.muted,
      fontSize: 13,
      lineHeight: 1.7,
      margin: 0,
    },

    card: {
      background: "rgba(255,255,255,.96)",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 20,
      boxShadow:
        "0 12px 40px rgba(24,24,27,.055)",
    },

    calculator: {
      padding: "clamp(16px, 4vw, 25px)",
      maxWidth: 760,
      margin: "0 auto",
    },

    dateGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 13,
    },

    label: {
      display: "block",
      fontSize: 11,
      fontWeight: 900,
      marginBottom: 6,
      color: "#3f3f46",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 13px",
      borderRadius: 12,
      border: `1px solid ${COLORS.border}`,
      background: "#fff",
      color: COLORS.text,
      fontSize: 14,
      fontWeight: 650,
      outline: "none",
    },

    actionRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 9,
      marginTop: 14,
    },

    primaryButton: {
      flex: "1 1 240px",
      border: 0,
      borderRadius: 12,
      padding: "13px 15px",
      background:
        "linear-gradient(135deg, #ec4899 0%, #db2777 55%, #c026d3 100%)",
      color: "#fff",
      fontSize: 13,
      fontWeight: 900,
      cursor: "pointer",
      boxShadow:
        "0 8px 22px rgba(236,72,153,.22)",
    },

    secondaryButton: {
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: "12px 14px",
      background: "#fff",
      color: "#3f3f46",
      fontSize: 12,
      fontWeight: 850,
      cursor: "pointer",
    },

    optionBox: {
      marginTop: 13,
      padding: "11px 12px",
      borderRadius: 12,
      background: "#fafafa",
      border: `1px solid ${COLORS.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    checkbox: {
      width: 16,
      height: 16,
      accentColor: COLORS.pink,
    },

    optionText: {
      fontSize: 11,
      lineHeight: 1.45,
      color: "#52525b",
      fontWeight: 650,
    },

    error: {
      marginTop: 12,
      padding: "10px 12px",
      borderRadius: 11,
      background: COLORS.redSoft,
      border: "1px solid #fecaca",
      color: COLORS.red,
      fontSize: 11.5,
      fontWeight: 750,
    },

    resultCard: {
      marginTop: 16,
      padding: "clamp(15px, 4vw, 22px)",
      borderRadius: 17,
      background:
        "linear-gradient(145deg, #fff 0%, #fff8fc 100%)",
      border: `1px solid ${COLORS.pinkBorder}`,
    },

    resultTop: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 14,
    },

    resultTitle: {
      margin: 0,
      fontSize: 15,
      fontWeight: 950,
      letterSpacing: "-.3px",
    },

    resultDate: {
      color: COLORS.muted,
      fontSize: 10.5,
      fontWeight: 700,
    },

    mainResult: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(125px, 1fr))",
      gap: 8,
    },

    stat: {
      padding: "13px 10px",
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 13,
      textAlign: "center",
    },

    statNumber: {
      display: "block",
      fontSize: 20,
      fontWeight: 950,
      letterSpacing: "-.7px",
      color: COLORS.pinkDark,
    },

    statLabel: {
      display: "block",
      marginTop: 2,
      color: COLORS.muted,
      fontSize: 9.5,
      fontWeight: 800,
    },

    calendarBox: {
      marginTop: 12,
      padding: 14,
      borderRadius: 14,
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
    },

    sectionTitle: {
      margin: "0 0 9px",
      fontSize: 11.5,
      fontWeight: 950,
      color: "#27272a",
    },

    calendarText: {
      fontSize: 13,
      fontWeight: 900,
      color: "#3f3f46",
      lineHeight: 1.8,
    },

    weekdayGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(115px, 1fr))",
      gap: 7,
      marginTop: 8,
    },

    weekdayItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: "8px 9px",
      borderRadius: 10,
      background: "#fafafa",
      border: `1px solid ${COLORS.border}`,
      fontSize: 10.5,
      fontWeight: 800,
    },

    weekdayCount: {
      color: COLORS.pinkDark,
      fontWeight: 950,
      fontSize: 12,
    },

    resultActions: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },

    contentSection: {
      maxWidth: 760,
      margin: "18px auto 0",
      padding: "clamp(17px, 4vw, 24px)",
    },

    h2: {
      fontSize: 17,
      lineHeight: 1.25,
      letterSpacing: "-.4px",
      margin: "0 0 8px",
      fontWeight: 950,
    },

    h3: {
      fontSize: 12.5,
      margin: "17px 0 6px",
      fontWeight: 950,
      color: COLORS.pinkDark,
    },

    paragraph: {
      margin: 0,
      color: "#52525b",
      fontSize: 12,
      lineHeight: 1.75,
    },

    list: {
      margin: "7px 0 0",
      paddingLeft: 19,
      color: "#52525b",
      fontSize: 12,
      lineHeight: 1.8,
    },

    faqItem: {
      padding: "11px 0",
      borderBottom: `1px solid ${COLORS.border}`,
    },

    faqQuestion: {
      margin: 0,
      fontSize: 11.5,
      fontWeight: 950,
      color: "#27272a",
    },

    faqAnswer: {
      margin: "5px 0 0",
      color: COLORS.muted,
      fontSize: 11.5,
      lineHeight: 1.65,
    },

    footer: {
      marginTop: 28,
      borderTop: `1px solid ${COLORS.border}`,
      background: "#fff",
      padding: "25px 0",
    },

    footerInner: {
      width: "min(980px, calc(100% - 28px))",
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 20,
      color: COLORS.muted,
      fontSize: 10.5,
      lineHeight: 1.8,
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <a href="/" style={styles.logo}>
            NEX<span style={{ color: COLORS.pink }}>ORA</span>
          </a>

          <a href="/" style={styles.topLink}>
            ← All Tools
          </a>
        </div>
      </header>

      <main style={styles.container}>
        <section style={styles.hero}>
          <span style={styles.badge}>
            ✦ FREE DATE CALCULATOR
          </span>

          <h1 style={styles.h1}>
            Date Difference Calculator
          </h1>

          <p style={styles.heroText}>
            Calculate the exact difference between two dates in
            days, weeks, years, months and days — with a complete
            Sunday-to-Saturday breakdown.
          </p>
        </section>

        <section
          style={{
            ...styles.card,
            ...styles.calculator,
          }}
        >
          <div style={styles.dateGrid}>
            <div>
              <label htmlFor="from-date" style={styles.label}>
                From Date
              </label>

              <input
                id="from-date"
                type="date"
                value={d1}
                onChange={(e) => {
                  setD1(e.target.value);
                  setError("");
                }}
                style={styles.input}
                aria-label="From date"
              />
            </div>

            <div>
              <label htmlFor="to-date" style={styles.label}>
                To Date
              </label>

              <input
                id="to-date"
                type="date"
                value={d2}
                onChange={(e) => {
                  setD2(e.target.value);
                  setError("");
                }}
                style={styles.input}
                aria-label="To date"
              />
            </div>
          </div>

          <div style={styles.optionBox}>
            <label
              htmlFor="include-start"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                cursor: "pointer",
              }}
            >
              <input
                id="include-start"
                type="checkbox"
                checked={includeStart}
                onChange={(e) =>
                  setIncludeStart(e.target.checked)
                }
                style={styles.checkbox}
              />

              <span style={styles.optionText}>
                Include the start date in weekday counting
              </span>
            </label>

            <span
              style={{
                fontSize: 9,
                color: COLORS.pinkDark,
                fontWeight: 900,
              }}
            >
              RECOMMENDED
            </span>
          </div>

          {error && (
            <div role="alert" style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <div style={styles.actionRow}>
            <button
              type="button"
              onClick={calculate}
              style={styles.primaryButton}
            >
              Calculate Difference →
            </button>

            <button
              type="button"
              onClick={swapDates}
              style={styles.secondaryButton}
            >
              ⇄ Swap
            </button>

            <button
              type="button"
              onClick={reset}
              style={styles.secondaryButton}
            >
              ↻ Reset
            </button>
          </div>

          {result && (
            <div
              style={styles.resultCard}
              aria-live="polite"
            >
              <div style={styles.resultTop}>
                <div>
                  <h2 style={styles.resultTitle}>
                    Date Difference Result
                  </h2>

                  <div style={styles.resultDate}>
                    {formatDate(result.start)} →{" "}
                    {formatDate(result.end)}
                  </div>
                </div>

                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: 999,
                    background: COLORS.greenSoft,
                    color: COLORS.green,
                    fontSize: 9,
                    fontWeight: 900,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  CALCULATED
                </span>
              </div>

              <div style={styles.mainResult}>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {formatNumber(result.totalDays)}
                  </span>

                  <span style={styles.statLabel}>
                    Total Days
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {formatNumber(result.totalWeeks)}
                  </span>

                  <span style={styles.statLabel}>
                    Complete Weeks
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {formatNumber(result.calendarYears)}
                  </span>

                  <span style={styles.statLabel}>
                    Calendar Years
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {formatNumber(result.calendarMonths)}
                  </span>

                  <span style={styles.statLabel}>
                    Remaining Months
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statNumber}>
                    {formatNumber(result.remainingDays)}
                  </span>

                  <span style={styles.statLabel}>
                    Remaining Days
                  </span>
                </div>
              </div>

              <div style={styles.calendarBox}>
                <h3 style={styles.sectionTitle}>
                  Exact Calendar Difference
                </h3>

                <div style={styles.calendarText}>
                  {plural(
                    result.calendarYears,
                    "year"
                  )}{" "}
                  {plural(
                    result.calendarMonths,
                    "month"
                  )}{" "}
                  {plural(
                    result.remainingDays,
                    "day"
                  )}
                </div>
              </div>

              <div style={styles.calendarBox}>
                <h3 style={styles.sectionTitle}>
                  Weekday Breakdown
                </h3>

                <div style={styles.weekdayGrid}>
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      style={styles.weekdayItem}
                    >
                      <span>{day}</span>

                      <span style={styles.weekdayCount}>
                        {formatNumber(
                          result.weekdays[day]
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.resultActions}>
                <button
                  type="button"
                  onClick={copyResult}
                  style={styles.secondaryButton}
                >
                  {copied ? "✓ Copied" : "Copy Result"}
                </button>

                <button
                  type="button"
                  onClick={shareResult}
                  style={styles.secondaryButton}
                >
                  ↗ Share
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          style={{
            ...styles.card,
            ...styles.contentSection,
          }}
        >
          <h2 style={styles.h2}>
            What Is a Date Difference Calculator?
          </h2>

          <p style={styles.paragraph}>
            A Date Difference Calculator finds the amount of
            time between two calendar dates. NEXORA calculates
            the total number of days and complete weeks while
            also showing the calendar difference in years,
            months and remaining days.
          </p>

          <p
            style={{
              ...styles.paragraph,
              marginTop: 8,
            }}
          >
            The result also includes a separate count for every
            weekday — Sunday, Monday, Tuesday, Wednesday,
            Thursday, Friday and Saturday — so you can understand
            exactly how the selected date range is distributed
            across the week.
          </p>

          <h3 style={styles.h3}>
            How to Calculate the Difference Between Two Dates
          </h3>

          <ol style={styles.list}>
            <li>Select your starting date.</li>
            <li>Select your ending date.</li>
            <li>Choose whether the start date should be included.</li>
            <li>Press Calculate Difference.</li>
            <li>Review the complete result and weekday breakdown.</li>
          </ol>

          <h3 style={styles.h3}>
            What Does the Result Show?
          </h3>

          <ul style={styles.list}>
            <li>Total number of days in the selected range.</li>
            <li>Complete weeks contained in the range.</li>
            <li>Calendar years, months and remaining days.</li>
            <li>Number of Sundays.</li>
            <li>Number of Mondays.</li>
            <li>Number of Tuesdays.</li>
            <li>Number of Wednesdays.</li>
            <li>Number of Thursdays.</li>
            <li>Number of Fridays.</li>
            <li>Number of Saturdays.</li>
          </ul>

          <h3 style={styles.h3}>
            Common Uses
          </h3>

          <p style={styles.paragraph}>
            You can use a date difference calculator for project
            durations, employment periods, notice periods,
            subscription periods, event planning, exam dates,
            travel planning, anniversaries, deadlines and
            general calendar calculations.
          </p>

          <h3 style={styles.h3}>
            Calendar Difference vs Total Days
          </h3>

          <p style={styles.paragraph}>
            A calendar difference such as “2 years, 3 months and
            5 days” is different from simply dividing total days
            by an average number of days in a month. This
            calculator keeps the calendar structure of the dates
            when presenting years, months and remaining days,
            while the total-days result gives the exact elapsed
            day count.
          </p>

          <h3 style={styles.h3}>
            Privacy and Compatibility
          </h3>

          <p style={styles.paragraph}>
            The date calculation is performed directly in your
            browser. No account is required to use the
            calculator. The tool is designed for modern Chrome,
            Safari, Firefox and Edge browsers on phones, tablets
            and desktop computers.
          </p>
        </section>

        <section
          style={{
            ...styles.card,
            ...styles.contentSection,
          }}
        >
          <h2 style={styles.h2}>
            Frequently Asked Questions
          </h2>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              How many days are between two dates?
            </p>

            <p style={styles.faqAnswer}>
              Select the two dates and calculate the result.
              NEXORA displays the total number of days directly.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              Does it count every weekday?
            </p>

            <p style={styles.faqAnswer}>
              Yes. The result separately counts Sunday, Monday,
              Tuesday, Wednesday, Thursday, Friday and Saturday.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              Can I calculate years, months and days?
            </p>

            <p style={styles.faqAnswer}>
              Yes. The calculator provides a calendar-based
              years, months and remaining days breakdown.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              Does the start date count?
            </p>

            <p style={styles.faqAnswer}>
              You can choose whether to include the start date
              when counting weekdays.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              Is registration required?
            </p>

            <p style={styles.faqAnswer}>
              No. The calculator can be used without creating
              an account.
            </p>
          </div>

          <div style={styles.faqItem}>
            <p style={styles.faqQuestion}>
              Does it work on iPhone and Android?
            </p>

            <p style={styles.faqAnswer}>
              Yes. The interface is responsive and designed for
              mobile and desktop browsers.
            </p>
          </div>
        </section>

        <section
          style={{
            ...styles.card,
            ...styles.contentSection,
          }}
        >
          <h2 style={styles.h2}>
            Related NEXORA Tools
          </h2>

          <p style={styles.paragraph}>
            Continue with another useful calculator:
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
            }}
          >
            <a
              href="/age-calculator"
              style={{
                textDecoration: "none",
                padding: "9px 12px",
                borderRadius: 10,
                background: COLORS.pinkSoft,
                color: COLORS.pinkDark,
                border: `1px solid ${COLORS.pinkBorder}`,
                fontSize: 10.5,
                fontWeight: 900,
              }}
            >
              Age Calculator →
            </a>

            <a
              href="/percentage-calculator"
              style={{
                textDecoration: "none",
                padding: "9px 12px",
                borderRadius: 10,
                background: "#f5f3ff",
                color: "#7c3aed",
                border: "1px solid #ddd6fe",
                fontSize: 10.5,
                fontWeight: 900,
              }}
            >
              Percentage Calculator →
            </a>

            <a
              href="/unit-converter"
              style={{
                textDecoration: "none",
                padding: "9px 12px",
                borderRadius: 10,
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                fontSize: 10.5,
                fontWeight: 900,
              }}
            >
              Unit Converter →
            </a>

            <a
              href="/"
              style={{
                textDecoration: "none",
                padding: "9px 12px",
                borderRadius: 10,
                background: "#fafafa",
                color: "#52525b",
                border: `1px solid ${COLORS.border}`,
                fontSize: 10.5,
                fontWeight: 900,
              }}
            >
              All Tools →
            </a>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <strong
              style={{
                color: COLORS.text,
                fontSize: 13,
              }}
            >
              NEXORA
            </strong>

            <div>
              Free online tools designed to be simple,
              fast and useful.
            </div>

            <div style={{ marginTop: 5 }}>
              © 2026 NEXORA Tools
            </div>
          </div>

          <div>
            <div>
              <a
                href="/about"
                style={{
                  color: COLORS.muted,
                  textDecoration: "none",
                  marginRight: 12,
                }}
              >
                About
              </a>

              <a
                href="/contact"
                style={{
                  color: COLORS.muted,
                  textDecoration: "none",
                  marginRight: 12,
                }}
              >
                Contact
              </a>

              <a
                href="/privacy"
                style={{
                  color: COLORS.muted,
                  textDecoration: "none",
                  marginRight: 12,
                }}
              >
                Privacy
              </a>

              <a
                href="/terms"
                style={{
                  color: COLORS.muted,
                  textDecoration: "none",
                  marginRight: 12,
                }}
              >
                Terms
              </a>

              <a
                href="/disclaimer"
                style={{
                  color: COLORS.muted,
                  textDecoration: "none",
                }}
              >
                Disclaimer
              </a>
            </div>

            <div style={{ marginTop: 5 }}>
              Built for mobile and desktop browsers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
