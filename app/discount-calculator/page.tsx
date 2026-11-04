"use client";
import { useState } from "react";

export default function Page() {
  const [price, setPrice] = useState("");
  const [disc, setDisc] = useState("");
  const [res, setRes] = useState<{ final: number; save: number } | null>(null);

  const calcDisc = () => {
    const p = parseFloat(price);
    const d = parseFloat(disc);
    if (!p || isNaN(d)) { alert("Enter price and discount"); return; }
    const save = (p * d) / 100;
    const final = p - save;
    setRes({ final, save });
  };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" }}>● 71K+ USERS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, color: "#6c5ce7", fontSize: 13, textDecoration: "none" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10, border: "1px solid #c8e6c9" }}>🛒 Shopping Sale - 100% Free & Accurate • No Signup</span>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.5px" }}>Discount Calculator - Final Price & Savings</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Best Discount Calculator - Calculate Final Price After Discount, You Save Amount, Sale Price — Private, Free.</p>
          <label style={{ fontWeight: 800, fontSize: 13 }}>Original Price (₹)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="1000" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <label style={{ display: "block", marginTop: 12, fontWeight: 800, fontSize: 13 }}>Discount (%)</label>
          <input value={disc} onChange={(e) => setDisc(e.target.value)} type="number" placeholder="20" style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, marginTop: 4 }} />
          <button onClick={calcDisc} style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, background: "#6c5ce7", color: "white", fontWeight: 700, borderWidth: 0, marginTop: 12, cursor: "pointer" }}>Calculate Final Price →</button>
          {res && (
            <div style={{ background: "#f0efff", borderRadius: 12, padding: 16, marginTop: 14, fontWeight: 700, textAlign: "center", fontSize: 18 }}>
              Final Price: ₹{res.final.toFixed(2)}<br /><span style={{ fontWeight: 400, fontSize: 13 }}>You Save: ₹{res.save.toFixed(2)} ({disc}% off)</span>
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>Why NEXORA No.1 Discount Calculator in World?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Unlike other calculators with ads and only final price, NEXORA Discount Calculator is 100% free forever, 100% private — browser-based, no data leaves phone. Calculates final price after discount and savings amount together — Formula: Savings = Original × Discount%/100, Final = Original − Savings. Example: Original ₹1000, 20% off = Savings ₹200, Final ₹800. Unlike calculator.net, NEXORA shows both savings and final price instantly, no ads, clean. Best for shopping — Big Billion Days, Great Indian Festival, sale season where shops show MRP and % off but not final quickly. Made in India, trusted by 71k+ shoppers worldwide, works on iPhone, Android, Laptop. Best alternative to calculator.net discount calculator. Fast in 1 sec.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>How to Calculate Discount - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}><b>Step 1:</b> Enter original price — MRP or listed price e.g. ₹1000<br /><b>Step 2:</b> Enter discount % — Offer % like 10%, 20%, 50% off<br /><b>Step 3:</b> Click Calculate — Get Savings amount and Final Price after discount instantly.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Why Use Discount Calculator for Shopping?</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>During sale, shops show MRP and % off but not final price quickly. Our calculator helps instantly find final price and how much you save — no mental math.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Features - Why World Loves NEXORA</h3>
          <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><li>✅ Final Price + Savings Together — Not Just One</li><li>✅ 100% Private — No data leaves phone, browser-based</li><li>✅ Free Forever, No Signup, No Ads</li><li>✅ Formula Accurate — Savings = Original×%/100</li><li>✅ Works on iPhone, Android, Laptop</li><li>✅ Fast 1 Sec, Made in India, 71k+ Shoppers</li></ul>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Shows</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Final + Savings ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only Final</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Tracks</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Heavy Ads</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>FAQ - Discount Calculator - Google Loves This</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><b>Q: What is Discount Calculator?</b><br />A: Calculates final price after discount and savings. Savings = Original×%/100, Final = Original−Savings.<br /><br /><b>Q: How to calculate discount?</b><br />A: Enter original 1000 and discount 20% — Savings 200, Final 800.<br /><br /><b>Q: How to find original price from discount?</b><br />A: Original = Final / (1 − Discount%/100).<br /><br /><b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, browser-based.</p>
          <p style={{ marginTop: 12, fontSize: 12.5 }}>Try Also: <a href="/percentage-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Percentage Calculator</a> | <a href="/loan-emi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/age-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Age Calculator</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
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
            <div>© 2026 NEXORA Tools - Discount Calculator</div>
            <div>Made in India 🇮🇳 | 71k+ Users | Free tools. Simple solutions.</div>
            <div style={{ marginTop: 8 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
