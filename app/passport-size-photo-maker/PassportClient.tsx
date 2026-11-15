"use client";
import { useRef, useState } from "react";
import removeBackground from "@imgly/background-removal";

type Doc = { label: string; sub: string; w: number; h: number; kb: number };
type CropPosition = { x: number; y: number };
type BgMode = "original" | "color";

const DOCS: Doc[] = [
  { label: "Passport India", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Passport USA", sub: "600 × 600 • 2 × 2 inch", w: 600, h: 600, kb: 0 },
  { label: "Visa USA 2 × 2", sub: "600 × 600 • 2 × 2 inch", w: 600, h: 600, kb: 0 },
  { label: "Visa UK", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Schengen", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Canada", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Australia", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa China", sub: "390 × 567 • 33 × 48 mm", w: 390, h: 567, kb: 0 },
  { label: "Visa Japan", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Korea", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "Visa Dubai", sub: "413 × 531 • 35 × 45 mm", w: 413, h: 531, kb: 0 },
  { label: "SSC • 20 KB", sub: "200 × 230 • Target ≤ 20 KB", w: 200, h: 230, kb: 20 },
  { label: "UPSC • 50 KB", sub: "300 × 350 • Target ≤ 50 KB", w: 300, h: 350, kb: 50 },
  { label: "IBPS • 20 KB", sub: "200 × 230 • Target ≤ 20 KB", w: 200, h: 230, kb: 20 },
  { label: "Railway • 20 KB", sub: "200 × 230 • Target ≤ 20 KB", w: 200, h: 230, kb: 20 },
  { label: "Bank Form", sub: "300 × 350 • Target ≤ 50 KB", w: 300, h: 350, kb: 50 },
  { label: "PAN Card", sub: "400 × 300 • 35 × 25 mm", w: 400, h: 300, kb: 0 },
  { label: "Aadhaar Card", sub: "300 × 400 • HD", w: 300, h: 400, kb: 0 },
  { label: "Driving License", sub: "300 × 350 • HD", w: 300, h: 350, kb: 0 },
  { label: "Voter ID", sub: "300 × 400 • HD", w: 300, h: 400, kb: 0 },
  { label: "OCI Card", sub: "600 × 600 • 2 × 2 inch", w: 600, h: 600, kb: 0 },
  { label: "Stamp Size", sub: "300 × 400 • 25 × 35 mm", w: 300, h: 400, kb: 0 },
  { label: "1 × 1 Inch", sub: "400 × 400 • HD", w: 400, h: 400, kb: 0 },
  { label: "College ID", sub: "300 × 400 • HD", w: 300, h: 400, kb: 0 },
  { label: "Job Resume", sub: "400 × 500 • HD", w: 400, h: 500, kb: 0 },
];
const BG_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
  { name: "Black", value: "#000000" },
];

export default function PassportClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [sel, setSel] = useState(0);
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);
  const [cropPosition, setCropPosition] = useState<CropPosition>({ x: 0.5, y: 0.5 });
  const [bgMode, setBgMode] = useState<BgMode>("original");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgImg, setFgImg] = useState<HTMLImageElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const hasCustom = customW.trim() !== "" || customH.trim() !== "" || customKB.trim() !== "";
  const getCurrent = (): Doc => {
    const d = DOCS[sel];
    const w = Number.isFinite(parseInt(customW)) ? parseInt(customW) : d.w;
    const h = Number.isFinite(parseInt(customH)) ? parseInt(customH) : d.h;
    const kb = Number.isFinite(parseInt(customKB)) ? parseInt(customKB) : d.kb;
    return { label: hasCustom ? "Custom Size" : d.label, sub: "", w, h, kb };
  };
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

  const getSource = (image: HTMLImageElement) => {
    if (image.naturalWidth <= 6000 && image.naturalHeight <= 6000) return image;
    const s = Math.min(6000 / image.naturalWidth, 6000 / image.naturalHeight);
    const c = document.createElement("canvas"); c.width = Math.round(image.naturalWidth * s); c.height = Math.round(image.naturalHeight * s);
    const ctx = c.getContext("2d"); if (!ctx) return image;
    ctx.drawImage(image, 0, 0, c.width, c.height);
    const r = new Image(); r.src = c.toDataURL("image/jpeg", 0.92); return r;
  };

  const drawCrop = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, doc: Doc, pos: CropPosition) => {
    const ir = image.naturalWidth / image.naturalHeight, cr = doc.w / doc.h;
    let sx = 0, sy = 0, sW = image.naturalWidth, sH = image.naturalHeight;
    if (ir > cr) { sH = image.naturalHeight; sW = sH * cr; sx = (image.naturalWidth - sW) * clamp(pos.x, 0, 1); }
    else { sW = image.naturalWidth; sH = sW / cr; sy = (image.naturalHeight - sH) * clamp(pos.y, 0, 1); }
    ctx.drawImage(image, sx, sy, sW, sH, 0, 0, doc.w, doc.h);
  };

  const createOriginal = (image: HTMLImageElement, doc: Doc, pos: CropPosition) => {
    const c = document.createElement("canvas"); c.width = doc.w; c.height = doc.h;
    const ctx = c.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    drawCrop(ctx, image, doc, pos); return c;
  };

  // ✅ YAHI FIX HAI - yahan se type: "foreground" hata diya hai
  const getFg = async (file: File) => {
    if (fgImg) return fgImg;
    const blob = await removeBackground(file, {
      model: "small",
      output: { format: "image/png", quality: 1 },
    } as any);
    const url = URL.createObjectURL(blob); const fg = new Image();
    await new Promise<void>((res, rej) => { fg.onload = () => res(); fg.onerror = () => rej(new Error("fg")); fg.src = url; });
    setFgImg(fg); return fg;
  };

  const createColor = (fg: HTMLImageElement, doc: Doc, pos: CropPosition, color: string) => {
    const c = document.createElement("canvas"); c.width = doc.w; c.height = doc.h;
    const ctx = c.getContext("2d")!; ctx.fillStyle = color; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    drawCrop(ctx, fg, doc, pos); return c;
  };

  const toBlob = (t: HTMLCanvasElement, q: number): Promise<Blob | null> => new Promise(r => t.toBlob(b => r(b), "image/jpeg", clamp(q, 0.05, 0.98)));
  const render = (c: HTMLCanvasElement) => { setCanvas(c); setPreview(c.toDataURL("image/jpeg", 0.9)); c.toBlob(b => { if (b) setNewKB(Math.max(1, Math.round(b.size / 1024))); }, "image/jpeg", 0.9); };

  const process = async (image: HTMLImageElement, doc: Doc, pos = cropPosition) => {
    setProcessing(true);
    try {
      const src = getSource(image);
      if (!src.complete) await new Promise<void>((res, rej) => { src.onload = () => res(); src.onerror = () => rej(new Error("e")); });
      let c;
      if (bgMode === "color" && sourceFile) { setStatus("Removing background... First time 5-10 sec"); const fg = await getFg(sourceFile); c = createColor(fg, doc, pos, bgColor); }
      else c = createOriginal(src, doc, pos);
      render(c);
    } catch { setStatus("Failed. Try another photo."); setIsSuccess(false); }
    finally { setProcessing(false); }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setStatus("Valid JPG/PNG/WebP choose karo."); setIsSuccess(false); return; }
    if (file.size > 25 * 1024 * 1024) { setStatus("25 MB se chhoti photo lo."); setIsSuccess(false); return; }
    setStatus("Processing..."); setIsSuccess(false); setProcessing(true);
    setSourceFile(file); setFgImg(null); setDownloadUrl("");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = async () => {
        setImg(image); setOrigW(image.naturalWidth); setOrigH(image.naturalHeight); setOrigKB(Math.max(1, Math.round(file.size / 1024)));
        try { const c = createOriginal(getSource(image), getCurrent(), cropPosition); render(c); setStatus("Photo ready! Document ya Background chuno."); setIsSuccess(true); }
        catch { setStatus("Photo nahi khuli."); setIsSuccess(false); } finally { setProcessing(false); }
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const selectDoc = async (idx: number) => { setSel(idx); setCustomW(""); setCustomH(""); setCustomKB(""); setDownloadUrl(""); if (img) { await process(img, DOCS[idx]); setStatus(`${DOCS[idx].label} applied.`); setIsSuccess(true); } };
  const applyCustom = async () => {
    if (!img) return; const cur = getCurrent();
    if (cur.w < 50 || cur.w > 2000 || cur.h < 50 || cur.h > 2000) { setStatus("Width/Height 50-2000 ke beech."); setIsSuccess(false); return; }
    await process(img, cur); setStatus(`${cur.w} × ${cur.h} applied.`); setIsSuccess(true);
  };
  const updateCrop = async (axis: "x" | "y", v: number) => { const n = { ...cropPosition, [axis]: v }; setCropPosition(n); if (img) await process(img, getCurrent(), n); };

  const changeBgMode = async (m: BgMode) => {
    setBgMode(m); setDownloadUrl(""); if (!img) return;
    setProcessing(true);
    try {
      if (m === "original") { render(createOriginal(getSource(img), getCurrent(), cropPosition)); setStatus("Original background restored."); setIsSuccess(true); }
      else { if (!sourceFile) throw new Error("no file"); setStatus("Removing background..."); const fg = await getFg(sourceFile); render(createColor(fg, getCurrent(), cropPosition, bgColor)); setStatus("Color background applied."); setIsSuccess(true); }
    } catch { setStatus("Background fail. Dusri photo try karo."); setIsSuccess(false); } finally { setProcessing(false); }
  };
  const changeBgColor = async (color: string) => {
    setBgColor(color); setDownloadUrl(""); if (bgMode !== "color" || !sourceFile) return;
    setProcessing(true);
    try { const fg = await getFg(sourceFile); render(createColor(fg, getCurrent(), cropPosition, color)); setStatus("Color updated."); setIsSuccess(true); }
    catch { setStatus("Color change fail."); setIsSuccess(false); } finally { setProcessing(false); }
  };

  const compress = async (src: HTMLCanvasElement, kb: number) => {
    const target = kb * 1024; let best: Blob | null = null; let lo = 0.05, hi = 0.98;
    for (let i = 0; i < 10; i++) { const q = (lo + hi) / 2; const b = await toBlob(src, q); if (!b) continue; if (b.size <= target) { best = b; lo = q; } else hi = q; }
    if (best) return { blob: best, canvas: src };
    let w = src;
    for (let s = 0; s < 8; s++) { const n = document.createElement("canvas"); n.width = Math.max(50, Math.floor(w.width * 0.9)); n.height = Math.max(50, Math.floor(w.height * 0.9)); const ctx = n.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, n.width, n.height); ctx.drawImage(w, 0, 0, w.width, w.height, 0, 0, n.width, n.height); let lq = 0.05, hq = 0.95, u: Blob | null = null; for (let i = 0; i < 8; i++) { const q = (lq + hq) / 2; const b = await toBlob(n, q); if (!b) continue; if (b.size <= target) { u = b; lq = q; } else hq = q; } if (u) return { blob: u, canvas: n }; w = n; }
    return { blob: await toBlob(w, 0.05), canvas: w };
  };

  const download = async () => {
    if (!canvas) return; const s = getCurrent();
    setProcessing(true); setStatus(s.kb > 0 ? `Optimizing to ${s.kb} KB...` : "Preparing...");
    try {
      let final = canvas, blob: Blob | null = null;
      if (s.kb > 0) { const r = await compress(canvas, s.kb); blob = r.blob; final = r.canvas; } else blob = await toBlob(canvas, 0.94);
      if (!blob) throw new Error("e");
      const actual = blob.size / 1024; setNewKB(Math.max(1, Math.round(actual)));
      const fileName = `NEXORA-${hasCustom ? `Custom-${s.w}x${s.h}` : s.label.replace(/[^a-zA-Z0-9]+/g, "-")}-${bgMode === "color" ? "Color-BG" : "Original-BG"}-${final.width}x${final.height}${s.kb ? `-${s.kb}KB` : "-HD"}.jpg`;
      setDownloadName(fileName);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS && typeof (navigator as any).share === "function") {
        try { const f = new File([blob], fileName, { type: "image/jpeg" }); if ((navigator as any).canShare({ files: [f] })) { await (navigator as any).share({ files: [f] }); setStatus(`Ready • ${actual.toFixed(1)} KB`); setIsSuccess(true); } else throw new Error("no share"); }
        catch (e: any) { if (e?.name !== "AbortError") { const u = URL.createObjectURL(blob); setDownloadUrl(u); setStatus(`Ready • ${actual.toFixed(1)} KB - Neeche long-press karke Save karo.`); setIsSuccess(true); } }
      } else {
        const u = URL.createObjectURL(blob); setDownloadUrl(u);
        if (!isMobile) { const a = document.createElement("a"); a.href = u; a.download = fileName; document.body.appendChild(a); a.click(); a.remove(); setStatus(`Download complete • ${actual.toFixed(1)} KB`); setIsSuccess(true); }
        else { setStatus(`Ready • ${actual.toFixed(1)} KB - Neeche long-press karke Save karo.`); setIsSuccess(true); }
      }
      if (typeof (window as any).gtag === "function") (window as any).gtag("event", "passport_photo_download", { event_label: s.label });
    } catch { setStatus("Download fail. Dobara try karo."); setIsSuccess(false); } finally { setProcessing(false); }
  };

  const shareAgain = async () => { if (!downloadUrl) return; try { const r = await fetch(downloadUrl); const b = await r.blob(); const f = new File([b], downloadName, { type: "image/jpeg" }); await (navigator as any).share({ files: [f] }); } catch { window.open(downloadUrl, "_blank"); } };
  const clearAll = () => { setImg(null); setSourceFile(null); setPreview(""); setStatus(""); setCustomW(""); setCustomH(""); setCustomKB(""); setSel(0); setCanvas(null); setOrigW(0); setOrigH(0); setOrigKB(0); setNewKB(0); setCropPosition({ x: 0.5, y: 0.5 }); setBgMode("original"); setBgColor("#ffffff"); setFgImg(null); setDownloadUrl(""); if (fileRef.current) fileRef.current.value = ""; };
  const cur = getCurrent();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", color: "#0f172a", minHeight: "100vh" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}><a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a><a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a></nav>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>✦ FREE • HD • NO WATERMARK • PRIVATE</span>
          <h1 style={{ fontSize: 36, margin: "12px 0 6px", lineHeight: 1.05, fontWeight: 900, background: "linear-gradient(90deg,#1d4ed8,#6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Passport Photo<br />Maker</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Passport, Visa, SSC 20KB, UPSC 50KB - Background ke saath photo banao.</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 18, padding: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 13, textAlign: "center", margin: "0 0 8px" }}>Upload Your Photo</p>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 12, padding: 14, textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 24 }}>📸</div>
            <p style={{ fontWeight: 700, margin: "4px 0 2px", fontSize: 14 }}>{preview ? "Tap to Replace Photo" : "Tap to Upload Photo"}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • Browser me hi banti hai</p>
          </div>
          <p style={{ fontWeight: 800, fontSize: 12, margin: "14px 0 6px" }}>Choose Document Size</p>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
            {DOCS.map((s, i) => { const a = sel === i && !hasCustom; return <button key={i} onClick={() => selectDoc(i)} style={{ padding: "7px 9px", borderRadius: 9, border: a ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: a ? "#fff7ed" : "#fff", color: a ? "#ea580c" : "#0f172a", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap", cursor: "pointer" }}>{s.label}<br /><span style={{ fontSize: 9, color: "#64748b" }}>{s.sub}</span></button> })}
          </div>
          <p style={{ fontWeight: 800, fontSize: 12, margin: "10px 0 6px" }}>Custom Width / Height / KB</p>
          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: 9 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder={`W • ${DOCS[sel].w}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, minWidth: 0 }} />
              <div style={{ display: "flex", alignItems: "center", fontWeight: 800 }}>×</div>
              <input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder={`H • ${DOCS[sel].h}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, minWidth: 0 }} />
              <input type="number" value={customKB} onChange={(e) => setCustomKB(e.target.value)} placeholder={DOCS[sel].kb ? `${DOCS[sel].kb} KB` : "KB"} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #f97316", fontSize: 13, fontWeight: 700, minWidth: 0 }} />
            </div>
            {img && <button onClick={applyCustom} disabled={processing} style={{ width: "100%", padding: 9, marginTop: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 800, fontSize: 12 }}>Apply Custom Settings →</button>}
          </div>
          {preview && (
            <>
              <div style={{ marginTop: 16, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 12, textAlign: "center" }}>
                <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 8px" }}>Photo Preview</p>
                <img src={preview} alt="Preview" style={{ width: "100%", maxWidth: 280, maxHeight: 320, borderRadius: 10, objectFit: "contain", background: bgMode === "color" ? bgColor : "#fff", border: "1px solid #e2e8f0" }} />
                <div style={{ marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12 }}>Original: <b>{origW} × {origH} • {origKB} KB</b></div>
                  <div style={{ fontSize: 18, color: "#16a34a" }}>↓</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d" }}>Output: {cur.w} × {cur.h} • {cur.kb ? `Target ≤ ${cur.kb} KB` : `${newKB} KB`} • {bgMode === "color" ? "Color BG" : "Original BG"}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <p style={{ textAlign: "center", margin: "0 0 3px", fontSize: 14, fontWeight: 900 }}>Background</p>
                <p style={{ textAlign: "center", margin: "0 0 10px", fontSize: 10, color: "#64748b" }}>Original rakho ya Color se badlo - asli background AI se hatega.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button onClick={() => changeBgMode("original")} disabled={processing} style={{ padding: 11, border: bgMode === "original" ? "2px solid #2563eb" : "1px solid #e2e8f0", borderRadius: 10, background: bgMode === "original" ? "#eff6ff" : "#fff", fontWeight: 800, fontSize: 12 }}>📷 Original Background</button>
                  <button onClick={() => changeBgMode("color")} disabled={processing} style={{ padding: 11, border: bgMode === "color" ? "2px solid #f97316" : "1px solid #e2e8f0", borderRadius: 10, background: bgMode === "color" ? "#fff7ed" : "#fff", fontWeight: 800, fontSize: 12 }}>🎨 Color Background</button>
                </div>
                {bgMode === "color" && (
                  <div style={{ marginTop: 12, background: "#f8fafc", borderRadius: 10, padding: 10 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800 }}>Choose Background Color</p>
                    <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                      {BG_COLORS.map(c => <button key={c.value} onClick={() => changeBgColor(c.value)} disabled={processing} style={{ width: 32, height: 32, borderRadius: 50, border: bgColor === c.value ? "3px solid #0f172a" : "2px solid #cbd5e1", background: c.value, cursor: "pointer" }} />)}
                      <label style={{ fontSize: 10, fontWeight: 700 }}>Custom <input type="color" value={bgColor} onChange={(e) => changeBgColor(e.target.value)} style={{ width: 36, height: 30 }} /></label>
                    </div>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "9px 0 0" }}>Pehli baar 5-10 sec lagega, fir instant color badlega.</p>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>Adjust Crop Position</p>
                <label style={{ fontSize: 11, fontWeight: 700 }}>Horizontal</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.x} onChange={(e) => updateCrop("x", Number(e.target.value))} style={{ width: "100%" }} />
                <label style={{ fontSize: 11, fontWeight: 700 }}>Vertical</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.y} onChange={(e) => updateCrop("y", Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            </>
          )}
          {status && <p style={{ background: isSuccess ? "#ecfdf5" : "#fef2f2", color: isSuccess ? "#047857" : "#dc2626", padding: "9px 10px", borderRadius: 9, fontSize: 13, margin: "12px 0 0", textAlign: "center", fontWeight: 600 }}>{status}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={download} disabled={!preview || processing} style={{ flex: 1, padding: 14, background: "#f97316", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer", opacity: !preview || processing ? 0.5 : 1 }}>{processing ? "Processing..." : `Download ${cur.label} →`}</button>
            <button onClick={clearAll} style={{ padding: "13px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 11, fontWeight: 700, fontSize: 13 }}>Clear</button>
          </div>
          {downloadUrl && (
            <div style={{ marginTop: 12, background: "#eff6ff", border: "1.5px solid #2563eb", borderRadius: 12, padding: 12, textAlign: "center" }}>
              <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 6px" }}>📱 iPhone me Save Nahi Hua?</p>
              <p style={{ fontSize: 12, margin: "0 0 10px" }}>Neeche photo ko <b>long-press</b> karo → Save to Photos.</p>
              <img src={downloadUrl} alt="Save" style={{ width: "100%", maxWidth: 280, borderRadius: 10, border: "1px solid #bfdbfe" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <a href={downloadUrl} download={downloadName} style={{ flex: 1, padding: 12, background: "#2563eb", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 13 }}>Download Again</a>
                <button onClick={shareAgain} style={{ flex: 1, padding: 12, background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 13 }}>Share ↗</button>
              </div>
            </div>
          )}
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0", fontWeight: 700 }}>🔒 Photo browser me hi banti hai.</p>
        </div>
        <div style={{ height: 18 }} />
        <a href="/image-dpi-changer" style={{ display: "block", background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 10, padding: "10px 12px", textDecoration: "none", fontSize: 13, color: "#15803d", fontWeight: 700, textAlign: "center" }}>DPI change karni hai? <span style={{ textDecoration: "underline" }}>DPI Changer</span> →</a>
        <div style={{ height: 30 }} />
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Passport Photo Maker - Is Tool Se Kya Hoga?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Passport / Visa:</b> India 413×531, USA 600×600, UK / Schengen 413×531.<br /><b>SSC / Railway / IBPS:</b> 200×230 - 20KB Target.<br /><b>UPSC / Bank:</b> 300×350 - 50KB Target.<br /><b>PAN:</b> 400×300 • <b>Aadhaar / Voter:</b> 300×400 • <b>License:</b> 300×350.<br /><b>Background:</b> Original rakho ya White / Blue / Red / Green me badlo - AI se asli background hatega.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Kaise Use Kare? 5 Step</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Photo upload karo.<br /><b>Step 2:</b> Document chuno - Passport, SSC 20KB, UPSC 50KB.<br /><b>Step 3:</b> Background chuno - Original ya Color.<br /><b>Step 4:</b> Agar chaho to Width / Height / KB likho.<br /><b>Step 5:</b> Download dabao - PC me direct, iPhone me Share / Long-press Save.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>20KB Photo Kaise Banaye?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>SSC 20KB dabao ya KB wale box me 20 likho. Tool photo ko 20KB ke andar le aayega.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Background Kaise Badle?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>Color Background dabao, White / Blue / Red chuno. Pehli baar 5-10 sec lagega kyunki AI background hata raha hai.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Aksar Puche Jane Wale Sawal</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>20KB photo kaise banaye?</summary><p style={{ color: "#475569" }}>SSC 20KB dabao ya KB box me 20 likho.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Background white kaise kare?</summary><p style={{ color: "#475569" }}>Color Background dabao, White chuno.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>iPhone me download nahi ho raha?</summary><p style={{ color: "#475569" }}>Neeche wali photo ko long-press karke Save to Photos dabao.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kya photo safe hai?</summary><p style={{ color: "#475569" }}>Haan, photo browser me hi banti hai.</p></details>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}><a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Agla Tool → DPI Changer</a></div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px" }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: NEXORA<br />Last Updated: 15 Nov 2026 • Free & Private</p>
      </main>
      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Free Tools. Simple Solutions. • <a href="/about" style={{ color: "#cbd5e1" }}>About</a> • <a href="/privacy-policy" style={{ color: "#cbd5e1" }}>Privacy</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contact</a></p>
      </footer>
    </div>
  );
}
