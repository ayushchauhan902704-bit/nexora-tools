"use client";

import { useRef, useState } from "react";
import removeBackground from "@imgly/background-removal";

type Doc = { label: string; sub: string; w: number; h: number; kb: number };
type CropPosition = { x: number; y: number };
type BackgroundMode = "original" | "color";

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

const MAX_SOURCE_DIMENSION = 6000;
const MIN_DIMENSION = 50;
const MAX_DIMENSION = 2000;
const MIN_TARGET_KB = 5;
const MAX_TARGET_KB = 5000;

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
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("original");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundImg, setForegroundImg] = useState<HTMLImageElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const hasCustom = customW.trim() !== "" || customH.trim() !== "" || customKB.trim() !== "";
  const getCurrent = (): Doc => {
    const d = DOCS[sel];
    const parsedW = Number.parseInt(customW, 10);
    const parsedH = Number.parseInt(customH, 10);
    const parsedKB = Number.parseInt(customKB, 10);
    const w = Number.isFinite(parsedW) ? parsedW : d.w;
    const h = Number.isFinite(parsedH) ? parsedH : d.h;
    const kb = Number.isFinite(parsedKB) ? parsedKB : d.kb;
    return { label: hasCustom ? "Custom Size" : d.label, sub: `${w} × ${h}${kb ? ` • Target ≤ ${kb} KB` : " • HD"}`, w, h, kb };
  };

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const getSourceImage = (image: HTMLImageElement): HTMLImageElement => {
    if (image.naturalWidth <= MAX_SOURCE_DIMENSION && image.naturalHeight <= MAX_SOURCE_DIMENSION) return image;
    const scale = Math.min(MAX_SOURCE_DIMENSION / image.naturalWidth, MAX_SOURCE_DIMENSION / image.naturalHeight);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(image.naturalWidth * scale));
    c.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = c.getContext("2d"); if (!ctx) return image;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, c.width, c.height);
    const resized = new Image(); resized.src = c.toDataURL("image/jpeg", 0.92); return resized;
  };

  const createOriginalCanvas = (image: HTMLImageElement, doc: Doc, position: CropPosition): HTMLCanvasElement => {
    const c = document.createElement("canvas"); c.width = doc.w; c.height = doc.h;
    const ctx = c.getContext("2d"); if (!ctx) throw new Error("Canvas not supported");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sW = image.naturalWidth, sH = image.naturalHeight;
    if (imgRatio > canvasRatio) { sH = image.naturalHeight; sW = sH * canvasRatio; sx = (image.naturalWidth - sW) * clamp(position.x, 0, 1); }
    else { sW = image.naturalWidth; sH = sW / canvasRatio; sy = (image.naturalHeight - sH) * clamp(position.y, 0, 1); }
    ctx.drawImage(image, sx, sy, sW, sH, 0, 0, c.width, c.height);
    return c;
  };

  // ✅ FIXED: type: "foreground" hata diya - isi se build fail ho raha tha
  // ✅ CACHE: Ek baar AI chalega, fir wahi photo reuse hogi
  const getForeground = async (file: File): Promise<HTMLImageElement> => {
    if (foregroundImg) return foregroundImg;
    const blob = await removeBackground(file, {
      model: "small",
      output: { format: "image/png", quality: 1 },
    } as any);
    const url = URL.createObjectURL(blob);
    const fg = new Image();
    await new Promise<void>((resolve, reject) => {
      fg.onload = () => resolve();
      fg.onerror = () => reject(new Error("fg fail"));
      fg.src = url;
    });
    setForegroundImg(fg);
    return fg;
  };

  const createColorCanvasFast = (fg: HTMLImageElement, doc: Doc, position: CropPosition, color: string): HTMLCanvasElement => {
    const c = document.createElement("canvas"); c.width = doc.w; c.height = doc.h;
    const ctx = c.getContext("2d"); if (!ctx) throw new Error("Canvas not supported");
    ctx.fillStyle = color; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    const imgRatio = fg.naturalWidth / fg.naturalHeight;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sW = fg.naturalWidth, sH = fg.naturalHeight;
    if (imgRatio > canvasRatio) { sH = fg.naturalHeight; sW = sH * canvasRatio; sx = (fg.naturalWidth - sW) * clamp(position.x, 0, 1); }
    else { sW = fg.naturalWidth; sH = sW / canvasRatio; sy = (fg.naturalHeight - sH) * clamp(position.y, 0, 1); }
    ctx.drawImage(fg, sx, sy, sW, sH, 0, 0, c.width, c.height);
    return c;
  };

  const canvasToBlob = (t: HTMLCanvasElement, q: number): Promise<Blob | null> => new Promise((res) => t.toBlob((b) => res(b), "image/jpeg", clamp(q, 0.05, 0.98)));

  const renderPreview = (c: HTMLCanvasElement) => {
    setCanvas(c); setPreview(c.toDataURL("image/jpeg", 0.9));
    c.toBlob((b) => { if (b) setNewKB(Math.max(1, Math.round(b.size / 1024))); }, "image/jpeg", 0.9);
  };

  const processImage = async (image: HTMLImageElement, doc: Doc, position = cropPosition) => {
    setProcessing(true);
    try {
      const source = getSourceImage(image);
      if (!source.complete) await new Promise<void>((resolve, reject) => { source.onload = () => resolve(); source.onerror = () => reject(new Error("err")); });
      let c: HTMLCanvasElement;
      if (backgroundMode === "color" && sourceFile) {
        setStatus("Removing original background... (first time 5-10 sec)");
        const fg = await getForeground(sourceFile);
        c = createColorCanvasFast(fg, doc, position, backgroundColor);
      } else {
        c = createOriginalCanvas(source, doc, position);
      }
      renderPreview(c);
    } catch (e) {
      console.error(e);
      setStatus(backgroundMode === "color" ? "Background replacement failed. Try another photo." : "Unable to process image. Try another photo.");
      setIsSuccess(false);
    } finally { setProcessing(false); }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setStatus("Please select valid JPG, PNG, WebP image."); setIsSuccess(false); return; }
    if (file.size > 25 * 1024 * 1024) { setStatus("Image too large. Choose under 25 MB."); setIsSuccess(false); return; }
    setStatus("Processing your photo..."); setIsSuccess(false); setProcessing(true);
    setSourceFile(file); setForegroundImg(null); setDownloadUrl("");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = async () => {
        setImg(image); setOrigW(image.naturalWidth); setOrigH(image.naturalHeight); setOrigKB(Math.max(1, Math.round(file.size / 1024)));
        try {
          const source = getSourceImage(image);
          const c = createOriginalCanvas(source, getCurrent(), cropPosition);
          renderPreview(c);
          setStatus("Photo ready. Choose document size or background."); setIsSuccess(true);
        } catch { setStatus("Unable to process image."); setIsSuccess(false); }
        finally { setProcessing(false); }
      };
      image.onerror = () => { setStatus("Image could not be opened."); setIsSuccess(false); setProcessing(false); };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const selectDoc = async (idx: number) => {
    setSel(idx); setCustomW(""); setCustomH(""); setCustomKB(""); setDownloadUrl("");
    if (img) { setStatus("Applying document size..."); setIsSuccess(false); await processImage(img, DOCS[idx], cropPosition); setStatus(`${DOCS[idx].label} applied.`); setIsSuccess(true); }
  };

  const applyCustom = async () => {
    if (!img) { setStatus("Please upload photo first."); setIsSuccess(false); return; }
    const cur = getCurrent();
    if (cur.w < MIN_DIMENSION || cur.w > MAX_DIMENSION || cur.h < MIN_DIMENSION || cur.h > MAX_DIMENSION) { setStatus(`Width/height must be ${MIN_DIMENSION}-${MAX_DIMENSION}px.`); setIsSuccess(false); return; }
    if (customKB !== "" && (cur.kb < MIN_TARGET_KB || cur.kb > MAX_TARGET_KB)) { setStatus(`KB must be ${MIN_TARGET_KB}-${MAX_TARGET_KB}.`); setIsSuccess(false); return; }
    setStatus("Applying custom size..."); setIsSuccess(false);
    await processImage(img, cur, cropPosition);
    setStatus(`${cur.w} × ${cur.h} applied${cur.kb ? ` • Target ≤ ${cur.kb} KB` : ""}.`); setIsSuccess(true);
  };

  const updateCrop = async (axis: "x" | "y", value: number) => {
    const next = { ...cropPosition, [axis]: value }; setCropPosition(next);
    if (img) await processImage(img, getCurrent(), next);
  };

  const changeBackgroundMode = async (mode: BackgroundMode) => {
    setBackgroundMode(mode); setDownloadUrl("");
    if (!img) return;
    setProcessing(true); setIsSuccess(false);
    try {
      if (mode === "original") {
        setStatus("Restoring original background...");
        const c = createOriginalCanvas(getSourceImage(img), getCurrent(), cropPosition);
        renderPreview(c); setStatus("Original background restored."); setIsSuccess(true);
      } else {
        if (!sourceFile) throw new Error("no file");
        setStatus("Removing background... First time 5-10 sec lagega.");
        const fg = await getForeground(sourceFile);
        const c = createColorCanvasFast(fg, getCurrent(), cropPosition, backgroundColor);
        renderPreview(c); setStatus("Color background applied."); setIsSuccess(true);
      }
    } catch { setStatus("Background processing failed. Try another photo."); setIsSuccess(false); }
    finally { setProcessing(false); }
  };

  const changeBackgroundColor = async (color: string) => {
    setBackgroundColor(color); setDownloadUrl("");
    if (backgroundMode !== "color" || !sourceFile) return;
    setProcessing(true); setIsSuccess(false);
    try {
      setStatus("Applying new background color...");
      const fg = await getForeground(sourceFile);
      const c = createColorCanvasFast(fg, getCurrent(), cropPosition, color);
      renderPreview(c); setStatus("Background color updated."); setIsSuccess(true);
    } catch { setStatus("Unable to change color."); setIsSuccess(false); }
    finally { setProcessing(false); }
  };

  const compressToTarget = async (sourceCanvas: HTMLCanvasElement, targetKB: number): Promise<{ blob: Blob | null; canvas: HTMLCanvasElement }> => {
    const targetBytes = targetKB * 1024; let best: Blob | null = null; let low = 0.05; let high = 0.98;
    for (let i = 0; i < 10; i++) { const q = (low + high) / 2; const b = await canvasToBlob(sourceCanvas, q); if (!b) continue; if (b.size <= targetBytes) { best = b; low = q; } else high = q; }
    if (best) return { blob: best, canvas: sourceCanvas };
    let working = sourceCanvas;
    for (let s = 0; s < 8; s++) {
      const next = document.createElement("canvas"); next.width = Math.max(50, Math.floor(working.width * 0.9)); next.height = Math.max(50, Math.floor(working.height * 0.9));
      const ctx = next.getContext("2d"); if (!ctx) break;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, next.width, next.height);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(working, 0, 0, working.width, working.height, 0, 0, next.width, next.height);
      let lq = 0.05, hq = 0.95, under: Blob | null = null;
      for (let i = 0; i < 8; i++) { const q = (lq + hq) / 2; const b = await canvasToBlob(next, q); if (!b) continue; if (b.size <= targetBytes) { under = b; lq = q; } else hq = q; }
      if (under) return { blob: under, canvas: next }; working = next;
    }
    return { blob: await canvasToBlob(working, 0.05), canvas: working };
  };

  const download = async () => {
    if (!canvas) { setStatus("Please upload photo first."); setIsSuccess(false); return; }
    const s = getCurrent();
    if (s.w < MIN_DIMENSION || s.w > MAX_DIMENSION || s.h < MIN_DIMENSION || s.h > MAX_DIMENSION) { setStatus(`Width/height must be ${MIN_DIMENSION}-${MAX_DIMENSION}px.`); setIsSuccess(false); return; }
    if (s.kb > 0 && (s.kb < MIN_TARGET_KB || s.kb > MAX_TARGET_KB)) { setStatus(`KB must be ${MIN_TARGET_KB}-${MAX_TARGET_KB}.`); setIsSuccess(false); return; }
    setProcessing(true); setIsSuccess(false);
    setStatus(s.kb > 0 ? `Optimizing to ${s.kb} KB...` : "Preparing your photo...");
    try {
      let finalCanvas = canvas; let blob: Blob | null = null;
      if (s.kb > 0) { const r = await compressToTarget(canvas, s.kb); blob = r.blob; finalCanvas = r.canvas; }
      else blob = await canvasToBlob(canvas, 0.94);
      if (!blob) throw new Error("encode fail");
      const actualKB = blob.size / 1024; setNewKB(Math.max(1, Math.round(actualKB)));
      const targetMet = s.kb === 0 || actualKB <= s.kb;
      const safeLabel = hasCustom ? `Custom-${s.w}x${s.h}` : s.label.replace(/[^a-zA-Z0-9]+/g, "-");
      const bgLabel = backgroundMode === "color" ? "Color-BG" : "Original-BG";
      const fileName = `NEXORA-${safeLabel}-${bgLabel}-${finalCanvas.width}x${finalCanvas.height}${s.kb ? `-${s.kb}KB` : "-HD"}.jpg`;
      setDownloadName(fileName);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      // iPhone Share
      if (isIOS && typeof (navigator as any).share === "function") {
        try {
          const file = new File([blob], fileName, { type: "image/jpeg" });
          if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
            await (navigator as any).share({ files: [file], title: "NEXORA Passport Photo" });
            setStatus(`Photo ready • ${actualKB.toFixed(1)} KB`); setIsSuccess(true);
          } else throw new Error("share not available");
        } catch (e: any) {
          if (e?.name === "AbortError") { setStatus("Share cancelled. Photo still ready."); setIsSuccess(false); }
          else {
            const url = URL.createObjectURL(blob); setDownloadUrl(url);
            setStatus(`Photo ready • ${actualKB.toFixed(1)} KB - Neeche long-press karke Save karo.`); setIsSuccess(true);
          }
        }
      } else {
        const url = URL.createObjectURL(blob); setDownloadUrl(url);
        if (!isMobile) {
          const a = document.createElement("a"); a.href = url; a.download = fileName; a.style.display = "none"; document.body.appendChild(a); a.click(); a.remove();
          setStatus(targetMet ? `Download complete • ${actualKB.toFixed(1)} KB` : `Download complete • ${actualKB.toFixed(1)} KB`); setIsSuccess(true);
        } else {
          setStatus(`Photo ready • ${actualKB.toFixed(1)} KB - Neeche long-press karke Save karo.`); setIsSuccess(true);
        }
      }
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "passport_photo_download", { event_category: "Image Tools", event_label: s.label, background_mode: backgroundMode });
      }
    } catch (e) { console.error(e); setStatus("Unable to download. Try again."); setIsSuccess(false); }
    finally { setProcessing(false); }
  };

  const shareAgain = async () => {
    if (!downloadUrl) return;
    try {
      const res = await fetch(downloadUrl); const b = await res.blob();
      const f = new File([b], downloadName, { type: "image/jpeg" });
      await (navigator as any).share({ files: [f], title: downloadName });
    } catch { window.open(downloadUrl, "_blank"); }
  };

  const clearAll = () => {
    setImg(null); setSourceFile(null); setPreview(""); setStatus(""); setIsSuccess(false);
    setCustomW(""); setCustomH(""); setCustomKB(""); setSel(0); setCanvas(null);
    setOrigW(0); setOrigH(0); setOrigKB(0); setNewKB(0);
    setCropPosition({ x: 0.5, y: 0.5 }); setBackgroundMode("original"); setBackgroundColor("#ffffff");
    setForegroundImg(null); setDownloadUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const cur = getCurrent();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}><a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a><a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a></nav>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "center" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>✦ FREE • HD • NO WATERMARK • PRIVATE</span></div>
          <h1 style={{ fontSize: 36, margin: "12px 0 6px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Passport Photo<br />Maker</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0, lineHeight: 1.5 }}>Create passport, visa, ID photos with real background change.</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 18, padding: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 8px", textAlign: "center" }}>Upload Your Photo</p>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/*" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
          <div role="button" tabIndex={0} aria-label="Upload photo" onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 12, padding: 14, textAlign: "center", cursor: "pointer", background: "#fff" }}>
            <div style={{ fontSize: 24 }}>📸</div>
            <p style={{ fontWeight: 700, margin: "4px 0 2px", fontSize: 14 }}>{preview ? "Tap to Replace Your Photo" : "Tap to Upload a Photo"}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>JPG, PNG or WebP • Processed in your browser</p>
          </div>

          <p style={{ fontWeight: 800, fontSize: 12, margin: "14px 0 6px" }}>Choose a Document Size</p>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}>
            {DOCS.map((s, i) => {
              const isActive = sel === i && !hasCustom;
              return <button key={`${s.label}-${i}`} onClick={() => selectDoc(i)} type="button" style={{ padding: "7px 9px", borderRadius: 9, border: isActive ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: isActive ? "#fff7ed" : "#fff", color: isActive ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 11, lineHeight: 1.3, textAlign: "left", whiteSpace: "nowrap", flexShrink: 0 }}>{s.label}<br /><span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{s.sub}</span></button>
            })}
          </div>

          <p style={{ fontWeight: 800, fontSize: 12, margin: "10px 0 6px" }}>Custom Width / Height / KB</p>
          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: 9 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="number" inputMode="numeric" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder={`W • ${DOCS[sel].w}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: "#94a3b8", fontSize: 13 }}>×</div>
              <input type="number" inputMode="numeric" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder={`H • ${DOCS[sel].h}`} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <input type="number" inputMode="numeric" value={customKB} onChange={(e) => setCustomKB(e.target.value)} placeholder={DOCS[sel].kb ? `${DOCS[sel].kb} KB` : "KB target"} style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #f97316", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
            </div>
            <p style={{ fontSize: 10, color: "#64748b", margin: "7px 2px 0" }}>Width/height: {MIN_DIMENSION}–{MAX_DIMENSION}px • KB: {MIN_TARGET_KB}–{MAX_TARGET_KB} KB</p>
            {img && <button onClick={applyCustom} type="button" disabled={processing} style={{ width: "100%", padding: 9, marginTop: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 12, opacity: processing ? 0.6 : 1 }}>Apply Custom Settings →</button>}
          </div>

          {preview && (
            <>
              <div style={{ marginTop: 16, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 12, textAlign: "center" }}>
                <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 8px" }}>Photo Preview</p>
                <img src={preview} alt={`Preview ${cur.label}`} style={{ width: "100%", maxWidth: 280, maxHeight: 320, borderRadius: 10, objectFit: "contain", background: backgroundMode === "color" ? backgroundColor : "#fff", border: "1px solid #e2e8f0" }} />
                <div style={{ marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>Original: <b>{origW} × {origH} • {origKB} KB</b></div>
                  <div style={{ fontSize: 18, color: "#16a34a", lineHeight: 1.2 }}>↓</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d" }}>Output: {cur.w} × {cur.h} • {cur.kb ? `Target ≤ ${cur.kb} KB` : `${newKB || "—"} KB`}</div>
                </div>
              </div>

              <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 900 }}>Background</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>Keep original or replace with color.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button type="button" onClick={() => changeBackgroundMode("original")} disabled={processing} style={{ padding: "11px 8px", border: backgroundMode === "original" ? "2px solid #2563eb" : "1px solid #e2e8f0", borderRadius: 10, background: backgroundMode === "original" ? "#eff6ff" : "#fff", color: backgroundMode === "original" ? "#1d4ed8" : "#0f172a", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>📷 Original Background</button>
                  <button type="button" onClick={() => changeBackgroundMode("color")} disabled={processing} style={{ padding: "11px 8px", border: backgroundMode === "color" ? "2px solid #f97316" : "1px solid #e2e8f0", borderRadius: 10, background: backgroundMode === "color" ? "#fff7ed" : "#fff", color: backgroundMode === "color" ? "#ea580c" : "#0f172a", fontWeight: 800, cursor: "pointer", fontSize: 12 }}>🎨 Color Background</button>
                </div>
                {backgroundMode === "color" && (
                  <div style={{ marginTop: 12, background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: 10 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#334155" }}>Choose Background Color</p>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
                      {BG_COLORS.map((c) => (
                        <button key={c.value} type="button" aria-label={c.name} onClick={() => changeBackgroundColor(c.value)} disabled={processing} style={{ width: 32, height: 32, borderRadius: 50, border: backgroundColor === c.value ? "3px solid #0f172a" : "2px solid #cbd5e1", background: c.value, cursor: "pointer" }} />
                      ))}
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "#475569", cursor: "pointer" }}>Custom<input type="color" value={backgroundColor} onChange={(e) => changeBackgroundColor(e.target.value)} style={{ width: 36, height: 30, padding: 2, border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", cursor: "pointer" }} /></label>
                    </div>
                    <p style={{ fontSize: 10, color: "#64748b", margin: "9px 0 0", lineHeight: 1.5 }}>Original background is removed first, then color is applied. First time 5-10 sec lagega, fir instant hoga.</p>
                  </div>
                )}
              </div>

              <a href="/background-remover" style={{ display: "block", marginTop: 12, padding: "14px 15px", borderRadius: 13, textDecoration: "none", background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)", border: "1.5px solid #c7d2fe" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🎨</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b" }}>Want to change your photo background?</div><div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Tap here to open Background Remover.</div></div>
                  <div style={{ color: "#4f46e5", fontSize: 18, fontWeight: 900 }}>→</div>
                </div>
              </a>

              <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>Adjust Crop Position</p>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Horizontal</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.x} onChange={(e) => updateCrop("x", Number(e.target.value))} style={{ width: "100%" }} />
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, margin: "10px 0 4px" }}>Vertical</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.y} onChange={(e) => updateCrop("y", Number(e.target.value))} style={{ width: "100%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 9, color: "#94a3b8" }}>
                  <span>Left / Top</span>
                  <button type="button" onClick={() => { const r = { x: 0.5, y: 0.5 }; setCropPosition(r); if (img) processImage(img, getCurrent(), r); }} style={{ border: "none", background: "transparent", color: "#2563eb", fontWeight: 800, cursor: "pointer", fontSize: 10 }}>Reset Crop</button>
                  <span>Right / Bottom</span>
                </div>
              </div>
            </>
          )}

          {status && <p role="status" style={{ background: isSuccess ? "#ecfdf5" : "#fef2f2", color: isSuccess ? "#047857" : "#dc2626", padding: "9px 10px", borderRadius: 9, fontSize: 13, margin: "12px 0 0", textAlign: "center", fontWeight: 600 }}>{status}</p>}

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={download} disabled={!preview || processing} type="button" style={{ flex: 1, padding: 14, background: "#f97316", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: !preview || processing ? "not-allowed" : "pointer", opacity: !preview || processing ? 0.5 : 1 }}>{processing ? "Processing..." : `Download ${cur.label} →`}</button>
            <button onClick={clearAll} type="button" style={{ padding: "13px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 11, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Clear</button>
          </div>

          {downloadUrl && (
            <div style={{ marginTop: 12, background: "#eff6ff", border: "1.5px solid #2563eb", borderRadius: 12, padding: 12, textAlign: "center" }}>
              <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 6px" }}>📱 Mobile me Save Nahi Hua?</p>
              <p style={{ fontSize: 12, color: "#475569", margin: "0 0 10px" }}>Neeche wali photo ko <b>long-press</b> karo → <b>Save to Photos</b> dabao.</p>
              <img src={downloadUrl} alt="Ready to save" style={{ width: "100%", maxWidth: 280, borderRadius: 10, border: "1px solid #bfdbfe", background: "#fff" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <a href={downloadUrl} download={downloadName} style={{ flex: 1, padding: 12, background: "#2563eb", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 13 }}>Download Again</a>
                <button onClick={shareAgain} type="button" style={{ flex: 1, padding: 12, background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Share / Save ↗</button>
              </div>
            </div>
          )}
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0", fontWeight: 700 }}>🔒 Photo browser me hi banti hai.</p>
        </div>
        <div style={{ height: 18 }} />
        <a href="/image-dpi-changer" style={{ display: "block", background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 10, padding: "10px 12px", textDecoration: "none", fontSize: 13, color: "#15803d", fontWeight: 700, textAlign: "center" }}>Need to change photo DPI? <span style={{ color: "#16a34a", textDecoration: "underline" }}>Open DPI Changer</span> →</a>
        <div style={{ height: 30 }} />
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>How to Use</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Photo upload karo.<br /><b>Step 2:</b> Background chuno - Original ya Color.<br /><b>Step 3:</b> Document / Size / KB chuno.<br /><b>Step 4:</b> Download dabao - PC me direct, iPhone me Share / Long-press Save.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}><a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Open DPI Changer →</a></div>
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
