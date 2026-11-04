"use client";
import { useState } from "react";

export default function Page() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [result, setResult] = useState<{ bmi: string; cat: string; low: string; high: string } | null>(null);

  const calcBMI = () => {
    const heightM = parseFloat(h) / 100;
    const weight = parseFloat(w);
    if (!heightM || !weight) { alert("Enter height weight"); return; }
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    const cat = Number(bmi) < 18.5 ? "Underweight" : Number(bmi) < 24.9 ? "Healthy" : Number(bmi) < 30 ? "Overweight" : "Obese";
    const low = (18.5 * heightM * heightM).toFixed(1);
    const high = (24.9 * heightM * heightM).toFixed(1);
    setResult({ bmi, cat, low, high });
  };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" }}>● 89K+ USERS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, color: "#6c5ce7", fontSize: 13, textDecoration: "none" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
        <div style={{ fontSize: 13, color: "#777", margin: "14px 0" }}><a href="/" style={{ textDecoration: "none", color: "#777" }}>Home</a> / BMI Calculator</div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10, border: "1px solid #c8e6c9" }}>🔒 Private – 100% in browser • Free</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.5px" }}>BMI Calculator - Body Mass Index</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Calculate your BMI and check your ideal weight range instantly — 100% Private, Free.</p>
          <label style={{ fontSize: 13, fontWeight: 800 }}>Height (cm)</label>
          <input value={h} onChange={(e) => setH(e.target.value)} type="number" placeholder="170" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <label style={{ display: "block", marginTop: 10, fontSize: 13, fontWeight: 800 }}>Weight (kg)</label>
          <input value={w} onChange={(e) => setW(e.target.value)} type="number" placeholder="65" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <button onClick={calcBMI} style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, background: "#6c5ce7", color: "white", fontWeight: 700, borderWidth: 0, cursor: "pointer", marginTop: 12 }}>Calculate BMI →</button>
          {result && (
            <div style={{ background: "#f0efff", borderRadius: 12, padding: 16, marginTop: 14, fontWeight: 700, textAlign: "center", fontSize: 18 }}>
              BMI: {result.bmi} – {result.cat}<br /><small style={{ fontSize: 13 }}>Ideal Weight: {result.low}kg - {result.high}kg</small>
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>What is BMI Calculator? Why NEXORA No.1?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Unlike other BMI calculators with ads, popups and data tracking, NEXORA BMI Calculator is 100% free forever, no ads, 100% private — your height weight never leaves your phone, browser-based. BMI (Body Mass Index) tells if your weight is healthy for your height. Formula <b>BMI = Weight(kg) / Height(m)²</b>. For 170cm, 65kg, BMI is 22.5 healthy range. Unlike calculator.net, NEXORA gives instant BMI, category, ideal weight range 53.5kg-72kg for 170cm, no ads. Made in India, trusted by 89k+ users, works on iPhone, Android, Laptop. Best alternative to calculator.net, health calculator, WHO BMI. Fast in 1 sec.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>How to Use BMI Calculator - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}><b>Step 1:</b> Enter height in centimeters — e.g. 170<br /><b>Step 2:</b> Enter weight in kilograms — e.g. 65<br /><b>Step 3:</b> Click Calculate — see BMI value, health category, ideal weight range instantly.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>BMI Chart - Healthy Range (WHO)</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Below 18.5 Underweight, 18.5-24.9 Healthy, 25-29.9 Overweight, 30+ Obese. Same for adult men women. Children use age percentiles. For information only, not medical advice. Consult doctor for health advice.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Features - Why World Loves NEXORA</h3>
          <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><li>✅ 100% Free, No Ads, No Tracking</li><li>✅ 100% Private — Data never leaves phone, browser-based</li><li>✅ Instant BMI + Category + Ideal Weight Range</li><li>✅ Works in KG CM, Accurate WHO Formula</li><li>✅ Works on iPhone, Android, Laptop</li><li>✅ Fast 1 Sec, Made in India, 89k+ Users</li></ul>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Limit</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Unlimited ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Ads Limit</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Tracks Data</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Ads</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900 }}>FAQ - BMI Calculator - Google Loves This</h2>
          <details style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>What is ideal BMI range?</summary><p style={{ fontSize: 12.5, color: "#555", marginTop: 6 }}>18.5 to 24.9 is considered healthy for adults. Below 18.5 Underweight, 25-29.9 Overweight, 30+ Obese.</p></details>
          <details style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How to calculate ideal weight?</summary><p style={{ fontSize: 12.5, color: "#555", marginTop: 6 }}>Ideal Weight = 18.5 to 24.9 * height(m)². For 170cm, ideal weight 53.5kg to 72kg.</p></details>
          <details style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is BMI same for men and women?</summary><p style={{ fontSize: 12.5, color: "#555", marginTop: 6 }}>Formula is same for both. Health interpretation may vary slightly.</p></details>
          <details style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my data private?</summary><p style={{ fontSize: 12.5, color: "#555", marginTop: 6 }}>Yes, 100% private, browser-based, your data never leaves phone.</p></details>
          <details style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is this medical advice?</summary><p style={{ fontSize: 12.5, color: "#555", marginTop: 6 }}>No, for information only. Consult your doctor for health advice.</p></details>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900 }}>Related Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <a href="/age-calculator" style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🎂 Age Calculator</a>
            <a href="/unit-converter" style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🔄 Unit Converter</a>
            <a href="/jpg-to-pdf" style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>📄 JPG to PDF</a>
            <a href="/loan-emi-calculator" style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🏦 Loan EMI</a>
            <a href="/" style={{ background: "#6c5ce7", color: "white", textAlign: "center", padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: "none", gridColumn: "span 2" }}>← All Tools</a>
          </div>
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
            <div>© 2026 NEXORA Tools - BMI Calculator</div>
            <div>Made in India 🇮🇳 | 89k+ Users | Trusted by Users</div>
            <div style={{ marginTop: 8 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
