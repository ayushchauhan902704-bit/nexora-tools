"use client";
import { useState } from "react";

const SYNONYMS: Record<string, string> = {
  utilize: "use", however: "but", moreover: "also", therefore: "so",
  additionally: "also", consequently: "so", furthermore: "also",
  nevertheless: "but", nonetheless: "but", subsequently: "then",
  approximately: "about", sufficient: "enough", demonstrate: "show",
  illustrate: "show", commence: "start", terminate: "end",
  facilitate: "help", implement: "do", acquire: "get",
  require: "need", assist: "help", obtain: "get",
};

function humanize(text: string) {
  let out = text;
  for (const k in SYNONYMS) {
    const re = new RegExp(`\\b${k}\\b`, "gi");
    out = out.replace(re, SYNONYMS[k]);
  }
  return out
    .replace(/\bIn conclusion\b/gi, "In the end")
    .replace(/\bIt is important to note that\b/gi, "Note that")
    .replace(/delve/gi, "explore")
    .replace(/tapestry/gi, "mix");
}

export default function HumanizerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const doHumanize = () => {
    if (!input.trim()) { setError("Please paste some text first to humanize."); return; }
    if (input.trim().length < 10) { setError("Please paste at least 10 characters for better results."); return; }
    setError("");
    setOutput(humanize(input));
    setCopied(false);
    setShowResult(true);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); setShowResult(false); };
  const wordCount = (t: string) => t.trim() ? t.trim().split(/\s+/).length : 0;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif", background: "#ffffff", color: "#0f172a", lineHeight: 1.6 }}>
      <a href="/" style={{ color: "#f97316", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>← NEXORA</a>
      <p style={{ fontSize: 12, color: "#64748b", margin: "10px 0 0" }}><a href="/" style={{ color: "#64748b" }}>Home</a> / AI Text Humanizer</p>

      <h1 style={{ fontSize: 32, margin: "10px 0 6px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>AI Text Humanizer</h1>
      <p style={{ color: "#475569", fontSize: 16, margin: "0 0 8px" }}>Humanize AI text online free. Paste AI text, get natural human-like text in 2 seconds. No login, no watermark.</p>
      <p style={{ fontSize: 13, color: "#64748b", background: "#fff7ed", border: "1px solid #fed7aa", padding: "8px 12px", borderRadius: 8 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora • Last Updated: 5 Nov 2026 • 100% Free & Private</p>

      {/* TOOL BOX */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, marginTop: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <label style={{ fontWeight: 700, fontSize: 14 }}>Paste Your AI Text Here</label>
        <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} placeholder="Paste your AI text here... Example: This content utilizes advanced technology to facilitate..." style={{ width: "100%", height: 170, padding: 14, borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 16, boxSizing: "border-box", marginTop: 8, outline: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginTop: 6 }}>
          <span>{wordCount(input)} words • {input.length} characters</span>
          <span>100% Private - Text never leaves your device</span>
        </div>
        {error && <p style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: 8, fontSize: 14, margin: "12px 0 0" }}>⚠️ {error}</p>}
        <div style={{ display: "flex", gap: 10, margin: "14px 0 0", flexWrap: "wrap" }}>
          <button onClick={doHumanize} style={{ flex: 1, minWidth: 180, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Humanize Text →</button>
          <button onClick={clearAll} style={{ padding: "15px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>Clear</button>
        </div>
      </div>

      {showResult && output && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <b>Humanized Output • {wordCount(output)} words</b>
            <button onClick={copy} style={{ padding: "9px 16px", background: copied ? "#16a34a" : "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>{copied ? "Copied ✓" : "Copy Text"}</button>
          </div>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 12, lineHeight: 1.8, background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>{output}</p>
          <p style={{ fontSize: 13, color: "#16a34a", margin: "10px 0 0" }}>✓ Done! Your text is now more natural and human-like.</p>
        </div>
      )}

      {/* EARNING NOTE BOX - HIGHLIGHT */}
      <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 14, padding: 16, marginTop: 18, boxShadow: "0 0 0 3px #fef9c3" }}>
        <b style={{ fontSize: 16 }}>💡 Earning Tip - Earn Money With This Tool!</b>
        <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>
          Students and YouTubers need human-like notes and scripts. Offer humanizing service for ₹30-₹50 per 1000 words on WhatsApp and Instagram.
          Bloggers and shop owners need natural product descriptions - charge ₹100 per article.
          You can also help college students make their assignments sound natural. No investment needed, only this free tool.
        </p>
      </div>

      {/* CONTENT - 350 WORDS */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 22 }}>What is AI Text Humanizer?</h2>
        <p>An <b>AI text humanizer</b> is a free online tool that converts robotic AI-generated text into natural, human-like writing. When you use ChatGPT or any AI tool, the text often sounds formal and repetitive. It uses words like “utilize”, “moreover”, and “delve” again and again. Our tool helps you <b>humanize AI text</b> by replacing those hard words with simple, everyday words that real people use. The result is clear, friendly, and easy to read.</p>
        <p>This <b>AI to human text converter</b> works 100% in your browser. Your text never goes to any server, so your assignments, blogs, and business content stay 100% private. It is perfect for students, bloggers, YouTubers, freelancers, and small business owners who want to <b>make AI text natural</b> without paying for expensive software.</p>

        <h2 style={{ fontSize: 22 }}>How to Use This Free AI Humanizer?</h2>
        <p><b>Step 1:</b> Paste your AI text in the box above.<br/><b>Step 2:</b> Click on Humanize Text button.<br/><b>Step 3:</b> Copy the natural output and use it anywhere.<br/>It takes only 2 seconds. No signup, no login, no watermark.</p>

        <h2 style={{ fontSize: 22 }}>Features / Benefits</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li><b>100% Free & Unlimited:</b> Humanize as much text as you want, no limit.</li>
          <li><b>100% Private:</b> Text is processed on your device only. Nothing is saved.</li>
          <li><b>Bypass AI Detection Feel:</b> Removes robotic patterns and makes text sound human.</li>
          <li><b>Works on Mobile & PC:</b> Perfect design for phone and computer.</li>
          <li><b>No Watermark:</b> Clean output, ready to paste anywhere.</li>
        </ul>

        <h2 style={{ fontSize: 22 }}>Is My Data Safe?</h2>
        <p>Yes. This tool is client-side. Your text is never uploaded, stored, or shared. You can safely humanize personal emails, assignments, and business content.</p>

        <h2 style={{ fontSize: 22 }}>Frequently Asked Questions</h2>
        <div style={{ display: "grid", gap: 12 }}>
          <details style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is this AI text humanizer free?</summary><p>Yes, it is 100% free. No login, no watermark, no limit.</p></details>
          <details style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Does it bypass AI detection?</summary><p>It rewrites robotic words into natural human words, which helps make text sound more natural and less AI-like.</p></details>
          <details style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my data safe?</summary><p>Yes. Your text is processed in your browser only. We never save or upload your text.</p></details>
          <details style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Can I use it for assignments and blogs?</summary><p>Yes, you can use it for blogs, assignments, emails and social media posts.</p></details>
          <details style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is there any watermark?</summary><p>No. Output is 100% clean with no watermark.</p></details>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
          <a href="/passport-photo-maker" style={{ flex: 1, minWidth: 180, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Try Next Tool → Passport Photo Maker</a>
          <a href="/" style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 10, textDecoration: "none", color: "#0f172a", fontWeight: 700 }}>All Tools</a>
        </div>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 24 }}>NEXORA - Free Tools. Simple Solutions. • <a href="/about">About</a> • <a href="/privacy-policy">Privacy Policy</a> • <a href="/contact">Contact</a></p>
      </div>
    </div>
  );
}
