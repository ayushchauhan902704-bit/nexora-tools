"use client";
import { useState, useEffect, useMemo } from "react";

const UNITS: any = {
  length: { km: 1, m: 1000, mile: 0.621371, cm: 100000, ft: 3280.84, inch: 39370.1 },
  weight: { kg: 1, lb: 2.20462, g: 1000, oz: 35.274 },
  temp: { C: "C", F: "F" },
};

export default function Page() {
  const [type, setType] = useState("length");
  const [val1, setVal1] = useState("1");
  const [unit1, setUnit1] = useState("km");
  const [unit2, setUnit2] = useState("mile");

  useEffect(() => {
    document.title = "Unit Converter - km to miles, kg to lbs, C to F Free | NEXORA";
  }, []);

  const unitKeys = Object.keys(UNITS[type]);

  const changeType = (t: string) => {
    setType(t);
    const keys = Object.keys(UNITS[t]);
    setUnit1(keys[0]);
    setUnit2(keys[1] || keys[0]);
  };

  const result = useMemo(() => {
    const v = parseFloat(val1);
    if (isNaN(v)) return "";
    if (type === "temp") {
      const c = unit1 === "C" ? v : (v - 32) * 5 / 9;
      const out = unit2 === "C" ? c : c * 9 / 5 + 32;
      return out.toFixed(2);
    }
    const base = v / UNITS[type][unit1];
    return (base * UNITS[type][unit2]).toFixed(4);
  }, [val1, type, unit1, unit2]);

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 22, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#171725" };
  const p: any = { fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 12, border: "1px solid #c8e6c9" };
  const input: any = { width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, marginTop: 8, fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fff", color: "#171725" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh", paddingBottom: 20 }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#171725", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...badge, marginBottom: 0, fontSize: 10, whiteSpace: "nowrap" }}>● INSTANT • OFFLINE</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>📏 Length, Weight, Temperature • Instant As You Type • Free</span>
          <h1 style={{ fontSize: 26, letterSpacing: -0.7, fontWeight: 900 }}>Unit Converter</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Convert km to miles, kg to lbs, C to F, cm to inches — Instant as you type, Accurate, Free Forever.</p>

          <select value={type} onChange={e => changeType(e.target.value)} style={input}>
            <option value="length">Length - km, miles, m, ft, cm, inch</option>
            <option value="weight">Weight - kg, lbs, g, oz</option>
            <option value="temp">Temperature - C, F</option>
          </select>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <input type="number" value={val1} onChange={e => setVal1(e.target.value)} placeholder="1" style={input} />
            <select value={unit1} onChange={e => setUnit1(e.target.value)} style={input}>
              {unitKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div style={{ textAlign: "center", margin: 12, fontWeight: 900, color: "#6c5ce7" }}>⬇️ Instant Convert As You Type</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input type="number" readOnly value={result} style={{ ...input, background: "#f0efff", fontWeight: 800, color: "#6c5ce7", marginTop: 0 }} />
            <select value={unit2} onChange={e => setUnit2(e.target.value)} style={{ ...input, marginTop: 0 }}>
              {unitKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, fontWeight: 700, color: "#555" }}>
            {val1 || "0"} {unit1} = <span style={{ color: "#6c5ce7", fontSize: 16 }}>{result} {unit2}</span>
          </div>

          <button onClick={() => { setUnit1(unit2); setUnit2(unit1); }} style={{ width: "100%", padding: 14, borderRadius: 12, border: "1px solid #ddd", background: "#f3f4f6", fontWeight: 800, marginTop: 12, cursor: "pointer" }}>🔄 Swap Units</button>
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA Unit Converter?</h2>
          <p style={p}>NEXORA Unit Converter — Instant as you type, no button needed — auto converts. Length: 1 km = 0.621371 miles, 1 m = 1000 mm, 1 ft = 12 inch, cm to inches. Weight: 1 kg = 2.20462 lbs, 1 kg = 1000 g, best for gym travel. Temperature: 0°C = 32°F, Formula C to F: F = C×9/5+32, F to C: C = (F-32)×5/9. Works offline, browser-based, 100% private, no watermark, free forever. Best for India students — travel US UK km to miles, gym kg to lbs, cooking C to F. Made in India.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>How to Convert Units - 3 Easy Steps</h3>
          <p style={p}><b>Step 1:</b> Select Type — Length, Weight, Temperature<br /><b>Step 2:</b> Enter Value — Enter number and select from/to units<br /><b>Step 3:</b> Instant Convert — Auto converts as you type, no click needed.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>Features</h3>
          <ul style={{ ...p, paddingLeft: 18 }}><li>✅ Instant As You Type — No Button, Auto Convert</li><li>✅ Length Weight Temperature — All Types: km miles kg lbs C F</li><li>✅ Accurate Formulas — 1 km=0.621371 mi, 1 kg=2.20462 lb, 0C=32F</li><li>✅ Works Offline — Browser-Based, No Internet Needed After Load</li><li>✅ Free Forever No Watermark No Signup</li></ul>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Speed</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Instant As You Type ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Button Click Needed</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Offline</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Works Offline ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Needs Internet</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Types</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Length Weight Temp All ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Single Type</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads Clean ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Ads Popups</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ - Unit Converter</h2>
          <p style={p}><b>Q: How to convert km to miles?</b><br />A: Select Length, enter km, instant converts — 1 km = 0.621371 miles, works offline as you type.<br /><br /><b>Q: How to convert kg to lbs?</b><br />A: Select Weight, enter kg, instant converts — 1 kg = 2.20462 lbs, best for gym travel.<br /><br /><b>Q: How to convert C to F?</b><br />A: Select Temperature, enter C, instant converts — Formula F=C×9/5+32, 0°C=32°F.<br /><br /><b>Q: Is it free?</b><br />A: Yes, 100% free, instant, offline, accurate, for travel gym cooking.<br /><br />Try Also: <a href="/percentage-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Percentage Calculator</a> | <a href="/loan-emi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/age-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Age Calculator</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - Unit Converter</div><div>Made in India 🇮🇳 | Instant</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
