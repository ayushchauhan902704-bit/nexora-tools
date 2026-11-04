"use client";
import { useState } from "react";

export default function AgeCalculator() {
  const todayStr = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  };
  const [birth, setBirth] = useState("");
  const [asOf, setAsOf] = useState(todayStr());
  const [error, setError] = useState("");
  const [res, setRes] = useState<{ y: number; m: number; d: number; days: number; weeks: number; hours: number; msg: string; nextDate: string } | null>(null);

  const calculate = () => {
    setError(""); setRes(null);
    if (!birth) { setError("Please enter your Date of Birth"); return; }
    const b = new Date(birth + "T00:00:00");
    const c = new Date(asOf + "T00:00:00");
    if (b > c) { setError("Date of Birth cannot be after calculation date"); return; }
    let y = c.getFullYear() - b.getFullYear();
    let m = c.getMonth() - b.getMonth();
    let d = c.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(c.getFullYear(), c.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((c.getTime() - b.getTime()) / 86400000);
    let nb = new Date(c.getFullYear(), b.getMonth(), b.getDate());
    if (nb < c) nb = new Date(c.getFullYear() + 1, b.getMonth(), b.getDate());
    const diff = Math.ceil((nb.getTime() - c.getTime()) / 86400000);
    const msg = diff === 0 ? "Happy Birthday Today!" : `Next birthday ${nb.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — ${diff} days to go`;
    setRes({ y, m, d, days, weeks: Math.floor(days / 7), hours: days * 24, msg, nextDate: nb.toLocaleDateString() });
  };

  const reset = () => { setBirth(""); setAsOf(todayStr()); setRes(null); setError(""); };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif", background: "#f7f8fc", color: "#171725", minHeight: "100vh", lineHeight: 1.5 }}>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "min(100% - 32px, 900px)", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1 }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ padding: "6px 12px", borderRadius: 999, background: "#eeecff", color: "#5b4bd8", fontSize: 11, fontWeight: 800 }}>● 89K+ USERS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 13, color: "#6c5ce7" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main>
        <section style={{ textAlign: "center", padding: "30px 0 18px" }}>
          <div style={{ width: "min(100% - 32px, 900px)", margin: "auto" }}>
            <span style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "#eeecff", color: "#5b4bd8", fontSize: 11, fontWeight: 800 }}>🧮 CALCULATOR • NO WATERMARK • HD • FREE • PRIVATE</span>
            <h1 style={{ fontSize: "clamp(30px,6vw,48px)", lineHeight: 1.05, letterSpacing: -1.5, fontWeight: 900, marginTop: 10 }}>Age <span style={{ color: "#6c5ce7" }}>Calculator</span></h1>
            <p style={{ maxWidth: 650, margin: "10px auto 0", color: "#676778", fontSize: 13 }}>Calculate exact age from DOB in years, months, days. Total days lived, weeks, hours, next birthday countdown — 100% Private, No Watermark, Made in India.</p>
          </div>
        </section>

        <section><div style={{ width: "min(100% - 32px, 900px)", margin: "auto" }}>
          <div style={{ background: "white", border: "1px solid #e5e5ed", borderRadius: 24, padding: 26, boxShadow: "0 18px 50px rgba(30,30,70,0.08)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 14 }}>Enter Your Details</h2>
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>Date of Birth</label><input type="date" value={birth} max={todayStr()} onChange={e => setBirth(e.target.value)} style={{ width: "100%", height: 52, border: "1px solid #dcdce7", borderRadius: 13, padding: "0 14px", outline: "none" }} /></div>
            <div style={{ marginBottom: 14 }}><label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>Calculate Age As Of</label><input type="date" value={asOf} onChange={e => setAsOf(e.target.value)} style={{ width: "100%", height: 52, border: "1px solid #dcdce7", borderRadius: 13, padding: "0 14px", outline: "none" }} /></div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={calculate} style={{ height: 52, border: 0, borderRadius: 13, cursor: "pointer", fontWeight: 800, flex: 1, background: "#6c5ce7", color: "white" }}>Calculate Age</button>
              <button onClick={reset} style={{ height: 52, border: 0, borderRadius: 13, cursor: "pointer", fontWeight: 800, flex: 1, background: "#f0efff", color: "#5b4bd8" }}>Reset</button>
            </div>
            {error && <div style={{ marginTop: 12, padding: 10, background: "#fff0f0", color: "#c0392b", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{error}</div>}
            {res && <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Your Exact Age</div>
              <div style={{ background: "#f0efff", borderRadius: 18, padding: 20, textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 900, color: "#5b4bd8" }}>{res.y} years, {res.m} months, {res.d} days</div><div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Years • Months • Days</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
                <div style={{ border: "1px solid #e7e7ef", borderRadius: 14, padding: 14, textAlign: "center" }}><strong style={{ color: "#5b4bd8", fontSize: 18, display: "block" }}>{res.days.toLocaleString()}</strong><span style={{ fontSize: 11, color: "#777" }}>Total Days</span></div>
                <div style={{ border: "1px solid #e7e7ef", borderRadius: 14, padding: 14, textAlign: "center" }}><strong style={{ color: "#5b4bd8", fontSize: 18, display: "block" }}>{res.weeks.toLocaleString()}</strong><span style={{ fontSize: 11, color: "#777" }}>Total Weeks</span></div>
                <div style={{ border: "1px solid #e7e7ef", borderRadius: 14, padding: 14, textAlign: "center" }}><strong style={{ color: "#5b4bd8", fontSize: 18, display: "block" }}>{res.hours.toLocaleString()}</strong><span style={{ fontSize: 11, color: "#777" }}>Total Hours</span></div>
              </div>
              <div style={{ marginTop: 12, padding: 12, background: "#faf9ff", border: "1px solid #e8e6fa", borderRadius: 12, fontSize: 12 }}>🎂 {res.msg}</div>
            </div>}
          </div>

          <div style={{ background: "white", border: "1px solid #e5e5ed", borderRadius: 20, padding: 22, marginTop: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900 }}>Why NEXORA No.1 Age Calculator in the World?</h2>
            <p style={{ fontSize: 12.5, color: "#444", lineHeight: 1.7, marginTop: 8 }}>Unlike calculator.net and timeanddate.com with heavy ads and limits, NEXORA Age Calculator is 100% free forever, no watermark, HD result, 100% private — your DOB never leaves your device, browser-based processing, no upload to server. Calculates exact age in years, months, days with total days lived, weeks, hours and next birthday countdown. Best for school admission, job forms, government documents, Aadhaar, PAN, passport, birthday planning. Unlike other tools showing only years, NEXORA shows precise months and days including leap years. Made in India, trusted by 89K+ users worldwide, works on iPhone, Android, Laptop. Best alternative to age calculator by calculator.net, timeanddate, agecalculator.com. Fast in 1 second.</p>
            <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px" }}>How to Use Age Calculator - 3 Easy Steps</h3>
            <p style={{ fontSize: 12.5, color: "#444", lineHeight: 1.7 }}><b>Step 1:</b> Select your Date of Birth from calendar<br /><b>Step 2:</b> Select calculation date (default is today)<br /><b>Step 3:</b> Click Calculate Age — instantly see years, months, days, total days lived, weeks, hours and next birthday.</p>
            <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px" }}>Features - Why the World Loves NEXORA</h3>
            <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#444", lineHeight: 1.7 }}><li>✅ Exact Age in Years, Months, Days - Leap Year Accurate</li><li>✅ Total Days, Weeks, Hours Lived + Next Birthday Countdown</li><li>✅ 100% Private - DOB never leaves device, No server upload</li><li>✅ No Watermark, HD Quality, Free Forever, No Limits</li><li>✅ Works on iPhone, Android, Laptop - No App Needed</li><li>✅ Fast in 1 Second, Made in India, Trusted by 89K+ Users Worldwide</li></ul>
          </div>

          <div style={{ background: "white", border: "1px solid #e5e5ed", borderRadius: 20, padding: 22, marginTop: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900 }}>NEXORA vs Other Age Calculators - Comparison</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
              <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
              <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Exact Age</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Years + Months + Days ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only Years</td></tr>
              <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
              <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Ads</td></tr>
              <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Ads + Limit</td></tr>
              <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Speed</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>1 Second ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Slow</td></tr>
            </tbody></table>
          </div>

          <div style={{ background: "white", border: "1px solid #e5e5ed", borderRadius: 20, padding: 22, marginTop: 18, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900 }}>FAQ - Age Calculator</h2>
            <p style={{ fontSize: 12.5, color: "#444", lineHeight: 1.7, marginTop: 8 }}><b>Q: Is Age Calculator free and private?</b><br />A: Yes, 100% free, no watermark, 100% private. Your DOB never leaves your device, browser-based.<br /><br /><b>Q: Is it accurate with leap years?</b><br />A: Yes, precise calculation including leap years, total days, weeks, hours.<br /><br /><b>Q: Can I use it on iPhone?</b><br />A: Yes, works perfectly on iPhone, Android, Laptop. No app needed.<br /><br /><b>Q: Does my DOB go to server?</b><br />A: No, 100% browser processing. Your data never leaves your device.<br /><br /><b>Q: What does it calculate?</b><br />A: Exact age in years, months, days, total days lived, total weeks, total hours and next birthday countdown.</p>
            <p style={{ marginTop: 12, fontSize: 12.5 }}>Try Also: <a href="/bmi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>BMI Calculator</a> | <a href="/date-difference" style={{ color: "#6c5ce7", fontWeight: 700 }}>Date Difference</a> | <a href="/loan-emi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/pdf-merge-split" style={{ color: "#6c5ce7", fontWeight: 700 }}>PDF Merge Split</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
          </div>
        </div></section>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", background: "white", padding: "32px 0", color: "#747486", fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ width: "min(100% - 32px, 900px)", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 25 }}>
          <div><div style={{ fontWeight: 900, fontSize: 18, color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 10, color: "#44445a" }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
          <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclaimer">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></div><div>© 2026 NEXORA Tools - Age Calculator</div><div>Made in India 🇮🇳 | 89K+ Users | Free tools. Simple solutions.</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← All Tools</a></div></div>
        </div>
      </footer>
    </div>
  );
}
