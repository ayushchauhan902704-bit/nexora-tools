"use client";
import { useState, useRef } from "react";

export const dynamic = "force-dynamic";

type Doc = { label: string; sub: string; w: number; h: number; kb: number };

const DOCS: Doc[] = [
  { label: "Passport India", sub: "413x531 • 3.5x4.5cm", w: 413, h: 531, kb: 0 },
  { label: "Passport USA", sub: "600x600 • 2x2 inch", w: 600, h: 600, kb: 0 },
  { label: "Visa USA 2x2", sub: "600x600 • 2x2 inch", w: 600, h: 600, kb: 0 },
  { label: "Visa UK", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Schengen", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Canada", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Australia", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa China", sub: "390x567 • 33x48mm", w: 390, h: 567, kb: 0 },
  { label: "Visa Japan", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Korea", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Dubai", sub: "413x531 • 35x45mm", w: 413, h: 531, kb: 0 },
  { label: "SSC • 20KB", sub: "200x230 • 20KB", w: 200, h: 230, kb: 20 },
  { label: "UPSC • 50KB", sub: "300x350 • 50KB", w: 300, h: 350, kb: 50 },
  { label: "IBPS • 20KB", sub: "200x230 • 20KB", w: 200, h: 230, kb: 20 },
  { label: "Railway • 20KB", sub: "200x230 • 20KB", w: 200, h: 230, kb: 20 },
  { label: "Bank Form", sub: "300x350 • 50KB", w: 300, h: 350, kb: 50 },
  { label: "PAN Card", sub: "400x300 • 3.5x2.5cm", w: 400, h: 300, kb: 0 },
  { label: "Aadhar Card", sub: "300x400 • HD", w: 300, h: 400, kb: 0 },
  { label: "Driving License", sub: "300x350 • HD", w: 300, h: 350, kb: 0 },
  { label: "Voter ID", sub: "300x400 • HD", w: 300, h: 400, kb: 0 },
  { label: "OCI Card", sub: "600x600 • 2x2 inch", w: 600, h: 600, kb: 0 },
  { label: "Stamp Size", sub: "300x400 • 2.5x3.5cm", w: 300, h: 400, kb: 0 },
  { label: "1x1 Inch", sub: "400x400 • HD", w: 400, h: 400, kb: 0 },
  { label: "College ID", sub: "300x400 • HD", w: 300, h: 400, kb: 0 },
  { label: "Job Resume", sub: "400x500 • HD", w: 400, h: 500, kb: 0 },
];

