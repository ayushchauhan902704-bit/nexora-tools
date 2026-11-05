"use client";
import { useState, useEffect, useRef } from "react";

declare global { interface Window { pdfjsLib: any; } }

export default function Page() {
  const [text, setText] = useState("");
  const [pages, setPages] = useState(0);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = (src: string) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script"); s.src = src; document.head.appendChild(s);
    };
    load("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js");
    const t = setInterval(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        clearInterval(t);
      }
    }, 500);
    return () => clearInterval(t);
  }, []);

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) { alert("Sirf PDF file daalo bhai!"); return; }
    if (!window.pdfjsLib) { alert("Library load ho rahi hai, 2 sec baad dobara try karo"); return; }
    setFileName(f.name);
    setLoading(true);
    setStatus("Reading PDF...");
    try {
      const url = URL.createObjectURL(f);
      const pdf = await window.pdfjsLib.getDocument(url).promise;
      let full = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i);
        const c = await p.getTextContent();
        full += c.items.map((s: any) => s.str).join(" ") + "\n\n";
        setStatus(`Reading... Page ${i} / ${pdf.numPages}`);
      }
      setText(full);
      setPages(pdf.numPages);
      setStatus(`Ready! ${pdf.numPages} pages loaded - Neeche preview dekh lo, phir Download dabao`);
      setLoading(false);
    } catch {
      setLoading(false);
      setStatus("Error: Ye scanned PDF lag raha hai. Text PDF try karo, scanned ke liye OCR tool use karo.");
    }
  };

  const downloadDoc = () => {
    if (!text.trim()) { alert("Pehle PDF daalo!"); return; }
    const blob = new Blob([text], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `NEXORA-${fileName.replace(".pdf", "")}.doc`;
    a.click();
    setStatus("Downloaded! DOC file ready - Word me kholo");
  };

  const downloadTxt = () => {
    if (!text.trim()) { alert("Pehle PDF daalo!"); return; }
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `NEXORA-${fileName.replace(".pdf", "")}.txt`;
    a.click();
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "16px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f6f7fb", color: "#171725", minHeight: "100vh", paddingBottom: 20, overflowX: "hidden" }}>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #e8e8ef", zIndex: 50 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#10b981" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ ...badge, margin: 0 }}>● 96K+ USERS • PRIVATE</span><a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#10b981", textDecoration: "none" }}>← All Tools</a></div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>🔒 Private • No Upload • 100% Free • No Watermark • 96K+ Users</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginTop: 10, letterSpacing: -0.5 }}>PDF to Word - Free & Fast</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Best quality text extraction, free, no watermark, private — PDF never leaves phone — Made in India</p>

          <input ref={fileRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files?.[0])} />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
            style={{ marginTop: 12, border: "3px dashed #10b981", borderRadius: 20, padding: "36px 16px", textAlign: "center", background: "linear-gradient(135deg,#f0fdf4,#f0fdfa)", cursor: "pointer" }}>
            <div style={{ fontSize: 32 }}>📄</div>
            <div style={{ fontWeight: 900, marginTop: 6 }}>Click or Drop PDF Here</div>
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4 }}>Any PDF up to 50MB • Instant • Private</div>
            {fileName && <div style={{ fontSize: 12, marginTop: 8, background: "#fff", padding: "6px 10px", borderRadius: 999, display: "inline-block", border: "1px solid #d1fae5" }}>📄 {fileName} • {pages} pages</div>}
          </div>

          {status && <p style={{ marginTop: 12, textAlign: "center", fontWeight: 700, color: "#059669", fontSize: 13 }}>{loading ? "⏳ " : "✅ "}{status}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={downloadDoc} style={{ flex: 1, padding: 15, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#10b981,#14b8a6)", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>Convert to Word & Download →</button>
            <button onClick={downloadTxt} style={{ padding: "15px 18px", borderRadius: 12, background: "#fff", color: "#059669", border: "1.5px solid #10b981", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>TXT</button>
          </div>

          {text && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: 13 }}>👀 Preview - Text sahi nikla?</b>
                <span style={{ fontSize: 11, color: "#888" }}>{text.length} characters • {text.split(" ").length} words</span>
              </div>
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, marginTop: 8, fontSize: 12, lineHeight: 1.7, maxHeight: 220, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text.slice(0, 3000)}{text.length > 3000 ? "\n\n... (Preview me pehle 3000 characters dikh rahe hai, Download me pura text aayega)" : ""}</div>
            </div>
          )}

          <div style={{ marginTop: 14, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6 }}><b>⚠️ Note:</b> Ye tool Text wali PDF ke liye hai. Agar teri PDF scanned photo wali hai (photo khinch ke banayi hui), to usme text nahi hoga - uske liye <b>OCR PDF to Word</b> use karna padega.</div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA No.1 PDF to Word?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}>NEXORA PDF to Word — Best quality text extraction using pdf.js, browser-based — PDF never leaves phone, 100% private, no watermark, free forever, safe for Aadhaar, PAN, private docs. Opens in Word, Google Docs, WPS. Scanned PDF? Use our OCR PDF to Word tool. Best for students — PDF notes, books to Word editable for assignment. Made in India, trusted by 96k+ users. Fast in 2 sec, works on iPhone Android Laptop.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#059669", marginTop: 12 }}>How to Convert - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7 }}><b>Step 1:</b> Click or Drop PDF — Any PDF up to 50MB<br /><b>Step 2:</b> Text Extraction — Browser extracts text, preview dikhega<br /><b>Step 3:</b> Convert to Word & Download — DOC file ready, Word me kholo.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#059669", marginTop: 12 }}>Features</h3>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7, paddingLeft: 18 }}><li>✅ Best Quality Text Extraction — pdf.js Browser</li><li>✅ 100% Private — PDF Never Leaves Phone, Safe for Aadhaar PAN</li><li>✅ No Watermark, Free Forever, Unlimited, No Signup</li><li>✅ Opens in Word, Google Docs, WPS — DOC Format</li><li>✅ Preview + TXT Download Bhi</li></ul>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#ecfdf5", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#ecfdf5" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#ecfdf5" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private Browser ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Quality</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Best Text Extraction ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Low Quality</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Watermark ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Paid</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Limit</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Unlimited Free ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>2 Free Then Paid</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - PDF to Word</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}><b>Q: How to convert PDF to Word?</b><br />A: Upload PDF, text extracts in browser, click Convert to Word, download DOC — No watermark, private.<br /><br /><b>Q: Is it private and free?</b><br />A: Yes, 100% private, PDF never leaves phone, free forever no watermark, safe for Aadhaar PAN.<br /><br /><b>Q: Does formatting remain?</b><br />A: Best quality text extraction — text remains, scanned PDF needs OCR tool.<br /><br /><b>Q: PDF to Word kaise kare?</b><br />A: PDF upload karo, Convert dabao, DOC download ho jayega.<br /><br /><b>Try Also:</b> <a href="/ocr-pdf-to-word" style={{ color: "#059669", fontWeight: 700 }}>OCR PDF to Word</a> | <a href="/word-to-pdf" style={{ color: "#059669", fontWeight: 700 }}>Word to PDF</a> | <a href="/pdf-to-jpg" style={{ color: "#059669", fontWeight: 700 }}>PDF to JPG</a> | <a href="/" style={{ color: "#059669", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#059669", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - PDF to Word</div><div>Made in India 🇮🇳 | 96k+ Users | No Watermark</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#059669", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
