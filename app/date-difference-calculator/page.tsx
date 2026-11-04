"use client";
import { useState } from "react";

export default function Page() {
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [res, setRes] = useState<{ days: number; weeks: number; months: number; years: number } | null>(null);

  const calcDiff = () => {
    if (!d1 || !d2) { alert("Select both dates"); return; }
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diff = Math.abs(date2.getTime() - date1.getTime());
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    const weeks = Math.floor(days / 7);
    setRes({ days, weeks, months, years });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" }}>● 68K+ USERS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, color: "#6c5ce7", fontSize: 13, textDecoration: "none" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10, border: "1px solid #c8e6c9" }}>🔒 Private – 100% Accurate • No Signup • Free</span>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.5px" }}>Date Difference Calculator - Days Between Dates</h1>
          <p style={{ color: "#676778", margin: "8px 0 14px", fontSize: 13 }}>Best Date Calculator - Find Days, Months, Years, Weeks Between Two Dates Instantly — Private, Free.</p>
          <label style={{ fontWeight: 800, fontSize: 13 }}>From Date</label>
          <input value={d1} onChange={(e) => setD1(e.target.value)} type="date" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <label style={{ display: "block", marginTop: 12, fontWeight: 800, fontSize: 13 }}>To Date</label>
          <input value={d2} onChange={(e) => setD2(e.target.value)} type="date" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <button onClick={calcDiff} style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, background: "#6c5ce7", color: "white", fontWeight: 700, borderWidth: 0, marginTop: 12, cursor: "pointer" }}>Calculate Days Between Dates →</button>
          {res && (
            <div style={{ background: "#f0efff", borderRadius: 12, padding: 16, marginTop: 14, fontWeight: 700, textAlign: "center", fontSize: 18 }}>
              {res.days} Days <br /><span style={{ fontWeight: 400, fontSize: 13 }}>~ {res.weeks} Weeks | ~ {res.months} Months | ~ {res.years} Years</span>
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>Why NEXORA No.1 Date Difference Calculator in World?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Unlike timeanddate.com, calculator.net with ads and only days, NEXORA Date Difference Calculator is 100% free forever, no ads, 100% private — browser-based, no data leaves phone. Calculates days between dates, months, years, weeks together — not just days. Example: 1 Jan 2020 to 1 Jan 2026 = 2192 days, 72 months, 6 years. Unlike other tools, shows exact breakdown ~days/30.44 months, ~days/365.25 years, weeks. Uses: Age Difference Calculator (age gap), Project Duration, Event Countdown for exam birthday, HR Service duration, Notice Period, Legal. Works for any date 1900-2100. Made in India, trusted by 68k+ users worldwide, works on iPhone, Android, Laptop. Best alternative to timeanddate, calculator.net, days calculator. Fast in 1 second.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>How to Calculate Days Between Dates - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}><b>Step 1:</b> Select From Date — start date using picker<br /><b>Step 2:</b> Select To Date — end date<br /><b>Step 3:</b> Click Calculate — instantly see total days, ~weeks, ~months, ~years between dates.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Use Cases of Date Difference Calculator</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}><b>1. Age Difference:</b> Age gap between two people<br /><b>2. Project Duration:</b> How many days project took<br /><b>3. Exam Countdown:</b> Days remaining for exam, birthday<br /><b>4. HR/Legal:</b> Service duration, notice period, experience calculation.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Features - Why World Loves NEXORA</h3>
          <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><li>✅ Days, Months, Years, Weeks Together — Not Just Days</li><li>✅ 100% Private — No data leaves phone, browser-based</li><li>✅ Free Forever, No Signup</li><li>✅ Any Date Range 1900-2100, Accurate Leap Year</li><li>✅ Works on iPhone, Android, Laptop</li><li>✅ Fast 1 Sec, Made in India, 68k+ Users</li></ul>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Shows</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Days+Months+Years+Weeks ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only Days</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Tracks</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Heavy Ads</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>FAQ - Date Difference - Google Loves This</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><b>Q: What is Date Difference Calculator?</b><br />A: Calculates days, months, years between two dates.<br /><br /><b>Q: How to calculate days between dates?</b><br />A: Select From and To Date, click Calculate — shows total days, weeks, months, years.<br /><br /><b>Q: Can it calculate age difference?</b><br />A: Yes, works as age difference calculator.<br /><br /><b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, browser-based.</p>
          <p style={{ marginTop: 12, fontSize: 12.5 }}>Try Also: <a href="/age-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Age Calculator</a> | <a href="/bmi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>BMI Calculator</a> | <a href="/unit-converter" style={{ color: "#6c5ce7", fontWeight: 700 }}>Unit Converter</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "30px 0", background: "white", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <b style={{ color: "#171725", fontSize: 16 }}>NEXORA — Built by Ayush Chauhan</b><br />
            <div style={{ marginTop: 10, lineHeight: 1.9 }}>
              📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />
              📱 Phone: <a href="tel:+919389641559" style={{ color: "#6c5ce7", fontWeight: 700 }}>+91 9389641559</a><br />
              📍 Dehradun, Uttarakhand, India<br />
              🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
              <a href="/about" style={{ textDecoration: "none" }}>About</a><a href="/contact" style={{ textDecoration: "none" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none" }}>Disclaimer</a><a href="/sitemap.xml" style={{ textDecoration: "none" }}>Sitemap</a>
            </div>
          </div>
          <div>
            <div>© 2026 NEXORA Tools - Date Difference Calculator</div>
            <div>Made in India 🇮🇳 | 68k+ Users | Free tools. Simple solutions.</div>
            <div style={{ marginTop: 8 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
