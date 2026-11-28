"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
type Result = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalYears: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  birthdayDate: Date;
  birthdayDays: number;
  birthdayToday: boolean;
};
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
const DAY = 24 * 60 * 60 * 1000;
function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function daysBetween(a: Date, b: Date) {
  const first = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const second = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((second.getTime() - first.getTime()) / DAY);
}
function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function birthdayForYear(year: number, month: number, day: number) {
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 1, 28);
  }
  return new Date(year, month, day);
}
function calculateCalendarAge(birth: Date, current: Date) {
  let years = current.getFullYear() - birth.getFullYear();
  let months = current.getMonth() - birth.getMonth();
  let days = current.getDate() - birth.getDate();
  if (days < 0) {
    months--;
    const previousMonthDays = new Date(
      current.getFullYear(),
      current.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}
function number(value: number) {
  return value.toLocaleString("en-US");
}
function dateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export default function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [asOf, setAsOf] = useState(todayString());
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const maxDate = useMemo(() => todayString(), []);

  // LIVE: Sirf jab As Of = Aaj hai, tabhi har 1 sec me tick karega
  const isLive = !!result && !!birth && asOf === todayString();

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [isLive]);

  // LIVE age - har second recalculate
  const liveResult = useMemo(() => {
    if (!result || !birth) return result;
    if (!isLive) return result;
    const birthDate = parseDate(birth);
    const current = now;
    const age = calculateCalendarAge(birthDate, current);
    const totalDays = daysBetween(birthDate, current);
    // Exact seconds - birth date ke start se ab tak
    const exactSeconds = Math.floor((current.getTime() - birthDate.getTime()) / 1000);
    const totalMinutes = Math.floor(exactSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    return {
      ...result,
      years: age.years,
      months: age.months,
      days: age.days,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      totalMonths: age.years * 12 + age.months,
      totalYears: totalDays / 365.2425,
      totalHours,
      totalMinutes,
      totalSeconds: exactSeconds,
    };
  }, [result, birth, isLive, now]);

  const display = liveResult || result;

  const calculate = () => {
    setError("");
    setResult(null);
    setCopied(false);
    if (!birth) {
      setError("Please enter your date of birth.");
      return;
    }
    if (!asOf) {
      setError("Please select a calculation date.");
      return;
    }
    const birthDate = parseDate(birth);
    const calculationDate = parseDate(asOf);
    if (
      Number.isNaN(birthDate.getTime()) ||
      Number.isNaN(calculationDate.getTime())
    ) {
      setError("Please enter valid dates.");
      return;
    }
    if (birthDate > calculationDate) {
      setError("Your date of birth cannot be later than the calculation date.");
      return;
    }
    const age = calculateCalendarAge(birthDate, calculationDate);
    const totalDays = daysBetween(birthDate, calculationDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = age.years * 12 + age.months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const totalYears = totalDays / 365.2425;
    let birthdayDate = birthdayForYear(
      calculationDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (birthdayDate < calculationDate) {
      birthdayDate = birthdayForYear(
        calculationDate.getFullYear() + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }
    const birthdayDays = daysBetween(calculationDate, birthdayDate);
    const finalResult: Result = {
      years: age.years,
      months: age.months,
      days: age.days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalYears,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthdayDate,
      birthdayDays,
      birthdayToday: birthdayDays === 0,
    };
    setResult(finalResult);
    setNow(new Date());
    if (window.gtag) {
      window.gtag("event", "age_calculation_completed", {
        tool_name: "age_calculator",
      });
    }
  };
  const reset = () => {
    setBirth("");
    setAsOf(todayString());
    setError("");
    setResult(null);
    setCopied(false);
  };
  const resultText = display
    ? [
        `Exact Age: ${display.years} years, ${display.months} months, ${display.days} days`,
        `Age in Years: ${display.totalYears.toFixed(2)}`,
        `Age in Months: ${number(display.totalMonths)}`,
        `Age in Weeks: ${number(display.totalWeeks)}`,
        `Age in Days: ${number(display.totalDays)}`,
        `Age in Hours: ${number(display.totalHours)}`,
        `Age in Minutes: ${number(display.totalMinutes)}`,
        `Age in Seconds: ${number(display.totalSeconds)}`,
        display.birthdayToday
          ? "Next Birthday: Today"
          : `Next Birthday: ${dateLabel(display.birthdayDate)} — ${display.birthdayDays} days remaining`,
      ].join("\n")
    : "";
  const copyResult = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      if (window.gtag) {
        window.gtag("event", "age_result_copied", { tool_name: "age_calculator" });
      }
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const shareResult = async () => {
    if (!resultText) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Age Calculator Result", text: resultText });
      } else {
        await navigator.clipboard.writeText(resultText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
      if (window.gtag) {
        window.gtag("event", "age_result_shared", { tool_name: "age_calculator" });
      }
    } catch {
      // User cancelled sharing.
    }
  };
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <a href="/" style={styles.logo}>
            NEX<span style={styles.pink}>ORA</span>
          </a>
          <a href="/" style={styles.back}>← All Tools</a>
        </div>
      </header>
      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.badge}>✦ FREE AGE CALCULATOR</div>
          <h1 style={styles.h1}>
            Calculate Your <span style={styles.pink}>Exact Age</span>
          </h1>
          <p style={styles.heroText}>
            Calculate your exact age in years, months, days, weeks, hours, minutes and seconds. Find your next birthday and countdown instantly.
          </p>
        </section>
        <section style={styles.tool}>
          <div style={styles.toolHead}>
            <div>
              <div style={styles.miniPink}>AGE CALCULATOR</div>
              <h2 style={styles.toolTitle}>Enter Your Dates</h2>
            </div>
            <div style={styles.private}>● Browser Based</div>
          </div>
          <div style={styles.inputs}>
            <div>
              <label htmlFor="birth" style={styles.label}>Date of Birth</label>
              <input id="birth" type="date" value={birth} max={maxDate} onChange={(e) => { setBirth(e.target.value); setError(""); }} style={styles.input} />
            </div>
            <div>
              <label htmlFor="asOf" style={styles.label}>Calculate Age As Of</label>
              <input id="asOf" type="date" value={asOf} onChange={(e) => { setAsOf(e.target.value); setError(""); }} style={styles.input} />
            </div>
          </div>
          {error && (
            <div style={styles.error}>
              <span>!</span>
              {error}
            </div>
          )}
          <div style={styles.buttons}>
            <button onClick={calculate} style={styles.calculate}>Calculate My Age →</button>
            <button onClick={reset} style={styles.reset}>Reset</button>
          </div>
          {display && (
            <div style={styles.result}>
              {isLive && (
                <div style={styles.liveBadge}>
                  <span style={styles.liveDot} /> LIVE • Your age is ticking every second
                </div>
              )}
              <div style={styles.exactBox}>
                <div>
                  <div style={styles.resultLabel}>YOUR EXACT AGE</div>
                  <div style={styles.exactAge}>
                    {display.years}<small> years</small> {display.months}<small> months</small> {display.days}<small> days</small>
                  </div>
                </div>
                <div style={styles.check}>✓</div>
              </div>
              <div style={styles.stats}>
                <Stat icon="◷" value={number(display.totalSeconds)} label="Age in Seconds" />
                <Stat icon="◴" value={number(display.totalMinutes)} label="Age in Minutes" />
                <Stat icon="◫" value={number(display.totalHours)} label="Age in Hours" />
                <Stat icon="◌" value={number(display.totalDays)} label="Age in Days" />
                <Stat icon="◍" value={number(display.totalWeeks)} label="Age in Weeks" />
                <Stat icon="○" value={number(display.totalMonths)} label="Age in Months" />
                <Stat icon="◎" value={display.totalYears.toFixed(2)} label="Age in Years" />
              </div>
              <div style={styles.birthday}>
                <div style={styles.cake}>🎂</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.birthdayLabel}>NEXT BIRTHDAY</div>
                  {display.birthdayToday ? (
                    <>
                      <div style={styles.birthdayTitle}>Happy Birthday! 🎉</div>
                      <div style={styles.birthdaySub}>Your birthday is today.</div>
                    </>
                  ) : (
                    <>
                      <div style={styles.birthdayTitle}>{dateLabel(display.birthdayDate)}</div>
                      <div style={styles.birthdaySub}>{display.birthdayDays === 1 ? "1 day remaining" : `${number(display.birthdayDays)} days remaining`}</div>
                    </>
                  )}
                </div>
                <div style={styles.days}>{display.birthdayToday ? "TODAY" : `${display.birthdayDays} DAYS`}</div>
              </div>
              <div style={styles.resultButtons}>
                <button onClick={copyResult} style={styles.resultButton}>{copied ? "✓ Copied" : "Copy Result"}</button>
                <button onClick={shareResult} style={styles.resultButton}>Share Result</button>
              </div>
            </div>
          )}
        </section>
        <section style={styles.benefits}>
          <Info icon="⚡" title="Instant" text="Get your complete age breakdown immediately." />
          <Info icon="🎯" title="Accurate" text="Calendar-based calculation with leap-year support." />
          <Info icon="🔒" title="Private" text="Your date is processed directly in your browser." />
        </section>
        <section style={styles.content}>
          <div style={styles.contentTag}>AGE CALCULATOR GUIDE</div>
          <h2 style={styles.contentTitle}>What Is an Age Calculator?</h2>
          <p style={styles.text}>An age calculator determines your exact age between a date of birth and a selected calculation date. Instead of showing only the number of years, this calculator provides a complete breakdown in years, months and days, along with total days, weeks, hours, minutes and seconds.</p>
          <p style={styles.text}>It can be useful for birthdays, school and college forms, job applications, personal records, age verification, date planning and everyday curiosity.</p>
          <h3 style={styles.heading}>How to Calculate Your Age</h3>
          <div style={styles.steps}>
            <Step n="01" title="Enter your date of birth" text="Select your exact birth date." />
            <Step n="02" title="Choose the calculation date" text="Use today's date or select another date." />
            <Step n="03" title="Calculate your age" text="Instantly view your complete age breakdown." />
          </div>
          <h3 style={styles.heading}>What Does the Calculator Show?</h3>
          <div style={styles.features}>
            <Feature text="Exact age in years, months and days" />
            <Feature text="Age in seconds" />
            <Feature text="Age in minutes" />
            <Feature text="Age in hours" />
            <Feature text="Age in days" />
            <Feature text="Age in weeks" />
            <Feature text="Age in months" />
            <Feature text="Age in decimal years" />
            <Feature text="Next birthday date" />
            <Feature text="Days remaining until your birthday" />
          </div>
          <h3 style={styles.heading}>Is the Calculation Accurate?</h3>
          <p style={styles.text}>Yes. The main age result uses calendar years, months and days. Different month lengths and leap years are taken into account rather than assuming that every year contains exactly 365 days.</p>
          <h3 style={styles.heading}>Is My Date of Birth Stored?</h3>
          <p style={styles.text}>This calculator performs its calculation directly in your browser. Your date of birth is not intentionally uploaded to a server by this tool.</p>
        </section>
        <section style={styles.content}>
          <div style={styles.contentTag}>FREQUENTLY ASKED QUESTIONS</div>
          <h2 style={styles.contentTitle}>Age Calculator FAQ</h2>
          <Faq q="How do I calculate my exact age?" a="Enter your date of birth, choose the calculation date, and select Calculate My Age. Your exact age will appear in years, months and days." />
          <Faq q="Can I calculate my age on another date?" a="Yes. You can select a past or future calculation date to determine your age on that specific date." />
          <Faq q="Can I see my age in seconds?" a="Yes. The calculator shows your total age in seconds, minutes, hours, days, weeks, months and years." />
          <Faq q="Does it support leap years?" a="Yes. The calendar calculation accounts for leap years and different month lengths." />
          <Faq q="Does it work on mobile?" a="Yes. It is designed for modern mobile and desktop browsers, including iPhone, Android, Chrome, Safari, Firefox and Edge." />
          <Faq q="Do I need an account?" a="No. You can use the calculator without registration or an account." />
        </section>
        <section style={styles.related}>
          <div style={styles.contentTag}>MORE FREE TOOLS</div>
          <h2 style={styles.relatedTitle}>Explore More Calculators</h2>
          <div style={styles.links}>
            <a href="/bmi-calculator" style={styles.link}>BMI Calculator →</a>
            <a href="/percentage-calculator" style={styles.link}>Percentage Calculator →</a>
            <a href="/discount-calculator" style={styles.link}>Discount Calculator →</a>
            <a href="/loan-emi-calculator" style={styles.link}>Loan EMI Calculator →</a>
            <a href="/" style={styles.link}>All Tools →</a>
          </div>
        </section>
      </main>
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={styles.footerLogo}>NEX<span style={styles.pink}>ORA</span></div>
            <p style={styles.footerText}>Free online tools designed to be simple, fast and useful.</p>
            <p style={styles.footerText}>Built by Ayush Chauhan · India</p>
          </div>
          <div style={styles.footerLinks}>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>
        <div style={styles.copyright}>© 2026 NEXORA Tools. All rights reserved.</div>
      </footer>
    </div>
  );
}
function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}
function Info({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div style={styles.info}>
      <div style={styles.infoIcon}>{icon}</div>
      <div>
        <div style={styles.infoTitle}>{title}</div>
        <div style={styles.infoText}>{text}</div>
      </div>
    </div>
  );
}
function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepNumber}>{n}</div>
      <div>
        <div style={styles.stepTitle}>{title}</div>
        <div style={styles.stepText}>{text}</div>
      </div>
    </div>
  );
}
function Feature({ text }: { text: string }) {
  return (
    <div style={styles.feature}>
      <span>✓</span>
      {text}
    </div>
  );
}
function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details style={styles.faq}>
      <summary style={styles.question}>
        <span>{q}</span>
        <span style={styles.plus}>+</span>
      </summary>
      <p style={styles.answer}>{a}</p>
    </details>
  );
}
const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(180deg,#ffffff 0%,#fcf9fb 50%,#ffffff 100%)", color: "#18151a", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif' },
  header: { position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.94)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid #eee9ee" },
  headerInner: { width: "min(calc(100% - 28px),980px)", height: 58, margin: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { textDecoration: "none", color: "#18151a", fontSize: 20, fontWeight: 950, letterSpacing: "-1px" },
  pink: { color: "#e94f87" },
  back: { textDecoration: "none", color: "#746d76", fontSize: 11, fontWeight: 800 },
  main: { width: "min(calc(100% - 28px),980px)", margin: "auto", paddingBottom: 40 },
  hero: { textAlign: "center", padding: "31px 0 19px" },
  badge: { display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: "#fff0f6", border: "1px solid #ffd7e6", color: "#d83f76", fontSize: 8.5, fontWeight: 950, letterSpacing: ".8px" },
  h1: { margin: "10px 0 7px", fontSize: "clamp(29px,7vw,47px)", lineHeight: 1.03, letterSpacing: "-1.7px", fontWeight: 950 },
  heroText: { maxWidth: 600, margin: "auto", color: "#777079", fontSize: 12, lineHeight: 1.65 },
  tool: { background: "#fff", border: "1px solid #eee9ee", borderRadius: 22, padding: 19, boxShadow: "0 15px 48px rgba(35,20,32,.07)" },
  toolHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 16 },
  miniPink: { color: "#e94f87", fontSize: 8, fontWeight: 950, letterSpacing: 1 },
  toolTitle: { margin: "2px 0 0", fontSize: 18, fontWeight: 950, letterSpacing: "-.4px" },
  private: { padding: "6px 9px", borderRadius: 999, background: "#faf8fa", border: "1px solid #eee9ee", color: "#777079", fontSize: 8.5, fontWeight: 800, whiteSpace: "nowrap" },
  inputs: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 11 },
  label: { display: "block", marginBottom: 5, color: "#4e4850", fontSize: 10, fontWeight: 850 },
  input: { width: "100%", height: 45, boxSizing: "border-box", border: "1px solid #e1dce3", borderRadius: 11, background: "#fff", color: "#18151a", padding: "0 11px", fontSize: 12, fontWeight: 650, outline: "none" },
  error: { marginTop: 11, padding: "9px 11px", borderRadius: 10, background: "#fff2f2", border: "1px solid #ffdada", color: "#bf3e3e", fontSize: 10, fontWeight: 750 },
  buttons: { display: "flex", gap: 8, marginTop: 13 },
  calculate: { flex: 1, height: 45, border: 0, borderRadius: 11, background: "linear-gradient(135deg,#ed568c,#d93e76)", color: "#fff", fontSize: 11, fontWeight: 950, cursor: "pointer", boxShadow: "0 8px 20px rgba(233,79,135,.22)" },
  reset: { height: 45, padding: "0 17px", border: "1px solid #e8e2e8", borderRadius: 11, background: "#faf9fb", color: "#5f5861", fontSize: 10, fontWeight: 850, cursor: "pointer" },
  result: { marginTop: 17, paddingTop: 17, borderTop: "1px solid #eee9ee" },
  liveBadge: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "7px 10px", borderRadius: 999, background: "#eafff3", border: "1px solid #b8f0cd", color: "#0a7a3d", fontSize: 9, fontWeight: 850 },
  liveDot: { width: 8, height: 8, borderRadius: "50%", background: "#16c05a", display: "inline-block" } as CSSProperties,
  exactBox: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 14, borderRadius: 15, background: "linear-gradient(135deg,#fff2f7,#fffafd)", border: "1px solid #f6d9e5" },
  resultLabel: { color: "#d93e76", fontSize: 8, fontWeight: 950, letterSpacing: 1, marginBottom: 3 },
  exactAge: { color: "#211c21", fontSize: "clamp(20px,5vw,28px)", lineHeight: 1.15, fontWeight: 950, letterSpacing: "-.7px" },
  check: { width: 31, height: 31, flexShrink: 0, borderRadius: "50%", background: "#e94f87", color: "#fff", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 950 },
  stats: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 7, marginTop: 9 },
  stat: { minWidth: 0, padding: "10px 7px", border: "1px solid #eee9ee", borderRadius: 12, textAlign: "center", background: "#fff" },
  statIcon: { color: "#e94f87", fontSize: 11, height: 15 },
  statValue: { color: "#252027", fontSize: "clamp(11px,3vw,16px)", fontWeight: 950, lineHeight: 1.2, wordBreak: "break-word" },
  statLabel: { color: "#817a82", fontSize: 8, fontWeight: 750, lineHeight: 1.25, marginTop: 3 },
  birthday: { display: "flex", alignItems: "center", gap: 10, marginTop: 9, padding: 12, borderRadius: 14, background: "#fff0f6", border: "1px solid #ffd8e7" },
  cake: { width: 33, height: 33, flexShrink: 0, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", fontSize: 16 },
  birthdayLabel: { color: "#d93e76", fontSize: 7.5, fontWeight: 950, letterSpacing: ".9px" },
  birthdayTitle: { color: "#211c21", fontSize: 12, fontWeight: 950, marginTop: 1 },
  birthdaySub: { color: "#756e76", fontSize: 9, marginTop: 1 },
  days: { marginLeft: "auto", whiteSpace: "nowrap", padding: "6px 8px", borderRadius: 999, background: "#fff", border: "1px solid #ffd5e5", color: "#d93e76", fontSize: 7.5, fontWeight: 950 },
  resultButtons: { display: "flex", gap: 7, marginTop: 8 },
  resultButton: { flex: 1, height: 37, border: "1px solid #e8e2e8", borderRadius: 10, background: "#fff", color: "#514a53", fontSize: 9.5, fontWeight: 850, cursor: "pointer" },
  benefits: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 9, marginTop: 11 },
  info: { display: "flex", gap: 8, padding: 12, background: "#fff", border: "1px solid #eee9ee", borderRadius: 14 },
  infoIcon: { width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: "#fff0f6", display: "grid", placeItems: "center", fontSize: 12 },
  infoTitle: { fontSize: 10, fontWeight: 900 },
  infoText: { color: "#817a82", fontSize: 8.5, lineHeight: 1.4, marginTop: 2 },
  content: { marginTop: 11, padding: 18, background: "#fff", border: "1px solid #eee9ee", borderRadius: 17 },
  contentTag: { color: "#e94f87", fontSize: 7.8, fontWeight: 950, letterSpacing: 1, marginBottom: 4 },
  contentTitle: { margin: 0, fontSize: 17, fontWeight: 950, letterSpacing: "-.3px" },
  text: { color: "#6e676f", fontSize: 10, lineHeight: 1.7, margin: "8px 0 0" },
  heading: { margin: "18px 0 7px", fontSize: 12.5, fontWeight: 950 },
  steps: { display: "grid", gap: 7 },
  step: { display: "flex", gap: 9, padding: 10, borderRadius: 10, background: "#faf9fb", border: "1px solid #f0ebf0" },
  stepNumber: { color: "#e94f87", fontSize: 8.5, fontWeight: 950 },
  stepTitle: { fontSize: 10, fontWeight: 900 },
  stepText: { color: "#817982", fontSize: 9, marginTop: 1 },
  features: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 6 },
  feature: { display: "flex", gap: 6, color: "#5e575f", fontSize: 9 },
  faq: { padding: "11px 0", borderBottom: "1px solid #f0ebf0" },
  question: { display: "flex", justifyContent: "space-between", gap: 10, cursor: "pointer", color: "#292329", fontSize: 10, fontWeight: 850, listStyle: "none" },
  plus: { color: "#e94f87", fontSize: 15 },
  answer: { color: "#756e76", fontSize: 9.2, lineHeight: 1.6, margin: "6px 0 0" },
  related: { marginTop: 11, padding: 17, borderRadius: 17, border: "1px solid #f3dce6", background: "linear-gradient(135deg,#fff3f7,#fff)" },
  relatedTitle: { margin: 0, fontSize: 16, fontWeight: 950 },
  links: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 },
  link: { textDecoration: "none", padding: "7px 9px", borderRadius: 999, background: "#fff", border: "1px solid #efdfe7", color: "#c63d70", fontSize: 8.5, fontWeight: 850 },
  footer: { marginTop: 16, borderTop: "1px solid #eee9ee", background: "#fff", padding: "24px 0 14px" },
  footerInner: { width: "min(calc(100% - 28px),980px)", margin: "auto", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  footerLogo: { fontSize: 17, fontWeight: 950, letterSpacing: "-.7px" },
  footerText: { color: "#817a82", fontSize: 8.5, margin: "5px 0 0" },
  footerLinks: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start" },
  copyright: { width: "min(calc(100% - 28px),980px)", margin: "16px auto 0", paddingTop: 11, borderTop: "1px solid #f0ebf0", color: "#aaa3aa", fontSize: 8 },
};
