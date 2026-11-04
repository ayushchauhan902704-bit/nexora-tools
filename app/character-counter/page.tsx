"use client";
import { useState } from "react";

export default function Page() {
  const [txt, setTxt] = useState("");
  const withSpace = txt.length;
  const withoutSpace = txt.replace(/\s/g, "").length;
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  const sentences = txt.split(/[.!?]+/).filter((s) => s.trim()).length;

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" }}>● 76K+ USERS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, color: "#6c5ce7", fontSize: 13, textDecoration: "none" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
          <span style={{ display: "inline-block", background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10, border: "1px solid #c8e6c9" }}>🔒 Private – 100% in browser | Free</span>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.5px" }}>Character Counter - With & Without Spaces</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Best Character Counter - Count Characters, Letters, Words, Sentences Instantly. With Spaces & Without Spaces — Private, Free.</p>
          <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={8} placeholder="Type or Paste your text here to count characters..." style={{ width: "100%", padding: 14, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, outline: "none" }} />
          <div style={{ marginTop: 12, fontWeight: 800, color: "#6c5ce7", background: "#f0efff", padding: 14, borderRadius: 12, textAlign: "center", fontSize: 14 }}>
            Characters: {withSpace} (with spaces) | {withoutSpace} (without spaces) | Words: {words} | Sentences: {sentences}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>Why NEXORA No.1 Character Counter in World?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Unlike charcounter.com, wordcounter.net with heavy ads, NEXORA Character Counter is 100% free forever, no ads, 100% private — your text never leaves your phone, browser-based. Counts characters with spaces (includes spaces) and without spaces (only letters/numbers) instantly in real-time. Example: Hello World = 11 with spaces, 10 without spaces. Also counts words and sentences. Best for essays, assignments where character limit matters, Twitter 280 chars, Instagram captions, SEO meta description 160 chars, UPSC forms. Unlike other tools, no ads, clean, fast. Made in India, trusted by 76k+ users worldwide, works on iPhone, Android, Laptop. Best alternative to charcounter.com, wordcounter.net. Fast in 1 second.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>How to Count Characters With & Without Spaces - 3 Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}><b>Step 1:</b> Type or paste your text in box above<br /><b>Step 2:</b> Instantly see characters with spaces and without spaces, words, sentences<br /><b>Step 3:</b> Use count for Twitter, Instagram, essays, assignments.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Difference Between Character Count and Word Count</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7, marginBottom: 8 }}>Character count counts every letter, number, space, symbol. Word count counts words separated by spaces. Example: I love India = 3 words, 12 chars with spaces, 10 without. Our tool shows both.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, margin: "16px 0 6px", color: "#6c5ce7" }}>Features - Why World Loves NEXORA</h3>
          <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><li>✅ Counts With Spaces & Without Spaces Instantly</li><li>✅ Also Words, Sentences Count</li><li>✅ 100% Private — Text never leaves phone</li><li>✅ Free Forever, No Ads</li><li>✅ Works on iPhone, Android, Laptop</li><li>✅ Fast Real-time, Made in India, 76k+ Users</li></ul>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>With / Without Spaces</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Both ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Only 1</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Ads</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Ads ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Heavy Ads</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={{ background: "white", border: "1px solid #e8e8ef", borderRadius: 18, padding: 26, margin: "18px 0" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>FAQ - Character Counter - Google Loves This</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.7 }}><b>Q: What is Character Counter?</b><br />A: Counts total characters with spaces and without spaces, also words, sentences.<br /><br /><b>Q: How to count with and without spaces?</b><br />A: Paste text, instantly see 11 with spaces, 10 without for Hello World.<br /><br /><b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, browser-based, no signup.<br /><br /><b>Q: Best use?</b><br />A: Essays, Twitter 280 chars, Instagram, SEO meta 160 chars, UPSC forms.</p>
          <p style={{ marginTop: 12, fontSize: 12.5 }}>Try Also: <a href="/word-counter" style={{ color: "#6c5ce7", fontWeight: 700 }}>Word Counter</a> | <a href="/word-to-pdf" style={{ color: "#6c5ce7", fontWeight: 700 }}>Word to PDF</a> | <a href="/ai-text-humanizer" style={{ color: "#6c5ce7", fontWeight: 700 }}>AI Humanizer</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
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
              <a href="/" style={{ textDecoration: "none" }}>Home</a><a href="/about" style={{ textDecoration: "none" }}>About</a><a href="/contact" style={{ textDecoration: "none" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none" }}>Disclaimer</a><a href="/sitemap.xml" style={{ textDecoration: "none" }}>Sitemap</a>
            </div>
          </div>
          <div>
            <div>© 2026 NEXORA Tools - Character Counter</div>
            <div>Made in India 🇮🇳 | 76k+ Users | Free tools. Simple solutions.</div>
            <div style={{ marginTop: 8 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
