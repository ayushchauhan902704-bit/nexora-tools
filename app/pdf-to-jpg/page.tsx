"use client";
import { useState, useEffect, useRef } from "react";

declare global { interface Window { pdfjsLib: any; JSZip: any; } }

type Img = { url: string; name: string };

export default function Page() {
  const [status, setStatus] = useState("");
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "PDF to JPG Converter - HD, Free, No Watermark | NEXORA";
    const load = (src: string) => new Promise<void>((res) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script"); s.src = src; s.onload = () => res(); document.head.appendChild(s);
    });
    load("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js").then(() => {
      if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    });
    load("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  }, []);

  const downloadSingle = (dataUrl: string, filename: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const win = window.open();
      if (win) {
        win.document.write(`<meta name="viewport" content="width=device-width"><title>${filename}</title><style>body{margin:0;background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:20px}img{width:100%;max-width:800px;border-radius:12px;margin-top:15px}.tip{background:#10b981;padding:14px;border-radius:12px;font-weight:800;display:inline-block;margin:10px 0}</style><h2>${filename}</h2><div class="tip">👇 Long Press on Image → Add to Photos / Save Image</div><br><img src="${dataUrl}">`);
        win.document.close();
      } else window.location.href = dataUrl;
    } else {
      const a = document.createElement("a"); a.href = dataUrl; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") { alert("PDF select karo!"); return; }
    if (!window.pdfjsLib) { alert("Library load ho rahi hai, 2 sec baad try karo"); return; }
    setLoading(true); setImages([]); setStatus("Converting...");
    try {
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(new Uint8Array(buf)).promise;
      setStatus(`PDF Loaded: ${pdf.numPages} pages - Converting to HD JPG...`);
      const out: Img[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        out.push({ url: dataUrl, name: `page-${i}.jpg` });
        setImages([...out]);
      }
      setStatus(`✅ Done! ${pdf.numPages} pages converted to HD JPG`);
    } catch { setStatus("Error: Try again with smaller PDF"); }
    setLoading(false);
  };

  const downloadAll = async () => {
    if (images.length === 0 || !window.JSZip) return;
    setStatus("Making ZIP... Please wait");
    const zip = new window.JSZip();
    images.forEach(o => zip.file(o.name, o.url.split(",")[1], { base64: true }));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `NEXORA-JPGs-${images.length}-pages.zip`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    setStatus(`✅ ZIP Downloaded - ${images.length} JPGs`);
  };

  const clearAll = () => { setImages([]); setStatus(""); };

  const card: any = { background: "#fff", borderRadius: 20, padding: 22, border: "1px solid #e8e8ef", margin: "20px auto", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#111827" };
  const p: any = { fontSize: 12.5, color: "#444", lineHeight: 1.7, marginTop: 8 };
  const badge: any = { display: "inline-flex", background: "#eef2ff", color: "#4f46e5", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #e0e7ff" };
  const btn: any = { width: "100%", padding: 14, background: "linear-gradient(135deg,#111827,#374151)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, marginTop: 12, cursor: "pointer" };

  return (
    <div style={{ background: "#f6f7fb", color: "#111827", minHeight: "100vh", paddingBottom: 40, fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#111827", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...badge, background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9", fontSize: 10, whiteSpace: "nowrap" }}>● PRIVATE • NO WATERMARK</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6366f1", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
          <span style={badge}>📄 PDF TO IMAGE • HD 150DPI • NO WATERMARK HD</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, marginTop: 12, lineHeight: 1.2 }}>PDF to JPG - HD Images</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Convert All PDF Pages to JPG, JPEG — Free, Private, HD 150DPI, No Watermark</p>
        </div>

        <div style={{ width: "100%", margin: "16px auto", background: "#fff", borderRadius: 24, padding: 20, boxShadow: "0 10px 40px rgba(0,0,0,.06)", border: "1px solid #e8e8ef" }}>
          <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "2px dashed #6366f1", borderRadius: 16, padding: 32, textAlign: "center", background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", cursor: "pointer", fontWeight: 800 }}>
            <div style={{ fontSize: 28 }}>📄</div>
            <span style={{ display: "block", marginTop: 8 }}>Click / Drag PDF Here to Convert to JPG</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1" }}>All Pages → HD JPG • Private • No Watermark</span>
            <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontWeight: 700, fontSize: 13, color: "#6366f1" }}>{loading ? "⏳ " : ""}{status}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {images.map((im, i) => (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", background: "#f9fafb", textAlign: "center", padding: 10 }}>
                <img src={im.url} alt={`Page ${i + 1}`} style={{ width: "100%", borderRadius: 8 }} />
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>Page {i + 1} - HD 150DPI</div>
                <button onClick={() => downloadSingle(im.url, im.name)} style={{ marginTop: 8, fontSize: 11, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontWeight: 700, cursor: "pointer", width: "100%" }}>Download Page {i + 1}</button>
              </div>
            ))}
          </div>

          {images.length > 0 && <button onClick={downloadAll} style={{ ...btn, background: "linear-gradient(135deg,#10b981,#059669)" }}>⬇️ Download All JPGs (HD)</button>}
          {images.length > 0 && <button onClick={clearAll} style={{ ...btn, background: "#f3f4f6", color: "#111", border: "1px solid #e5e7eb" }}>Clear All</button>}
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA PDF to JPG?</h2>
          <p style={p}>NEXORA PDF to JPG — All pages HD 150DPI (scale 2x) — clear no blur, no watermark, 100% private — PDF never leaves phone, pdf.js browser-based, free forever. Unlike others with low quality 72 DPI, NEXORA gives HD 150DPI best for Aadhaar, PAN, certificate to JPG for printing, form upload. Single page download or Download All JPGs at once. Best for students — PDF notes to JPG images, Aadhaar PDF to JPG. Made in India.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6366f1", marginTop: 12 }}>How to Convert PDF to JPG - 3 Easy Steps</h3>
          <p style={p}><b>Step 1:</b> Click / Drag PDF — Upload PDF file<br /><b>Step 2:</b> Auto Convert — All pages convert to HD JPG 150DPI<br /><b>Step 3:</b> Download — Single page or Download All JPGs HD.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6366f1", marginTop: 12 }}>Features</h3>
          <ul style={{ ...p, paddingLeft: 18 }}><li>✅ All Pages to HD JPG — 150DPI Clear No Blur</li><li>✅ Single + Download All JPGs — At Once</li><li>✅ 100% Private — pdf.js Browser, PDF Never Leaves Phone</li><li>✅ No Watermark HD, Free Forever, No Limit</li><li>✅ Works on iPhone, Android, Laptop — No App</li></ul>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Quality</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>HD 150DPI 2x Scale ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Low 72 DPI Blur</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private Browser ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Download</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Single + All At Once ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Single Only</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Watermark HD ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Paid</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever Unlimited ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid After 2</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ - PDF to JPG</h2>
          <p style={p}>
            <b>Q: How to convert PDF to JPG?</b><br />A: Upload PDF, all pages convert to HD JPG 150DPI, download single or all.<br /><br />
            <b>Q: Is it private and free?</b><br />A: Yes, 100% private, PDF never leaves phone, browser conversion, free forever no watermark.<br /><br />
            <b>Q: What is DPI?</b><br />A: HD 150DPI — 2x scale, clear for Aadhaar PAN print, no blur.<br /><br />
            <b>Q: PDF to JPG kaise kare?</b><br />A: PDF upload karo, sab pages JPG ban jayenge, Download All dabao.<br /><br />
            <b>Try Also:</b> <a href="/jpg-to-pdf" style={{ color: "#6366f1", fontWeight: 700 }}>JPG to PDF</a> | <a href="/pdf-to-word" style={{ color: "#6366f1", fontWeight: 700 }}>PDF to Word</a> | <a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>All Tools</a>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", background: "#fff", padding: "36px 0", marginTop: 24, color: "#64748b", fontSize: 13 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
          <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about" style={{ color: "#111827" }}>About</a><a href="/contact" style={{ color: "#111827" }}>Contact</a><a href="/privacy" style={{ color: "#111827" }}>Privacy</a><a href="/terms" style={{ color: "#111827" }}>Terms</a></div><div>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳 • HD No Watermark</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← Back to All Tools</a></div></div>
        </div>
      </footer>
    </div>
  );
}