export default function PassportClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [sel, setSel] = useState(0);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [processing, setProcessing] = useState(false);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);
  const [paused, setPaused] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getCurrent = (): Doc => {
    const d = DOCS[sel];
    const w = customW ? parseInt(customW) : d.w;
    const h = customH ? parseInt(customH) : d.h;
    const kb = customKB ? parseInt(customKB) : d.kb;
    return { label: d.label, sub: d.sub, w: isNaN(w) ? d.w : w, h: isNaN(h) ? d.h : h, kb: isNaN(kb) ? d.kb : kb };
  };

  const processImage = (image: HTMLImageElement, doc: Doc) => {
    const c = document.createElement("canvas");
    c.width = doc.w; c.height = doc.h;
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
    c.toBlob((b) => { if (b) setNewKB(Math.round(b.size / 1024)); }, "image/jpeg", 0.9);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setStatus("Photo load ho rahi hai..."); setIsSuccess(false); setProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setOrigW(image.naturalWidth); setOrigH(image.naturalHeight); setOrigKB(Math.round(file.size / 1024));
        processImage(image, getCurrent());
        setStatus("Ho gaya! Document chuno ya neeche size likho."); setIsSuccess(true); setProcessing(false);
      };
      image.onerror = () => { setStatus("Ye photo nahi khuli. Dusri photo try karo."); setIsSuccess(false); setProcessing(false); };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const selectDoc = (idx: number) => {
    setSel(idx);
    setCustomW(""); setCustomH(""); setCustomKB("");
    if (img) processImage(img, DOCS[idx]);
  };

  const applyCustom = () => {
    if (!img) { setStatus("Pehle photo upload karo."); setIsSuccess(false); return; }
    const cur = getCurrent();
    if (cur.w < 50 || cur.w > 2000 || cur.h < 50 || cur.h > 2000) { setStatus("Width / Height 50 se 2000 ke beech likho."); setIsSuccess(false); return; }
    processImage(img, cur);
    setStatus(`Size badal gaya - ${cur.w}x${cur.h} ${cur.kb ? `• ${cur.kb}KB target` : "• HD"}`); setIsSuccess(true);
  };

  const download = async () => {
    if (!canvas) { setStatus("Pehle photo upload karo."); setIsSuccess(false); return; }
    const s = getCurrent();
    setStatus("Bana raha hu..."); setIsSuccess(false);
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
        smaller.width = Math.floor(finalCanvas.width * 0.8); smaller.height = Math.floor(finalCanvas.height * 0.8);
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
    setNewKB(Math.round(blob.size / 1024));
    const url = URL.createObjectURL(blob);
    const fileName = `NEXORA-${s.label.replace(/[^a-zA-Z0-9]+/g, "-")}-${s.w}x${s.h}${s.kb ? "-" + s.kb + "KB" : "-HD"}.jpg`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const win = window.open("about:blank", "_blank");
      if (win) { win.location.href = url; setStatus("New Tab khula hai - Share dabake Save to Photos karo."); setIsSuccess(true); }
      else window.location.href = url;
    } else {
      const a = document.createElement("a");
      a.href = url; a.download = fileName;
      document.body.appendChild(a); a.click(); a.remove();
      setStatus(`Download ho gaya - ${fileName} (${(blob.size / 1024).toFixed(1)}KB)`); setIsSuccess(true);
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    if ((window as any).gtag) (window as any).gtag("event", "passport_photo_download", { event_category: "Image Tools", event_label: s.label });
  };

  const cur = getCurrent();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>✦ FREE • HD • NO WATERMARK • 100% PRIVATE</span>
          </div>
          <h1 style={{ fontSize: 36, margin: "12px 0 6px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Passport Photo<br />Maker</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0, lineHeight: 1.5 }}>Document chuno, Size likho, KB likho - Photo ready!</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 18, padding: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 8px", textAlign: "center" }}>Apni Photo Yaha Upload Karo</p>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 12, padding: preview ? 8 : 14, textAlign: "center", cursor: "pointer", background: "#fff" }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 8, objectFit: "contain" }} /> : <><div style={{ fontSize: 24 }}>📸</div><p style={{ fontWeight: 700, margin: "4px 0 2px", fontSize: 14 }}>Tap Karke Photo Upload Karo</p><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>JPG, PNG • White Background Auto • 100% Private</p></>}
          </div>

          {preview && origW > 0 && (
            <div style={{ marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#475569" }}>Pehle <b style={{ color: "#0f172a" }}>{origW} × {origH} • {origKB} KB</b></div>
              <div style={{ fontSize: 16, color: "#16a34a", lineHeight: 1 }}>↓</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#15803d" }}>Ab {cur.w} × {cur.h} • {cur.kb ? cur.kb + "KB Target" : newKB + " KB"} • {cur.label}</div>
            </div>
          )}

          <p style={{ fontWeight: 800, fontSize: 12, margin: "14px 0 6px" }}>Kis Document Ke Liye Chahiye? 👇</p>
          <div
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}
            style={{ overflow: "hidden", whiteSpace: "nowrap", paddingBottom: 2 }}
          >
            <div style={{ display: "inline-flex", gap: 6, animation: paused ? "none" : "scrollDocs 30s linear infinite" }}>
              {[...DOCS, ...DOCS].map((s, i) => (
                <button key={i} onClick={() => selectDoc(i % DOCS.length)} style={{ padding: "7px 9px", borderRadius: 9, border: (sel === i % DOCS.length && !customW && !customH && !customKB) ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: (sel === i % DOCS.length && !customW && !customH && !customKB) ? "#fff7ed" : "#fff", color: (sel === i % DOCS.length && !customW && !customH && !customKB) ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 11, lineHeight: 1.3, textAlign: "left", whiteSpace: "nowrap", flexShrink: 0 }}>{s.label}<br /><span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{s.sub}</span></button>
              ))}
            </div>
            <style>{`@keyframes scrollDocs { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "4px 0 0", textAlign: "center" }}>👈 Khud chalte hai • Rokne ke liye touch karo / haath rakho • Dabao to select ho jayega</p>

          <p style={{ fontWeight: 800, fontSize: 12, margin: "14px 0 6px" }}>Apna Size / KB Likho (Chaaho To)</p>
          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: "9px" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder={`W - ${DOCS[sel].w}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: "#94a3b8", fontSize: 13 }}>×</div>
              <input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder={`H - ${DOCS[sel].h}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <input type="number" value={customKB} onChange={(e) => setCustomKB(e.target.value)} placeholder={DOCS[sel].kb ? `${DOCS[sel].kb} KB` : "KB?"} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #f97316", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
            </div>
            {img && <button onClick={applyCustom} style={{ width: "100%", padding: 9, marginTop: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 12 }}>Size Lagao →</button>}
          </div>

          {status && <p style={{ background: isSuccess ? "#ecfdf5" : "#fef2f2", color: isSuccess ? "#047857" : "#dc2626", padding: "9px 10px", borderRadius: 9, fontSize: 13, margin: "12px 0 0", textAlign: "center", fontWeight: 600 }}>{status}</p>}

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={download} disabled={!preview || processing} style={{ flex: 1, padding: 13, background: "#f97316", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: (!preview || processing) ? "not-allowed" : "pointer", opacity: (!preview || processing) ? 0.5 : 1 }}>{processing ? "Bana Raha Hu..." : `Download Karo - ${cur.label} →`}</button>
            <button onClick={() => { setImg(null); setPreview(""); setStatus(""); setCustomW(""); setCustomH(""); setCustomKB(""); setSel(0); setCanvas(null); setOrigW(0); }} style={{ padding: "13px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 11, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Clear</button>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0", fontWeight: 700 }}>🔒 100% Private - Photo browser me hi banti hai</p>
        </div>

        <div style={{ height: 50 }}></div>

        <div style={{ background: "#ecfdf5", border: "1.5px solid #86efac", borderRadius: 14, padding: 16 }}>
          <b style={{ color: "#15803d" }}>✅ Photo Ban Gayi? Ab DPI Bhi Check Kar Lo!</b>
          <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7, color: "#166534" }}>Agar form me <b>300 DPI</b> manga hai, ya photo print me phat rahi hai, to DPI badhani padegi. Size sahi hai, par DPI alag cheez hai.</p>
          <a href="/image-dpi-changer" style={{ display: "block", marginTop: 12, textAlign: "center", padding: 13, background: "#16a34a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 14 }}>📏 Photo Ki DPI Badhani / Ghatani Hai? Yaha Tap Karo → DPI Changer 10-1200</a>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Is Tool Se Paisa Kamao!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Studio wale passport photo ke ₹50-100 lete hai. Tu WhatsApp pe ₹20 me kisi ki bhi 20KB / 50KB / Passport photo bana de. Roz 20 photo = ₹400. Koi paisa nahi lagna, sirf ye free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Kaun Se Document Me Kaun Sa Size Chahiye?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Passport / Visa:</b> India 413x531, USA / Visa 600x600.<br /><b>SSC / Railway / IBPS:</b> 20KB photo - 200x230.<br /><b>UPSC / Bank:</b> 50KB photo - 300x350.<br /><b>PAN:</b> 400x300 • <b>Aadhar / Voter:</b> 300x400 • <b>License:</b> 300x350.<br />Form me jo size manga hai wo upar likh do, photo wahi ban jayegi.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Kaise Use Kare? 3 Step Me</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Photo upload karo.<br /><b>Step 2:</b> Document chuno - Passport, SSC 20KB, UPSC 50KB, Visa - ya apna Width / Height / KB likho.<br /><b>Step 3:</b> Download dabao - HD photo ready.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>NEXORA vs Dusre Tools</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA ✅</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Dusre ❌</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Document</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>25 Document ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>2-3 hi</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Custom Size</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Likh Sakte Ho ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Nahi</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Exact KB</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>20KB 50KB Exact ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Random</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Nahi ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Lagta Hai</td></tr>
          </tbody></table>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Aksar Puche Jane Wale Sawal</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>20KB photo kaise banaye?</summary><p style={{ color: "#475569" }}>SSC 20KB dabao ya KB wale box me 20 likho, photo apne aap 20KB ki ban jayegi.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>50KB photo kaise banaye?</summary><p style={{ color: "#475569" }}>UPSC 50KB dabao ya KB wale box me 50 likho.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Apna size kaise likhe?</summary><p style={{ color: "#475569" }}>Width aur Height wale box me apna size likh do, jaise 400x400.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kya meri photo safe hai?</summary><p style={{ color: "#475569" }}>Haan, photo browser me hi banti hai, server pe nahi jati.</p></details>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Agla Tool Dekho → DPI Changer 10-1200</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br />Last Updated: 5 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span>
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
