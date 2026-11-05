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
  return out.replace(/\bIn conclusion\b/gi, "In the end").replace(/\bIt is important to note that\b/gi, "Note that").replace(/delve/gi, "explore").replace(/tapestry/gi, "mix");
}

export default function HumanizerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const doHumanize = () => {
    if (!input.trim()) { setError("Please paste some text first."); return; }
    if (input.trim().length < 10) { setError("Please paste at least 10 characters."); return; }
    setError(""); setOutput(humanize(input)); setCopied(false); setShowResult(true);
  };
  const copy = async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const clearAll = () => { setInput(""); setOutput(""); setError(""); setShowResult(false); };
  const wordCount = (t: string) => t.trim() ? t.trim().split(/\s+/).length : 0;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      {/* HEADER - SIMPLE CLEAN */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 18px 10px" }}>
        {/* HEADING - BLUE + CENTER */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 36, margin: "0 0 8px", color: "#2563eb", lineHeight: 1.2, letterSpacing: "-0.5px" }}>AI Text Humanizer</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Humanize AI text online free.<br/>Paste AI text, get natural human-like text.</p>
        </div>

        {/* TOOL BOX - WHITE + CHHOTA + SAANS WALI JAGAH */}
        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 12px", textAlign: "center", color: "#0f172a" }}>Paste Your AI Text Here</p>
          
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} placeholder="Paste & Write..." style={{ width: "100%", height: 130, padding: 16, borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: 16, boxSizing: "border-box", outline: "none", background: "#ffffff", color: "#0f172a", resize: "none" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
            <span>{wordCount(input)} words • {input.length} characters</span>
            <span>🔒 100% Private</span>
          </div>

          {error && <p style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "12px 0 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={doHumanize} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Humanize Text →</button>
            <button onClick={clearAll} style={{ padding: "15px 22px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700, color: "#0f172a" }}>Clear</button>
          </div>
        </div>

        {showResult && output && (
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 20, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b>Humanized Output</b><button onClick={copy} style={{ padding: "8px 16px", background: copied ? "#16a34a" : "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>{copied ? "Copied ✓" : "Copy"}</button></div>
            <p style={{ whiteSpace: "pre-wrap", marginTop: 12, lineHeight: 1.8, background: "#f8fafc", padding: 16, borderRadius: 12, color: "#0f172a" }}>{output}</p>
          </div>
        )}

        {/* TOOL KE BAAD KHALI JAGAH - SAANS */}
        <div style={{ height: 40 }}></div>

        {/* EARNING BOX */}
        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Earn Money With This Tool!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Students and YouTubers need human-like notes and scripts. Offer humanizing service for ₹30-₹50 per 1000 words on WhatsApp and Instagram. No investment needed, only this free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        {/* CONTENT - CLEAN */}
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21, color: "#0f172a" }}>What is AI Text Humanizer?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>An <b>AI text humanizer</b> converts robotic AI text into natural, human-like writing. It replaces hard words with simple words that real people use.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>How to Use?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Paste your text.<br/><b>Step 2:</b> Click Humanize Text.<br/><b>Step 3:</b> Copy the output.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is this AI text humanizer free?</summary><p style={{ color: "#475569" }}>Yes, 100% free. No login, no watermark.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my data safe?</summary><p style={{ color: "#475569" }}>Yes. Text is processed in your browser only.</p></details>
        </div>

        {/* BY AYUSH - SABSE LAST ME - TOOL KE BAAD */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br/>Last Updated: 5 Nov 2026 • 100% Free & Private</p>
      </main>

      {/* NICHE SE LOOP - SCROLL KARNE PE AAYEGA */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Resume Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Resume Maker</span>
        </div>
        <style>{`@keyframes nexoraLoop { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Free Tools. Simple Solutions. • <a href="/about" style={{ color: "#cbd5e1" }}>About</a> • <a href="/privacy-policy" style={{ color: "#cbd5e1" }}>Privacy</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contact</a></p>
      </footer>
    </div>
  );
}
