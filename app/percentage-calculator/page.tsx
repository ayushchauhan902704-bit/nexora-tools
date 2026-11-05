"use client";
import { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState<"of" | "what" | "change">("of");
  const [per, setPer] = useState("20");
  const [num, setNum] = useState("150");
  const [xVal, setXVal] = useState("30");
  const [yVal, setYVal] = useState("150");
  const [base, setBase] = useState("150");
  const [changePer, setChangePer] = useState("20");
  const [changeType, setChangeType] = useState<"inc" | "dec">("inc");

  const calcOf = () => {
    const p = parseFloat(per), n = parseFloat(num);
    if (isNaN(p) || isNaN(n)) return null;
    const ans = (n * p) / 100;
    return { ans, formula: `${n} × ${p} / 100 = ${ans}` };
  };
  const calcWhat = () => {
    const x = parseFloat(xVal), y = parseFloat(yVal);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return { ans: (x / y) * 100, formula: `(${x} / ${y}) × 100` };
  };
  const calcChange = () => {
    const b = parseFloat(base), p = parseFloat(changePer);
    if (isNaN(b) || isNaN(p)) return null;
    const diff = (b * p) / 100;
    const ans = changeType === "inc" ? b + diff : b - diff;
    return { ans, diff, formula: changeType === "inc" ? `${b} + ${diff} = ${ans}` : `${b} - ${diff} = ${ans}` };
  };

  const r1 = calcOf();
  const r2 = calcWhat();
  const r3 = calcChange();

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "16px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" };
  const input: any = { width: "100%", padding: 13, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", marginTop: 6, background: "#fff", color: "#171725" };
  const tab = (active: boolean): any => ({ flex: 1, padding: "12px 6px", borderRadius: 12, border: active ? "2px solid #6c5ce7" : "1px solid #e5e7eb", background: active ? "#f0efff" : "#fff", color: active ? "#6c5ce7" : "#555", fontWeight: 800, fontSize: 12, cursor: "pointer", textAlign: "center" });
  const resultBox: any = { background: "linear-gradient(135deg,#f0efff,#e6e3ff)", borderRadius: 14, padding: 16, marginTop: 14, fontWeight: 700, textAlign: "center", fontSize: 18 };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", minHeight: "100vh", paddingBottom: 20, overflowX: "hidden" }}>
      <style>{`@media(max-width:600px){.per-tabs{flex-wrap:wrap !important}}`}</style>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #e8e8ef", zIndex: 50 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ ...badge, margin: 0 }}>● 91K+ STUDENTS • INSTANT</span><a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none" }}>← All Tools</a></div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>📊 For Students, Shopping • Instant • No Ads • 91K+ Users • Free</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.8, marginTop: 8, lineHeight: 1.2 }}>Percentage Calculator</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>What is X% of Y, What % is X of Y, Increase / Decrease — Ek hi tool, instant, free, private.</p>

          <div className="per-tabs" style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setMode("of")} style={tab(mode === "of")}>📊 X% of Y</button>
            <button onClick={() => setMode("what")} style={tab(mode === "what")}>❓ What % ?</button>
            <button onClick={() => setMode("change")} style={tab(mode === "change")}>📈 Increase / Decrease</button>
          </div>

          {mode === "of" && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>Percentage (%)</label><input style={input} type="number" value={per} onChange={e => setPer(e.target.value)} placeholder="20" /></div>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>Number</label><input style={input} type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="150" /></div>
              </div>
              {r1 && <div style={resultBox}>{per}% of {num} = <span style={{ color: "#6c5ce7", fontSize: 24 }}>{r1.ans}</span><div style={{ fontWeight: 400, fontSize: 13, marginTop: 4 }}>{r1.formula}</div></div>}
              <p style={{ fontSize: 12, color: "#888", marginTop: 10, textAlign: "center" }}>Type karte hi answer aa jayega - button dabane ki zarurat nahi!</p>
            </div>
          )}

          {mode === "what" && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>X (Chhota Number)</label><input style={input} type="number" value={xVal} onChange={e => setXVal(e.target.value)} placeholder="30" /></div>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>Y (Bada Number)</label><input style={input} type="number" value={yVal} onChange={e => setYVal(e.target.value)} placeholder="150" /></div>
              </div>
              {r2 && <div style={{ ...resultBox, background: "linear-gradient(135deg,#e8f5e9,#d4edda)" }}>{xVal} is <span style={{ color: "#2e7d32", fontSize: 24 }}>{r2.ans.toFixed(2)}%</span> of {yVal}<div style={{ fontWeight: 400, fontSize: 13, marginTop: 4 }}>{r2.formula} = {r2.ans.toFixed(2)}%</div></div>}
              <p style={{ fontSize: 12, color: "#888", marginTop: 10, textAlign: "center" }}>Marks % nikalne ke liye best hai - e.g. 30 marks out of 150 = 20%</p>
            </div>
          )}

          {mode === "change" && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setChangeType("inc")} style={tab(changeType === "inc")}>📈 Increase (+)</button>
                <button onClick={() => setChangeType("dec")} style={tab(changeType === "dec")}>📉 Decrease / Discount (-)</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>Original Price / Number</label><input style={input} type="number" value={base} onChange={e => setBase(e.target.value)} placeholder="150" /></div>
                <div><label style={{ fontWeight: 800, fontSize: 13 }}>% Increase / Decrease</label><input style={input} type="number" value={changePer} onChange={e => setChangePer(e.target.value)} placeholder="20" /></div>
              </div>
              {r3 && <div style={resultBox}>{changeType === "inc" ? "Badha hua" : "Discount ke baad"} Price = <span style={{ color: "#6c5ce7", fontSize: 24 }}>{r3.ans}</span><div style={{ fontWeight: 400, fontSize: 13, marginTop: 4 }}>{r3.formula} • {changeType === "inc" ? "Badha" : "Bacha"}: {r3.diff}</div></div>}
              <p style={{ fontSize: 12, color: "#888", marginTop: 10, textAlign: "center" }}>Shopping discount ke liye - 1000 pe 20% off = 800</p>
            </div>
          )}

          <div style={{ marginTop: 16, background: "#f9f9ff", border: "1px solid #efedff", borderRadius: 12, padding: 12, fontSize: 12, color: "#555", lineHeight: 1.7 }}>
            <b>💡 Quick Formula:</b> X% of Y = Y × X / 100 • What % = (X / Y) × 100 • Increase = Base + (Base × % / 100) • Decrease = Base - (Base × % / 100)
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA No.1 Percentage Calculator?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}>NEXORA Percentage Calculator — 3-in-1 tool: What is X% of Y, What % is X of Y, aur Increase / Decrease. Formula ke saath answer: X% of Y = Y×X/100. Example 20% of 150 = 30. What % is X of Y = (X/Y)*100. Example 30 is 20% of 150. Used for students — marks percentage, discount shopping, GST, salary hike, profit loss. Instant, free, no signup, no ads, 100% private browser-based. Best for India — CBSE percentage, shopping discount, GST calc. Made in India, trusted by 91k+ students. Fast in 1 sec, works on iPhone Android Laptop.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>How to Calculate - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7 }}><b>Step 1:</b> Tab Chuno — X% of Y / What % / Increase-Decrease<br /><b>Step 2:</b> Number Daalo — Type karte hi answer aa jayega<br /><b>Step 3:</b> Formula Dekho — Steps ke saath samajh aa jayega.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>Features</h3>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7, paddingLeft: 18 }}><li>✅ 3-in-1 Calculator — X% of Y + What % + Increase / Decrease</li><li>✅ Formula Shown — Y×X/100 = Answer with Steps</li><li>✅ For Students Shopping — Marks, Discount, GST, Salary Hike</li><li>✅ Instant No Ads — Type Karte Hi Answer</li><li>✅ Free Forever No Signup</li></ul>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Tools</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>3-in-1 ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Single Only</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Popups Ads</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Formula</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Shows Steps ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only Answer</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Speed</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Instant ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Slow</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - Percentage Calculator</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}><b>Q: What is percentage calculator?</b><br />A: Finds X% of Y using formula Y×X/100 — Example 20% of 150 = 30.<br /><br /><b>Q: How to find what percent X is of Y?</b><br />A: Formula (X/Y)*100 — Example 30 is 20% of 150.<br /><br /><b>Q: Discount kaise nikale?</b><br />A: Increase / Decrease tab me jao, Decrease select karo, Price aur % daalo.<br /><br /><b>Q: Percentage kaise nikale?</b><br />A: Number × Percentage /100 — Example 150×20/100=30.<br /><br />Try Also: <a href="/discount-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Discount Calculator</a> | <a href="/loan-emi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/age-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Age Calculator</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - Percentage Calculator</div><div>Made in India 🇮🇳 | 91k+ Users</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
