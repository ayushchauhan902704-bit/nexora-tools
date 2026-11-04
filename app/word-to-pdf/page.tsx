"use client";
import { useState, useEffect, useRef } from "react";

declare global { interface Window { mammoth: any; jspdf: any; } }

export default function Page() {
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Word to PDF - DOCX to PDF Free No Watermark HD | NEXORA";
    const load = (src: string) => new Promise<void>((res) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script"); s.src = src; s.onload = () => res(); document.head.appendChild(s);
    });
    load("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
    load("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!window.mammoth) { alert("Library load ho rahi hai, 2 sec baad try karo"); return; }
    setFileName(file.name.replace(/\.(docx|doc)$/i, ""));
    setStatus("Reading Word file..."); setPreview("");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      const text = result.value || "";
      setPreview(text.substring(0, 5000));
      setStatus(`✅ Loaded: ${file.name} - ${text.length} chars - Ready to Download PDF`);
      // store full text in ref via state hack - keep in window for download
      (window as any).__nexoraText = text;
    } catch { setStatus("Error: DOCX file try karo - DOCX best support."); }
  };

  const downloadPdf = () => {
    const text = (window as any).__nexoraText as string;
    if (!text) { alert("Pehle Word upload karo!"); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    let y = 20;
    for (let i = 0; i < lines.length; i++) { if (y > 280) { doc.addPage(); y = 20; } doc.text(lines[i], 15, y); y += 7; }
    doc.save(`NEXORA-${fileName || "document"}.pdf`);
    setStatus("✅ PDF Downloaded - No Watermark HD!");
  };

  const clearAll = () => { setPreview(""); setStatus(""); setFileName(""); (window as any).__nexoraText = ""; };

  const card: any = { background: "#fff", borderRadius: 20, padding: 22, border: "1px solid #e8e8ef", boxShadow: "0 4px 24px rgba(0,0,0,.04)", margin: "14px auto", maxWidth: 800, width: "96%" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#111827" };
  const p: any = { fontSize: 12.5, color: "#444", lineHeight: 1.7, marginTop: 8 };
  const btn: any = { width: "100%", padding: 14, background: "linear-gradient(135deg,#111827,#374151)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, marginTop: 12, cursor: "pointer" };

  return (
    <div style={{ background: "#f6f7fb", color: "#111827", minHeight: "100vh", paddingBottom: 20, fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#111827", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800, border: "1px solid #bbf7d0", whiteSpace: "nowrap" }}>● NO WATERMARK HD</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6366f1", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #e0e7ff" }}>✅ DOCX/DOC → PDF • HD • PRIVATE</span>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 10 }}>Word to PDF - DOCX to PDF Free</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>No Watermark HD, Private — Browser me hi convert, Free Forever</p>
      </div>

      <div style={card}>
        <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "2px dashed #6366f1", borderRadius: 16, padding: 30, textAlign: "center", background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", cursor: "pointer", fontWeight: 800 }}>
          📄 Click / Drag Word File (DOCX/DOC) Here
          <input ref={fileRef} type="file" accept=".docx,.doc" hidden onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontWeight: 700, fontSize: 13, color: "#6366f1" }}>{status}</div>
        {preview && <div style={{ marginTop: 15, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f9fafb", fontSize: 13, maxHeight: 300, overflow: "auto", whiteSpace: "pre-wrap" }}>{preview}</div>}
        {preview && <button onClick={downloadPdf} style={btn}>⬇️ Download PDF (HD - No Watermark)</button>}
        {preview && <button onClick={clearAll} style={{ ...btn, background: "#f3f4f6", color: "#111", border: "1px solid #ddd" }}>Clear</button>}
      </div>

      <div style={card}>
        <h2 style={h2}>Why NEXORA Word to PDF?</h2>
        <p style={p}>NEXORA Word to PDF — mammoth + jsPDF browser-based — Word never leaves phone, 100% private, no watermark HD, free forever. Best for resume, assignment DOCX to PDF for job application. Preview text before download. Best for students — Word assignment to PDF, resume DOCX to PDF. Made in India.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6366f1", marginTop: 12 }}>How to Convert Word to PDF - 3 Easy Steps</h3>
        <p style={p}><b>Step 1:</b> Click / Drag Word File — DOCX/DOC<br /><b>Step 2:</b> Preview Text — See extracted text<br /><b>Step 3:</b> Download PDF — HD no watermark.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
          <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private Browser ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Watermark HD ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Paid</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Preview</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Preview Before Download ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Preview</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid After 2</td></tr>
        </tbody></table>
        <p style={p}><b>FAQ:</b> Q: How to convert Word to PDF? A: Upload DOCX, preview, download PDF no watermark.<br />Q: Word to PDF kaise kare? A: Word file upload karo, Download PDF dabao - HD no watermark.<br />Try: <a href="/pdf-to-word" style={{ color: "#6366f1", fontWeight: 700 }}>PDF to Word</a> | <a href="/resume-builder" style={{ color: "#6366f1", fontWeight: 700 }}>Resume Builder</a> | <a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>All Tools</a></p>
      </div>

      <footer style={{ borderTop: "1px solid #e8e8ef", background: "#fff", padding: "36px 0", marginTop: 24, color: "#64748b", fontSize: 13 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8, lineHeight: 1.8 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
          <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about" style={{ color: "#111827" }}>About</a><a href="/contact" style={{ color: "#111827" }}>Contact</a><a href="/privacy" style={{ color: "#111827" }}>Privacy</a><a href="/terms" style={{ color: "#111827" }}>Terms</a></div><div>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳 • No Watermark HD</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← Back to All Tools</a></div></div>
        </div>
      </footer>
    </div>
  );
}
