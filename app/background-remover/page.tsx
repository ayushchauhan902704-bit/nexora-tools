"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [bgColor, setBgColor] = useState("transparent");
  const [status, setStatus] = useState("Upload a photo to start");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("📁 Click or Drag Photo Here");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);

  const redraw = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    if (bgColor === "transparent") ctx.clearRect(0, 0, canvas.width, canvas.height);
    else { ctx.fillStyle = bgColor === "white" ? "#ffffff" : bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(img, 0, 0);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadText("⏳ Loading AI...");
    setShowPreview(false);
    setStatus("⏳ Downloading AI model...");
    setProgress(10);
    setIsProcessing(true);
    try {
      const mod = await import("@imgly/background-removal");
      const removeBg = mod.default;
      const blob = await removeBg(file, {
        progress: (_key: string, current: number, total: number) => {
          const pct = Math.round((current / total) * 100);
          setProgress(pct);
          setStatus(`🤖 Processing - ${pct}%`);
        },
      });
      blobRef.current = blob;
      setProgress(100);
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setTimeout(() => { redraw(); }, 50);
        setShowPreview(true);
        setUploadText("✅ Background Removed");
        setStatus("✅ Done! Choose background color");
        setInfo(`${img.naturalWidth}x${img.naturalHeight}`);
        setIsProcessing(false);
      };
      img.src = url;
    } catch (err: any) {
      setStatus("❌ Error: " + err.message);
      setIsProcessing(false);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !blobRef.current) { alert("Please upload photo first"); return; }
    canvas.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url; a.download = `nexora-bg-${Date.now()}.png`;
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }, "image/png", 1);
  };

  const colors = [
    { label: "Transparent", val: "transparent" },
    { label: "White - Passport", val: "white" },
    { label: "Blue - Visa", val: "#6366f1" },
    { label: "Red", val: "#ef4444" },
  ];

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#111", paddingBottom: 20 }}>
      <nav style={{ maxWidth: 900, margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px" }}>
        <a href="/" style={{ fontWeight: 900, textDecoration: "none", color: "#111" }}>🧮 NEXORA Tools</a>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>● 89K+ USERS • PRIVATE</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>✅ No Watermark HD</span>
        </div>
      </nav>

      <div style={{ textAlign: "center", padding: "10px 20px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.5px" }}>Background Remover</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Remove background in 1 second - Transparent, White, Blue, Red — No Watermark, HD, Private</p>
        <div style={{ marginTop: 8 }}><span style={{ fontSize: 11, fontWeight: 700, background: "#ede9fe", color: "#5b21b6", padding: "5px 10px", borderRadius: 20 }}>📸 FREE • PRIVATE • HD • NO WATERMARK</span></div>
      </div>

      <div style={{ width: "96%", maxWidth: 800, margin: "10px auto", background: "white", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
        <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "2px dashed #6366f1", borderRadius: 16, padding: 30, textAlign: "center", background: "#eef2ff", cursor: "pointer", fontWeight: 800 }}>
          <span>{uploadText}</span>
          <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
        {isProcessing && <div style={{ width: "100%", height: 6, background: "#e5e7eb", borderRadius: 10, marginTop: 12, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, background: "#6366f1", transition: "0.3s" }} /></div>}
        <div style={{ fontSize: 12, fontWeight: 800, textAlign: "center", marginTop: 10, color: "#6366f1" }}>{status}</div>
        <div style={{ textAlign: "center", marginTop: 15 }}>
          {colors.map((c) => (
            <button key={c.val} onClick={() => { setBgColor(c.val); setTimeout(() => redraw(), 50); }} style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 20, background: bgColor === c.val ? "#111827" : "#fff", color: bgColor === c.val ? "#fff" : "#111", fontWeight: 700, fontSize: 12, cursor: "pointer", margin: 5 }}>{c.label}</button>
          ))}
        </div>
        {showPreview && (
          <div style={{ textAlign: "center" }}>
            <canvas ref={canvasRef} style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #eee", marginTop: 12 }} />
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{info}</div>
            <button onClick={download} style={{ width: "100%", padding: 14, background: "#111827", color: "white", border: "none", borderRadius: 12, fontWeight: 800, marginTop: 12, cursor: "pointer" }}>⬇️ Download HD PNG</button>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: 24, padding: 22, border: "1px solid #e5e7eb", margin: "18px auto", maxWidth: 800, width: "96%", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
        <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA No.1 Background Remover in World?</h2>
        <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7, marginTop: 6 }}>Unlike remove.bg, slazzer with limits, watermark and paid plans, NEXORA Background Remover is 100% free forever, no watermark, HD PNG, 100% private — your photo never leaves your phone, browser-based AI processing, no upload to server. Remove background in 1 second automatically. Choose Transparent for e-commerce products, White for passport size photo, Blue for visa, Red for official documents. Download HD PNG original quality, no blur. Unlike other tools that reduce quality, NEXORA keeps HD. Made in India, trusted by 89k+ users worldwide, works on iPhone, Android, Laptop, offline. Best alternative to remove.bg, slazzer, removal.ai, Adobe. Fast in 1 sec, Made for India, Made for World.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#6366f1" }}>How to Remove Background - 3 Easy Steps</h3>
        <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7 }}><b>Step 1:</b> Click or Drag your photo — JPG, PNG, WebP<br /><b>Step 2:</b> AI automatically removes background in 1 second — wait for 100%<br /><b>Step 3:</b> Choose background — Transparent / White / Blue / Red and click Download HD PNG.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#6366f1" }}>Features - Why World Loves NEXORA</h3>
        <ul style={{ paddingLeft: 18, fontSize: 12.5, color: "#475569", lineHeight: 1.7 }}><li>✅ 100% Free, No Watermark, HD PNG Original Quality</li><li>✅ 100% Private — Photo never leaves phone, Browser AI</li><li>✅ 4 Backgrounds — Transparent, White Passport, Blue Visa, Red</li><li>✅ Auto AI Detection — Hair, Clothes, Product accurate cutout</li><li>✅ Works on iPhone, Android, Laptop — No App Needed</li><li>✅ Fast 1 Second, Made in India, 89k+ Users Worldwide</li></ul>
      </div>

      <div style={{ background: "white", borderRadius: 24, padding: 22, border: "1px solid #e5e7eb", margin: "18px auto", maxWidth: 800, width: "96%" }}>
        <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
          <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>remove.bg / Others ❌</th></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Limit</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Unlimited ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>1-2 Free Only</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Paid</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Quality</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>HD PNG ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Low Quality Free</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>$9+ / Month</td></tr>
        </tbody></table>
      </div>

      <div style={{ background: "white", borderRadius: 24, padding: 22, border: "1px solid #e5e7eb", margin: "18px auto", maxWidth: 800, width: "96%" }}>
        <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - Background Remover - Google Loves This</h2>
        <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7, marginTop: 6 }}><b>Q: Is Background Remover free and private?</b><br />A: Yes, 100% free, no watermark, unlimited. Photo never leaves phone, browser AI.<br /><br /><b>Q: Does it work for passport photo?</b><br />A: Yes, upload photo, remove background, select White for passport, Blue for visa.<br /><br /><b>Q: HD quality?</b><br />A: Yes, HD PNG original quality, no watermark, no blur.<br /><br /><b>Q: Does photo go to server?</b><br />A: No, 100% private, browser processing.<br /><br /><b>Q: iPhone support?</b><br />A: Yes, works on iPhone, Android, Laptop — long press download if needed.</p>
        <p style={{ marginTop: 12, fontSize: 12.5 }}>Try Also: <a href="/passport-photo-maker" style={{ color: "#6366f1", fontWeight: 700 }}>Passport Photo Maker</a> | <a href="/image-compressor" style={{ color: "#6366f1", fontWeight: 700 }}>Image Compressor</a> | <a href="/image-to-pdf" style={{ color: "#6366f1", fontWeight: 700 }}>Image to PDF</a> | <a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>All Tools</a></p>
      </div>

      <div style={{ maxWidth: 800, margin: "20px auto", width: "96%", background: "white", borderRadius: 24, padding: 20, border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, fontSize: 13, lineHeight: 1.8, color: "#64748b" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div>
            <div style={{ marginTop: 8 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📱 Phone: <a href="tel:+919389641559" style={{ color: "#6366f1", fontWeight: 700 }}>+91 9389641559</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div>
          </div>
          <div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}>
              <a href="/about" style={{ color: "#111827", textDecoration: "none" }}>About</a>
              <a href="/contact" style={{ color: "#111827", textDecoration: "none" }}>Contact</a>
              <a href="/privacy" style={{ color: "#111827", textDecoration: "none" }}>Privacy</a>
              <a href="/terms" style={{ color: "#111827", textDecoration: "none" }}>Terms</a>
              <a href="/disclaimer" style={{ color: "#111827", textDecoration: "none" }}>Disclaimer</a>
              <a href="/sitemap.xml" style={{ color: "#111827", textDecoration: "none" }}>Sitemap</a>
            </div>
            <div>© 2026 NEXORA Tools - Background Remover</div>
            <div>Made in India 🇮🇳 | 89k+ Users | Free tools. Simple solutions.</div>
            <div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← All Tools</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
