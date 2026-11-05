"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [txt, setTxt] = useState("");

  useEffect(() => {
    document.title = "Word Counter - Words, Characters, Sentences Free | NEXORA";
  }, []);

  const words = txt.trim() ? txt.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = txt.length;
  const charsNoSpace = txt.replace(/\s/g, "").length;
  const sent = !txt.trim() ? 0 : txt.split(/[.!?]+/).filter(s => s.trim()).length;
  const para = !txt.trim() ? 0 : txt.split(/\n+/).filter(s => s.trim()).length;
  const readTime = Math.ceil(words / 200) || 0;
  const speakTime = Math.ceil(words / 130) || 0;

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 22, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#171725" };
  const p: any = { fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 12, border: "1px solid #c8e6c9" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh", paddingBottom: 20 }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#171725", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...badge, marginBottom: 0, fontSize: 10, whiteSpace: "nowrap" }}>● PRIVATE • INSTANT</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>✍️ 100% Private • Instant As You Type • No Limit • Offline</span>
          <h1 style={{ fontSize: 26, letterSpacing: -0.7, fontWeight: 900 }}>Word Counter</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Count Words, Characters, Sentences, Paragraphs — Instant as you type, Private, Offline.</p>
          <textarea value={txt} onChange={e => setTxt(e.target.value)} rows={8} placeholder="Type or paste text here... Essay 500/1000 words, assignment, Instagram caption 150 chars, Twitter 280 chars..." style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, minHeight: 160, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 14 }}>
            {[{ v: words, l: "Words" }, { v: chars, l: "Chars" }, { v: sent, l: "Sentences" }, { v: para, l: "Paras" }].map((s, i) => (
              <div key={i} style={{ background: "linear-gradient(135deg,#f0efff,#e6e3ff)", padding: 14, borderRadius: 12, textAlign: "center", border: "1px solid #e0e0ff" }}>
                <b style={{ display: "block", fontSize: 22, color: "#6c5ce7" }}>{s.v}</b>{s.l}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontWeight: 700, color: "#555", textAlign: "center", fontSize: 12, background: "#f6f7fb", padding: 10, borderRadius: 10, border: "1px solid #eee" }}>
            Chars without spaces: {charsNoSpace} | Reading Time: {readTime} min | Speaking: {speakTime} min | Paras: {para}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={() => setTxt("")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #ddd", background: "#f3f4f6", fontWeight: 800, cursor: "pointer" }}>Clear</button>
            <button onClick={() => navigator.clipboard.writeText(txt)} style={{ flex: 1, padding: 12, borderRadius: 10, border: 0, background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Copy Text</button>
          </div>
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA Word Counter?</h2>
          <p style={p}>NEXORA Word Counter — Instant as you type, no button needed — auto counts words, characters, sentences, paragraphs. Private — text never leaves phone, browser-based, works offline, 100% secure. Reading time = Words/200 per min, Speaking time = Words/130 per min. Best for students — essay 500 words, 1000 words assignment, Instagram 150 chars limit, Twitter 280 chars, LinkedIn. Made in India.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>How to Count Words - 3 Easy Steps</h3>
          <p style={p}><b>Step 1:</b> Type or Paste Text — Essay, assignment, Instagram caption<br /><b>Step 2:</b> Instant Count — Auto counts as you type, no button needed<br /><b>Step 3:</b> Check Stats — Words, chars, sentences, paras, reading/speaking time.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>Features - Why Writers Love NEXORA</h3>
          <ul style={{ ...p, paddingLeft: 18 }}><li>✅ Instant As You Type — No Button, Auto Count</li><li>✅ Words, Chars, Sentences, Paras — All Stats + Reading Speaking Time</li><li>✅ 100% Private — Text Never Leaves Phone, Works Offline</li><li>✅ For Essay Instagram Twitter — 500/1000 Words, 150/280 Chars Check</li><li>✅ Free Forever No Watermark No Signup No Limit</li></ul>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Speed</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Instant As You Type ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Button Click</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private Offline ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Stats</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Words Chars Sent Para + Read Speak ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only Words</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads Clean ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Popups Ads</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ - Word Counter</h2>
          <p style={p}><b>Q: How to count words?</b><br />A: Paste or type text, instant counts words characters sentences paras as you type, private browser.<br /><br /><b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, offline, text never leaves phone, no signup, for essay Instagram Twitter.<br /><br /><b>Q: What is reading time?</b><br />A: Reading = Words/200 per min, Speaking = Words/130 per min, instant calc.<br /><br /><b>Q: Word count kaise kare?</b><br />A: Text paste karo, instant words characters count ho jayega, private.<br /><br />Try Also: <a href="/character-counter" style={{ color: "#6c5ce7", fontWeight: 700 }}>Character Counter</a> | <a href="/case-converter" style={{ color: "#6c5ce7", fontWeight: 700 }}>Case Converter</a> | <a href="/typing-speed-test" style={{ color: "#6c5ce7", fontWeight: 700 }}>Typing Speed Test</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - Word Counter</div><div>Made in India 🇮🇳 | Private</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
