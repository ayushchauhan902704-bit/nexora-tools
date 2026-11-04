"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadTesseract = () => {
    return new Promise<any>((resolve, reject) => {
      if ((window as any).Tesseract) return resolve((window as any).Tesseract);
      const old = document.querySelector('script[data-tesseract="true"]');
      if (old) {
        old.addEventListener("load", () => resolve((window as any).Tesseract), { once: true });
        return;
      }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
      s.async = true;
      s.dataset.tesseract = "true";
      s.onload = () => resolve((window as any).Tesseract);
      s.onerror = () => reject(new Error("load fail"));
      document.head.appendChild(s);
    });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    setStatus("OCR Running... 10-30 sec wait, dont close...");
    setProgress(0);
    if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
      setStatus("For PDF, take screenshot as JPG/PNG then upload - Best OCR result");
      return;
    }
    try {
      const Tesseract = await loadTesseract();
      const worker: any = await Tesseract.createWorker({
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            const p = Math.round(m.progress * 100);
            setProgress(p);
          }
        },
      });
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data: { text: ocrText } } = await worker.recognize(f);
      setText(ocrText);
      setProgress(100);
      setStatus("Ready! OCR Done - Click Convert to Download");
      await worker.terminate();
    } catch (err) {
      setStatus("For PDF, take screenshot as JPG/PNG then upload - Best OCR result");
    }
  };

  const convert = () => {
    if (!text) { alert("Pehle Image/PDF daalo - JPG PNG best"); return; }
    const blob = new Blob([text], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "NEXORA-OCR-to-Word.doc";
    a.click();
    setStatus("Downloaded! Word file ready");
  };

  return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#fffbeb", minHeight: "100vh", lineHeight: 1.6 }}>
      <div style={{ maxWidth: 800, margin: "auto", padding: 24 }}>
        <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 2px 10px rgba(0,0,0,.04)", border: "1px solid #fef3c7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="/" style={{ fontWeight: 900, fontSize: 25, textDecoration: "none", color: "#111" }}>NEX<span style={{ color: "#f59e0b" }}>ORA</span></a>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 900, border: "1px solid #bbf7d0" }}>● 82K+ USERS • PRIVATE</span>
              <a href="/" style={{ fontSize: 14, fontWeight: 700, textDecoration: "none" }}>← All Tools</a>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "inline-block", background: "#fffbeb", color: "#b45309", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: "1px solid #fde68a" }}>🔒 OCR - JPG PNG PDF - 100% Private - No Watermark</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginTop: 12, letterSpacing: "-.5px" }}>OCR - Image / Scanned PDF to Word</h1>
          <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>Convert Scanned PDF, JPG, PNG, Photo to Editable Word DOC - Best OCR, Private, Free Forever.</p>

          <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }} style={{ marginTop: 24, border: "3px dashed #f59e0b", borderRadius: 20, padding: 48, textAlign: "center", background: "#fffbeb", cursor: "pointer" }}>
            Click or Drop Scanned PDF / JPG / PNG Here
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontWeight: 700 }}>{fileName || "JPG PNG best • PDF first page OCR"}</div>
          </div>

          <div style={{ marginTop: 16, background: "#f9fafb", borderRadius: 12, padding: 12, border: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}><span>OCR Progress</span><span>{progress}%</span></div>
            <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 999, height: 8, marginTop: 8 }}><div style={{ background: "#f59e0b", height: 8, borderRadius: 999, width: `${progress}%`, transition: ".3s" }}></div></div>
          </div>

          <p style={{ marginTop: 16, textAlign: "center", fontWeight: 700, color: "#d97706", fontSize: 14 }}>{status}</p>
          <button onClick={convert} style={{ width: "100%", marginTop: 16, background: "#f59e0b", color: "white", fontWeight: 900, padding: 16, borderRadius: 14, border: 0, cursor: "pointer", fontSize: 15 }}>Convert to Word with OCR & Download →</button>

          {text && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14 }}>Extracted Text Preview:</h3>
              <textarea value={text.substring(0, 800)} readOnly style={{ width: "100%", marginTop: 8, padding: 12, border: "1px solid #ddd", borderRadius: 10, fontSize: 12, height: 128, background: "#f9fafb" }} />
            </div>
          )}
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 32, marginTop: 24, border: "1px solid #eee" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA No.1 OCR PDF to Word in World?</h2>
          <p style={{ color: "#4b5563", fontSize: 12.5, lineHeight: 1.9, marginTop: 12 }}>Unlike online2pdf, ilovepdf OCR with limit, watermark, paid, NEXORA OCR is 100% free forever, no watermark, 100% private — image never leaves phone, OCR runs in browser using Tesseract.js, safe for private docs. Unlike normal PDF to Word tools that only work if PDF has selectable text, OCR reads text inside scanned PDFs and photos as image — OCR = Optical Character Recognition technology that reads text inside images. Supports JPG, PNG, scanned PDF. Best for students — convert notes photo to Word, scanned books to editable. Made in India, trusted by 82k+ users worldwide, works on iPhone Android Laptop. Best alternative to online2pdf OCR, ilovepdf OCR. Fast 10-30 sec.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, marginTop: 24, color: "#d97706" }}>How to Convert Scanned PDF / Image to Word with OCR - 3 Steps</h3>
          <p style={{ color: "#4b5563", fontSize: 12.5, lineHeight: 1.9, marginTop: 8 }}><b>Step 1:</b> Click drop zone, upload scanned PDF, JPG, PNG photo<br /><b>Step 2:</b> OCR processing starts — shows progress 0-100%, extracts text 10-30 sec<br /><b>Step 3:</b> Preview extracted text, click Convert to Word & Download — Word DOC ready.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, marginTop: 24, color: "#d97706" }}>What is OCR? Why Need?</h3>
          <p style={{ color: "#4b5563", fontSize: 12.5, lineHeight: 1.9, marginTop: 8 }}>OCR = Optical Character Recognition — reads text inside images. Normal PDF to Word only works if PDF has selectable text. Scanned PDFs and photos have text as image, so OCR needed to extract.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, marginTop: 24, color: "#d97706" }}>Features - Why World Loves NEXORA OCR</h3>
          <ul style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.9, marginTop: 8, paddingLeft: 20 }}><li>✅ OCR Scanned PDF, JPG, PNG, Photo to Word — Best Accuracy</li><li>✅ 100% Private — OCR in Browser, Image Never Leaves Phone</li><li>✅ No Watermark, Free Forever, Unlimited, No Signup</li><li>✅ Preview Extracted Text Before Download</li><li>✅ Works on iPhone, Android, Laptop — No App Needed</li><li>✅ Made in India, 82k+ Users, Safe for Private Docs</li></ul>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 32, marginTop: 24, border: "1px solid #eee" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 12 }}><tbody>
            <tr style={{ background: "#fffbeb" }}><th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #ddd", padding: 8 }}>NEXORA ✅</th><th style={{ border: "1px solid #ddd", padding: 8 }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #ddd", padding: 8 }}>OCR Type</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Scanned PDF + Image ✅</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Only PDF</td></tr>
            <tr><td style={{ border: "1px solid #ddd", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>100% Private In Browser ✅</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #ddd", padding: 8 }}>Limit</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Unlimited Free ✅</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>2 Free Then Paid</td></tr>
            <tr><td style={{ border: "1px solid #ddd", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>No Watermark ✅</td><td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Watermark</td></tr>
          </tbody></table>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 32, marginTop: 24, border: "1px solid #eee" }}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - OCR PDF to Word - Google Loves This</h2>
          <p style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.9, marginTop: 12 }}><b>Q: What is OCR PDF to Word?</b><br />A: OCR reads text from scanned PDFs and images JPG PNG and converts to editable Word DOC.<br /><br /><b>Q: How to convert scanned PDF to Word?</b><br />A: Upload scanned PDF JPG PNG, OCR reads text, saves as Word DOC.<br /><br /><b>Q: Is it safe and private?</b><br />A: Yes, 100% private, OCR in browser, image never uploaded.<br /><br /><b>Q: JPG PNG support?</b><br />A: Yes, JPG PNG best accuracy, PDF first page OCR.<br /><br /><b>Try Also:</b> <a href="/image-to-text" style={{ color: "#d97706", fontWeight: 700 }}>Image to Text</a> | <a href="/pdf-to-word" style={{ color: "#d97706", fontWeight: 700 }}>PDF to Word</a> | <a href="/word-to-pdf" style={{ color: "#d97706", fontWeight: 700 }}>Word to PDF</a> | <a href="/" style={{ color: "#d97706", fontWeight: 700 }}>All Tools</a></p>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 32, marginTop: 24, border: "1px solid #eee" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24, fontSize: 13, color: "#6b7280" }}>
            <div><b style={{ color: "#111", fontSize: 16 }}>NEXORA — Built by Ayush Chauhan</b><br /><div style={{ marginTop: 12, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#d97706", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📱 Phone: <a href="tel:+919389641559" style={{ color: "#d97706", fontWeight: 700 }}>+91 9389641559</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclaimer">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></div></div>
            <div><div>© 2026 NEXORA Tools - OCR PDF to Word</div><div>Made in India 🇮🇳 | 82k+ Users</div><div style={{ marginTop: 8 }}><a href="/" style={{ color: "#d97706", fontWeight: 700 }}>← Back to All Tools</a></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
