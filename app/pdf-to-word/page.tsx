"use client";
import { useState, useEffect, useRef } from "react";

declare global { interface Window { pdfjsLib: any; } }

export default function Page() {
  const [text, setText] = useState("");
  const [pages, setPages] = useState(0);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
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
    if (!f.name.toLowerCase().endsWith(".pdf")) { alert("Sirf PDF daalo bhai!"); return; }
    if (!window.pdfjsLib) { alert("Library load ho rahi hai, 2 sec baad dobara try karo"); return; }
    setFileName(f.name);
    setLoading(true);
    setStatus("Reading PDF...");
    setText(""); setImages([]); setPages(0);
    try {
      const url = URL.createObjectURL(f);
      const pdf = await window.pdfjsLib.getDocument(url).promise;
      let full = "";
      const imgs: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i);
        const c = await p.getTextContent();
        full += c.items.map((s: any) => s.str).join(" ") + "\n\n";
        // Har page ki photo bhi banao - Scanned PDF ke liye
        const viewport = p.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await p.render({ canvasContext: ctx, viewport }).promise;
        imgs.push(canvas.toDataURL("image/jpeg", 0.8));
        setStatus(`Reading... Page ${i} / ${pdf.numPages}`);
      }
      setText(full.trim());
      setImages(imgs);
      setPages(pdf.numPages);
      if (full.trim().length < 20) {
        setStatus(`Ye Photo wali (Scanned) PDF hai! Text nahi hai, isliye neeche Photos dikh rahe hai.`);
      } else {
        setStatus(`Ready! ${pdf.numPages} pages loaded - Neeche preview dekh lo, phir Download / Copy dabao`);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      setStatus("Error: PDF khul nahi rahi. Dusri PDF try karo.");
    }
  };

  const copyText = async () => {
    if (!text.trim()) { alert("Is PDF me copy karne layak text nahi hai, ye Photo wali PDF hai. Neeche se Photo Download karo."); return; }
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadDoc = () => {
    if (!text.trim()) { alert("Is PDF me text nahi hai, ye Photo wali PDF hai. Neeche Photo Download karo."); return; }
    const blob = new Blob([text], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `NEXORA-${fileName.replace(".pdf", "")}.doc`;
    a.click();
    setStatus("Downloaded! DOC file ready - Word me kholo");
  };

  const downloadTxt = () => {
    if (!text.trim()) { alert("Is PDF me text nahi hai."); return; }
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `NEXORA-${fileName.replace(".pdf", "")}.txt`;
    a.click();
  };

  const downloadImage = (img: string, idx: number) => {
    const a = document.createElement("a");
    a.href = img;
    a.download = `NEXORA-Page-${idx + 1}.jpg`;
    a.click();
  };

  const downloadAllImages = () => {
    images.forEach((img, i) => setTimeout(() => downloadImage(img, i), i * 300));
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
          <h1 style={{ fontSize: 26, fontWeight: 900, marginTop: 10 }}>PDF to Word - Free & Fast</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Text wali PDF ho to Text niklega, Photo wali PDF ho to Photo niklega - Dono kaam karega</p>

          <input ref={fileRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files?.[0])} />
          <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }} style={{ marginTop: 12, border: "3px dashed #10b981", borderRadius: 20, padding: "36px 16px", textAlign: "center", background: "linear-gradient(135deg,#f0fdf4,#f0fdfa)", cursor: "pointer" }}>
            <div style={{ fontSize: 32 }}>📄</div>
            <div style={{ fontWeight: 900, marginTop: 6 }}>Click or Drop PDF Here</div>
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4 }}>Any PDF up to 50MB • Instant • Private</div>
            {fileName && <div style={{ fontSize: 12, marginTop: 8, background: "#fff", padding: "6px 10px", borderRadius: 999, display: "inline-block", border: "1px solid #d1fae5" }}>📄 {fileName} • {pages} pages</div>}
          </div>

          {status && <p style={{ marginTop: 12, textAlign: "center", fontWeight: 700, color: "#059669", fontSize: 13 }}>{loading ? "⏳ " : "✅ "}{status}</p>}

          {/* BUTTONS - Hamesha dikhenge jab file aa jaye */}
          {fileName && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={downloadDoc} style={{ flex: 1, padding: 15, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#10b981,#14b8a6)", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>⬇️ Word Download →</button>
                <button onClick={copyText} style={{ padding: "15px 18px", borderRadius: 12, background: "#171725", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{copied ? "✅ Copied!" : "📋 Copy Text"}</button>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={downloadTxt} style={{ flex: 1, padding: 12, borderRadius: 12, background: "#fff", color: "#059669", border: "1.5px solid #10b981", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>📄 TXT Download</button>
                <button onClick={downloadAllImages} style={{ flex: 1, padding: 12, borderRadius: 12, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>🖼️ Sab Photos Download</button>
              </div>
            </div>
          )}

          {/* TEXT PREVIEW - Agar text hai to */}
          {text && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: 13 }}>👀 Preview - Text sahi nikla?</b>
                <span style={{ fontSize: 11, color: "#888" }}>{text.length} characters • {text.split(" ").length} words</span>
              </div>
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, marginTop: 8, fontSize: 12, lineHeight: 1.7, maxHeight: 220, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text.slice(0, 3000)}{text.length > 3000 ? "\n\n... (Preview me pehle 3000 characters dikh rahe hai, Download me pura aayega)" : ""}</div>
            </div>
          )}

          {/* PHOTO PREVIEW - Agar Photo wali PDF hai to */}
          {images.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <b style={{ fontSize: 13 }}>🖼️ PDF ke Pages - Photo ke roop me ({images.length} pages)</b>
              <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Ye Photo wali PDF hai, isliye text nahi nikla. Neeche har page ki photo hai, uspe click karke Download karo.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                    <img src={img} style={{ width: "100%", display: "block" }} alt={`Page ${i + 1}`} />
                    <button onClick={() => downloadImage(img, i)} style={{ width: "100%", padding: 10, border: "none", background: "#f0fdf4", color: "#059669", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>⬇️ Page {i + 1} Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 14, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6 }}><b>⚠️ Note:</b> Text wali PDF me text niklega, Photo wali (scanned) PDF me photo niklega. Dono ke liye yehi tool hai.</div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10 }}>📧 ayushchauhan902704@gmail.com<br />📍 Dehradun, Uttarakhand, India</div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳</div></div></div>
        </div>
      </footer>
    </div>
  );
}
