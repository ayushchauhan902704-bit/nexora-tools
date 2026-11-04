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

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const doHumanize = () => {
    if (!input.trim()) return;
    setOutput(humanize(input));
    setCopied(false);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700 }}>← NEXORA</a>
      <h1 style={{ fontSize: 32, margin: "16px 0 8px" }}>AI Text Humanizer - Free</h1>
      <p style={{ color: "#475569" }}>Paste AI text, get natural human-like text. 100% Free, Private - No Login.</p>

      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your AI text here..." style={{ width: "100%", height: 160, padding: 14, borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 16, boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
        <button onClick={doHumanize} style={{ flex: 1, padding: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Humanize Text →</button>
        <button onClick={() => { setInput(""); setOutput(""); }} style={{ padding: 14, background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 10, cursor: "pointer" }}>Clear</button>
      </div>

      {output && (
        <div style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>Humanized Output</b>
            <button onClick={copy} style={{ padding: "8px 14px", background: copied ? "#16a34a" : "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>{copied ? "Copied ✓" : "Copy"}</button>
          </div>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 12, lineHeight: 1.7 }}>{output}</p>
        </div>
      )}

      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 30 }}>NEXORA - Free Tools. Simple Solutions. • <a href="/">All Tools</a></p>
    </div>
  );
}
