"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [len, setLen] = useState(12);
  const [pass, setPass] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Strong Password Generator - Random Secure Password Free | NEXORA";
  }, []);

  const genPass = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let p = "";
    for (let i = 0; i < len; i++) p += chars.charAt(arr[i] % chars.length);
    setPass(p);
    setCopied(false);
  };

  const copyPass = async () => {
    if (!pass) return;
    try { await navigator.clipboard.writeText(pass); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert("Copy failed - manually select karke copy kar lo"); }
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)", overflow: "hidden" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#171725" };
  const pStyle: any = { fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 };
  const btn: any = { width: "100%", padding: 14, background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 700, border: 0, borderRadius: 12, fontSize: 15, marginTop: 12, cursor: "pointer" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 0", flexWrap: "wrap" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800, border: "1px solid #c8e6c9", whiteSpace: "nowrap" }}>● PRIVATE • BROWSER ONLY</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 12, border: "1px solid #c8e6c9" }}>🔐 100% Private • Browser Only • No Storage</span>
          <h1 style={{ fontSize: 24, letterSpacing: -0.5, lineHeight: 1.2, fontWeight: 900 }}>Strong Password Generator</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Random, Secure, Unbreakable — Letters + Numbers + Symbols. Safe for Bank, Gmail, Insta — Private, Free Forever.</p>

          <label style={{ fontWeight: 800, fontSize: 13, display: "block", marginTop: 8 }}>Length: <span style={{ color: "#6c5ce7", fontSize: 18 }}>{len}</span> characters</label>
          <input type="range" min={6} max={32} value={len} onChange={e => setLen(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#6c5ce7", marginTop: 8 }} />

          <button onClick={genPass} style={btn}>Generate Strong Password →</button>

          {pass && (
            <>
              <div style={{ background: "linear-gradient(135deg,#f0efff,#e6e3ff)", border: "1px dashed #a69cff", borderRadius: 14, padding: 18, marginTop: 14, fontWeight: 800, textAlign: "center", wordBreak: "break-all", fontSize: 20, letterSpacing: 1 }}>{pass}</div>
              <button onClick={copyPass} style={{ ...btn, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7" }}>{copied ? "✅ Copied!" : "Copy Password 📋"}</button>
            </>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 90, background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 10, padding: 8, textAlign: "center", fontSize: 11 }}><b style={{ display: "block", fontSize: 13, color: "#111" }}>Private</b>Never Sent</div>
            <div style={{ flex: 1, minWidth: 90, background: "#eef2ff", border: "1px solid #e0e7ff", borderRadius: 10, padding: 8, textAlign: "center", fontSize: 11 }}><b style={{ display: "block", fontSize: 13, color: "#111" }}>Random</b>A-Z a-z 0-9 !@#</div>
            <div style={{ flex: 1, minWidth: 90, background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 10, padding: 8, textAlign: "center", fontSize: 11 }}><b style={{ display: "block", fontSize: 13, color: "#111" }}>Free</b>No Signup</div>
          </div>
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA Password Generator?</h2>
          <p style={pStyle}>NEXORA Strong Password Generator is 100% private, browser-only — password generated in your phone using secure random, never sent to server, no storage, no tracking. Random mix A-Z a-z 0-9 !@#$%^&* — 12-16 chars recommended for bank Gmail Insta. Slider 6 to 32 chars — choose length, generate, copy. Unlike other generators that save passwords, NEXORA never saves. Best for India — bank, Gmail, Instagram, UPI safe password.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 14 }}>How to Generate Strong Password - 3 Easy Steps</h3>
          <p style={pStyle}><b>Step 1:</b> Select Length — Slider 6 to 32, 12-16 best for strong<br /><b>Step 2:</b> Click Generate — Random secure password A-Z a-z 0-9 !@#$%^&*<br /><b>Step 3:</b> Copy — Click Copy Password, use for bank Gmail Insta.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>Features</h3>
          <ul style={{ ...pStyle, paddingLeft: 18 }}><li>✅ 100% Private — Browser Only, Never Sent, No Storage</li><li>✅ Random Mix — A-Z a-z 0-9 !@#$%^&* Unbreakable</li><li>✅ Length 6-32 — Slider Control, 12-16 Recommended</li><li>✅ No Signup, Free Forever, Unlimited</li><li>✅ One Click Copy — Fast for Bank Gmail Insta</li><li>✅ Made in India, Safe, Clean</li></ul>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Browser Only No Storage ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Saves to Cloud</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Signup</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Signup ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Signup Required</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Length</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>6-32 Custom Slider ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Fixed 12</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid Premium</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ - Password Generator</h2>
          <p style={pStyle}>
            <b>Q: How to generate strong password?</b><br />A: Select length 6-32, click Generate — Random mix A-Z a-z 0-9 !@#$%^&*.<br /><br />
            <b>Q: Is it safe and private?</b><br />A: Yes, 100% private, browser-only, never sent to server, no storage.<br /><br />
            <b>Q: What length is strong?</b><br />A: 12-16 chars with letters numbers symbols is strong for bank Gmail.<br /><br />
            <b>Q: Is it free?</b><br />A: Yes, 100% free, no signup, unlimited.<br /><br />
            <b>Try Also:</b> <a href="/qr-code-generator" style={{ color: "#6c5ce7", fontWeight: 700 }}>QR Code Generator</a> | <a href="/loan-emi-calculator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about" style={{ color: "#171725" }}>About</a><a href="/contact" style={{ color: "#171725" }}>Contact</a><a href="/privacy" style={{ color: "#171725" }}>Privacy</a><a href="/terms" style={{ color: "#171725" }}>Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "left" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳 • Private</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
