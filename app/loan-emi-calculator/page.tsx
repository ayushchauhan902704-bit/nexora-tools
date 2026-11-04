"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [n, setN] = useState("");
  const [res, setRes] = useState<{ emi: number; total: number; interest: number } | null>(null);

  useEffect(() => {
    document.title = "Loan EMI Calculator - Home, Car, Personal Loan EMI | NEXORA";
  }, []);

  const calcEMI = () => {
    const P = parseFloat(p);
    const R = parseFloat(r) / 12 / 100;
    const N = parseFloat(n) * 12;
    if (!P || !R || !N) { alert("Fill all - Loan Amount, Rate, Tenure"); return; }
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const total = emi * N;
    const interest = total - P;
    setRes({ emi, total, interest });
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 26, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, marginBottom: 8, color: "#171725" };
  const pStyle: any = { fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 10 };
  const label: any = { fontWeight: 800, fontSize: 13, marginTop: 14, display: "block" };
  const input: any = { width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 6, background: "#fff", color: "#171725" };
  const btn: any = { width: "100%", padding: 14, background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 700, border: 0, borderRadius: 12, fontSize: 15, marginTop: 12, cursor: "pointer" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" }}>● BANK GRADE • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 13, color: "#6c5ce7", textDecoration: "none" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
        <div style={card}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 12, border: "1px solid #c8e6c9" }}>🏦 Bank Grade Accuracy • No Watermark</span>
          <h1 style={{ fontSize: 26, letterSpacing: -0.8, lineHeight: 1.2, fontWeight: 900 }}>Loan EMI Calculator</h1>
          <p style={{ color: "#676778", margin: "8px 0 4px", fontSize: 13 }}>Home Loan, Car Loan, Personal Loan • Monthly EMI, Total Interest, Total Payment in 1 sec — Private, Free.</p>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <div style={{ background: "#f9f9ff", border: "1px solid #efedff", borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center", fontSize: 12 }}><b style={{ display: "block", fontSize: 14, color: "#171725" }}>No Signup</b>100% Private</div>
            <div style={{ background: "#f9f9ff", border: "1px solid #efedff", borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center", fontSize: 12 }}><b style={{ display: "block", fontSize: 14, color: "#171725" }}>HD Accuracy</b>Bank Formula</div>
            <div style={{ background: "#f9f9ff", border: "1px solid #efedff", borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center", fontSize: 12 }}><b style={{ display: "block", fontSize: 14, color: "#171725" }}>Free Forever</b>No Watermark</div>
          </div>

          <label style={label}>Loan Amount (₹)</label>
          <input value={p} onChange={e => setP(e.target.value)} type="number" placeholder="500000" style={input} />
          <label style={label}>Interest Rate (% yearly)</label>
          <input value={r} onChange={e => setR(e.target.value)} type="number" placeholder="9.5" style={input} />
          <label style={label}>Tenure (Years)</label>
          <input value={n} onChange={e => setN(e.target.value)} type="number" placeholder="5" style={input} />
          <button onClick={calcEMI} style={btn}>Calculate EMI →</button>

          {res && (
            <div style={{ background: "linear-gradient(135deg,#f0efff,#e6e3ff)", border: "1px solid #d9d6ff", borderRadius: 14, padding: 18, marginTop: 14, fontWeight: 800, textAlign: "center", fontSize: 18 }}>
              EMI: ₹{Math.round(res.emi).toLocaleString("en-IN")} /month
              <br /><span style={{ fontWeight: 500, fontSize: 13, color: "#4a4a5a" }}>Total Payment: ₹{Math.round(res.total).toLocaleString("en-IN")} • Interest: ₹{Math.round(res.interest).toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>

        {/* BLUEPRINT - WHY */}
        <div style={card}>
          <h2 style={h2}>Why NEXORA Loan EMI Calculator?</h2>
          <p style={pStyle}>NEXORA Loan EMI Calculator uses bank formula EMI = P×R×(1+R)^N / ((1+R)^N−1). Works for Home Loan 20 years, Car Loan 5 years, Personal Loan 3 years. Shows EMI, total interest, total payment together. Unlike bank sites that ask phone number for spam calls, NEXORA calculates instantly without spam, no signup, 100% private — browser-based. Example: ₹5 Lakh, 9.5%, 5 years = EMI ₹10,448, Total Payment ₹6.26 Lakh, Interest ₹1.26 Lakh. Best for India — Home Loan SBI HDFC ICICI, Car Loan, Personal Loan planning.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "20px 0 8px", color: "#6c5ce7" }}>How to Calculate Loan EMI - 3 Easy Steps</h3>
          <p style={pStyle}><b>Step 1:</b> Enter Loan Amount — e.g. ₹5,00,000<br /><b>Step 2:</b> Enter Interest Rate yearly and Tenure years — e.g. 9.5% and 5 years<br /><b>Step 3:</b> Click Calculate — Instantly see EMI per month, total payment, total interest.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "20px 0 8px", color: "#6c5ce7" }}>Features</h3>
          <ul style={{ paddingLeft: 18, ...pStyle }}><li>✅ Bank Grade Formula — Exact EMI as Bank</li><li>✅ EMI + Total Interest + Total Payment Together</li><li>✅ No Phone Spam — No Signup, 100% Private</li><li>✅ Home Loan, Car Loan, Personal Loan — All</li><li>✅ Free Forever, No Watermark</li><li>✅ Works on iPhone, Android, Laptop</li></ul>
        </div>

        {/* BLUEPRINT - COMPARISON */}
        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Formula</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Bank Grade Exact ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Approximate</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Shows</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>EMI+Interest+Total ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only EMI</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Spam</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Phone Spam ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Calls Spam</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Lead Gen</td></tr>
          </tbody></table>
        </div>

        {/* BLUEPRINT - FAQ */}
        <div style={card}>
          <h2 style={h2}>FAQ - Loan EMI Calculator</h2>
          <p style={pStyle}>
            <b>Q: What is Loan EMI Calculator?</b><br />A: Calculates monthly EMI, total interest, total payment using bank formula.<br /><br />
            <b>Q: How to calculate loan EMI?</b><br />A: Enter loan amount, interest rate, years — Example 5 lakh 9.5% 5 years = EMI 10448.<br /><br />
            <b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, no phone needed.<br /><br />
            <b>Q: Loan EMI kaise calculate kare?</b><br />A: Loan amount, interest rate, saal daalo, Calculate dabao — EMI turant.<br /><br />
            <b>Try Also:</b> <a href="/jpg-to-pdf" style={{ color: "#6c5ce7", fontWeight: 700 }}>JPG to PDF</a> | <a href="/internet-speed-test" style={{ color: "#6c5ce7", fontWeight: 700 }}>Internet Speed Test</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12 }}><a href="/about" style={{ fontWeight: 600, color: "#171725" }}>About</a><a href="/contact" style={{ fontWeight: 600, color: "#171725" }}>Contact</a><a href="/privacy" style={{ fontWeight: 600, color: "#171725" }}>Privacy</a><a href="/terms" style={{ fontWeight: 600, color: "#171725" }}>Terms</a></div></div>
          <div style={{ textAlign: "right" }}><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳 • Bank Grade</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
