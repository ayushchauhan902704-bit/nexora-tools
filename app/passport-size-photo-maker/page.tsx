"use client";
import { useState, useEffect, useRef } from "react";

const SIZES = [
  { label: "Passport 3.5x4.5 cm", sub: "413x531 - HD", w: 413, h: 531, kb: 0 },
  { label: "20KB - SSC Form", sub: "For SSC, Railway", w: 200, h: 230, kb: 20 },
  { label: "50KB - UPSC Form", sub: "For UPSC, Govt", w: 300, h: 350, kb: 50 },
  { label: "Visa 2x2 Inch", sub: "US Visa 600x600", w: 600, h: 600, kb: 0 },
  { label: "Stamp Size", sub: "2.5x3.5 cm", w: 300, h: 400, kb: 0 },
  { label: "1x1 Inch", sub: "1x1 Photo", w: 400, h: 400, kb: 0 },
];

export default function Page() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [sel, setSel] = useState(0);
  const [status, setStatus] = useState("");
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Passport Photo Maker - 20KB, 50KB, 3.5x4.5cm, Visa 2x2 Free | NEXORA";
  }, []);

  const processImage = (image: HTMLImageElement, idx: number) => {
    const s = SIZES[idx];
    const c = document.createElement("canvas");
    c.width = s.w; c.height = s.h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
    const imgRatio = image.width / image.height;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sW = image.width, sH = image.height;
    if (imgRatio > canvasRatio) { sH = image.height; sW = sH * canvasRatio; sx = (image.width - sW) / 2; }
    else { sW = image.width; sH = sW / canvasRatio; sy = (image.height - sH) / 2; }
    ctx.drawImage(image, sx, sy, sW, sH, 0, 0, c.width, c.height);
    setCanvas(c);
    setPreview(c.toDataURL("image/jpeg", 0.9));
    setStatus("✅ Ready! Download karo");
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setStatus("⏳ Loading...");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => { setImg(image); processImage(image, sel); };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const selectSize = (idx: number) => {
    setSel(idx);
    if (img) processImage(img, idx);
  };

  const download = async () => {
    if (!canvas) { alert("Pehle photo upload karo"); return; }
    const s = SIZES[sel];
    setStatus("⏳ Compressing...");
    let finalCanvas = canvas;
    let blob: Blob | null = null;
    const toBlob = (c: HTMLCanvasElement, q: number) => new Promise<Blob | null>(res => c.toBlob(res, "image/jpeg", q));

    if (s.kb > 0) {
      for (let q = 0.9; q >= 0.1; q -= 0.1) {
        blob = await toBlob(finalCanvas, q);
        if (blob && blob.size / 1024 <= s.kb * 1.2) break;
      }
      if (blob && blob.size / 1024 > s.kb * 1.5) {
        const smaller = document.createElement("canvas");
        smaller.width = finalCanvas.width * 0.8; smaller.height = finalCanvas.height * 0.8;
        const sctx = smaller.getContext("2d")!;
        sctx.fillStyle = "#fff"; sctx.fillRect(0, 0, smaller.width, smaller.height);
        sctx.drawImage(finalCanvas, 0, 0, smaller.width, smaller.height);
        finalCanvas = smaller;
        blob = await toBlob(finalCanvas, 0.7);
      }
    } else {
      blob = await toBlob(finalCanvas, 0.9);
    }
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const fileName = `NEXORA-${s.w}x${s.h}${s.kb ? "-" + s.kb + "KB" : ""}.jpg`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const win = window.open("about:blank", "_blank");
      if (win) { win.location.href = url; setStatus("📱 New Tab khula → Share → Save to Photos"); }
      else window.location.href = url;
    } else {
      const a = document.createElement("a");
      a.href = url; a.download = fileName;
      document.body.appendChild(a); a.click(); a.remove();
      setStatus(`⬇️ Downloaded: ${fileName} (${(blob.size / 1024).toFixed(1)}KB)`);
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const card: any = { background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #e8e8ef", margin: "20px auto", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#111827" };
  const p: any = { fontSize: 12.5, color: "#444", lineHeight: 1.7, marginTop: 8 };
  const badge: any = { display: "inline-flex", background: "#eef2ff", color: "#4f46e5", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #e0e7ff" };

  return (
    <div style={{ background: "#f7f8fc", color: "#111827", minHeight: "100vh", paddingBottom: 40, fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif" }}>
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
        <div style={{ textAlign: "center", padding: "24px 0 10px" }}>
          <span style={badge}>📸 NO WATERMARK HD • SSC UPSC VISA • PRIVATE</span>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.8, marginTop: 12, lineHeight: 1.2 }}>Passport Size Photo Maker</h1>
          <p style={{ fontSize: 13, marginTop: 8, color: "#64748b" }}>20KB, 50KB, 3.5x4.5cm, 2x2 Visa, Stamp Size • 1 Click Ready • Private, Free</p>
        </div>

        <div style={{ width: "100%", margin: "16px auto 0", background: "#fff", borderRadius: 24, padding: 20, boxShadow: "0 10px 40px rgba(0,0,0,.06)", border: "1px solid #e8e8ef" }}>
          <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #6366f1", borderRadius: 16, padding: 32, textAlign: "center", background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", cursor: "pointer", fontWeight: 800 }}>
            <div style={{ fontSize: 32 }}>📁</div>
            <span style={{ display: "block", marginTop: 8 }}>Click to Upload Photo (JPG/PNG)</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", marginTop: 4, display: "block" }}>White background auto • HD Quality • Exact KB</span>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          </div>

          {preview && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <img src={preview} alt="Preview" style={{ maxWidth: 220, borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,.08)" }} />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700 }}>{SIZES[sel].w}x{SIZES[sel].h}px | {SIZES[sel].kb > 0 ? SIZES[sel].kb + "KB Target" : "HD Quality"} | White BG</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
            {SIZES.map((s, i) => (
              <button key={i} onClick={() => selectSize(i)} style={{ padding: 12, border: "1.5px solid #e5e7eb", borderRadius: 12, background: sel === i ? "#111827" : "#fff", color: sel === i ? "#fff" : "#111827", cursor: "pointer", fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>
                {s.label}<br /><span style={{ fontSize: 10, fontWeight: 600, color: sel === i ? "#c7d2fe" : "#6366f1" }}>{s.sub}</span>
              </button>
            ))}
          </div>

          {preview && <button onClick={download} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, marginTop: 16, cursor: "pointer", fontSize: 15 }}>⬇️ Download Passport Photo</button>}
          <div style={{ textAlign: "center", marginTop: 12, fontWeight: 700, fontSize: 13, color: "#10b981" }}>{status}</div>
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA Passport Photo Maker?</h2>
          <p style={p}>Unlike other apps with watermark, ads, upload to server, NEXORA Passport Photo Maker is 100% private - photo never leaves your phone, browser-based, no watermark, HD quality, exact KB for Govt forms. Make 20KB for SSC, 50KB for UPSC, 3.5x4.5cm for passport, Visa 2x2 for US Visa in 1 click. Auto white background. Best for SSC, UPSC, Railway, Bank forms. Made in India.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6366f1", marginTop: 12 }}>How to Make Passport Photo - 3 Steps</h3>
          <p style={p}><b>Step 1:</b> Upload Photo - Click and select your photo<br /><b>Step 2:</b> Select Size - Choose 3.5x4.5, 20KB, 50KB, Visa<br /><b>Step 3:</b> Download - HD photo ready for govt form.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Watermark ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Private Browser ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Upload to Server</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Exact KB</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>20KB 50KB Exact ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Random KB</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ</h2>
          <p style={p}>
            <b>Q: How to make 20KB photo?</b><br />A: Select 20KB SSC button, upload photo, download - auto 20KB.<br /><br />
            <b>Q: How to make 50KB photo for UPSC?</b><br />A: Select 50KB UPSC button, upload photo, download - auto 50KB.<br /><br />
            <b>Q: Is it free and private?</b><br />A: Yes, 100% free, private, photo never leaves phone, no watermark.<br /><br />
            <b>Try Also:</b> <a href="/jpg-to-pdf" style={{ color: "#6366f1", fontWeight: 700 }}>JPG to PDF</a> | <a href="/loan-emi-calculator" style={{ color: "#6366f1", fontWeight: 700 }}>Loan EMI Calculator</a> | <a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>All Tools</a>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", background: "#fff", padding: "36px 0", marginTop: 24, color: "#64748b", fontSize: 13 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, India</div></div>
          <div><div>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← Back to All Tools</a></div></div>
        </div>
      </footer>
    </div>
  );
}
