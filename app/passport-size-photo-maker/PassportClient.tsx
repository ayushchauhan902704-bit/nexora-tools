"use client";

import { useRef, useState } from "react";

type Doc = {
  label: string;
  sub: string;
  w: number;
  h: number;
  kb: number;
};

type CropPosition = {
  x: number;
  y: number;
};

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

export default function PassportClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
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
    return {
      label: hasCustom ? "Custom Size" : d.label,
      sub: `${w} × ${h}${kb ? ` • Target ≤ ${kb} KB` : " • HD"}`,
      w, h, kb,
    };
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const getSourceImage = (image: HTMLImageElement): HTMLImageElement => {
    if (image.naturalWidth <= MAX_SOURCE_DIMENSION && image.naturalHeight <= MAX_SOURCE_DIMENSION) return image;
    const scale = Math.min(MAX_SOURCE_DIMENSION / image.naturalWidth, MAX_SOURCE_DIMENSION / image.naturalHeight);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(image.naturalWidth * scale));
    c.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = c.getContext("2d");
    if (!ctx) return image;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, c.width, c.height);
    const resized = new Image();
    resized.src = c.toDataURL("image/jpeg", 0.92);
    return resized;
  };

  const createCanvas = (image: HTMLImageElement, doc: Doc, position: CropPosition): HTMLCanvasElement => {
    const c = document.createElement("canvas");
    c.width = doc.w; c.height = doc.h;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported by this browser.");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = c.width / c.height;
    let sx = 0, sy = 0, sW = image.naturalWidth, sH = image.naturalHeight;
    if (imgRatio > canvasRatio) {
      sH = image.naturalHeight; sW = sH * canvasRatio;
      const maxX = image.naturalWidth - sW; sx = maxX * clamp(position.x, 0, 1);
    } else {
      sW = image.naturalWidth; sH = sW / canvasRatio;
      const maxY = image.naturalHeight - sH; sy = maxY * clamp(position.y, 0, 1);
    }
    ctx.drawImage(image, sx, sy, sW, sH, 0, 0, c.width, c.height);
    return c;
  };

  const canvasToBlob = (targetCanvas: HTMLCanvasElement, quality: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
      targetCanvas.toBlob((blob) => resolve(blob), "image/jpeg", clamp(quality, 0.05, 0.98));
    });
  };

  const renderPreview = (c: HTMLCanvasElement) => {
    setCanvas(c);
    setPreview(c.toDataURL("image/jpeg", 0.9));
    c.toBlob((blob) => { if (blob) setNewKB(Math.max(1, Math.round(blob.size / 1024))); }, "image/jpeg", 0.9);
  };

  const processImage = async (image: HTMLImageElement, doc: Doc, position = cropPosition) => {
    setProcessing(true);
    try {
      const source = getSourceImage(image);
      if (!source.complete) {
        await new Promise<void>((resolve, reject) => {
          source.onload = () => resolve();
          source.onerror = () => reject(new Error("Unable to process the image."));
        });
      }
      const c = createCanvas(source, doc, position);
      renderPreview(c);
    } catch {
      setStatus("Unable to process this image. Please try another photo.");
      setIsSuccess(false);
    } finally { setProcessing(false); }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please select a valid JPG, JPEG, PNG, or WebP image."); setIsSuccess(false); return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("Image is too large. Please choose an image under 25 MB."); setIsSuccess(false); return;
    }
    setStatus("Processing your photo..."); setIsSuccess(false); setProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = async () => {
        setImg(image);
        setOrigW(image.naturalWidth); setOrigH(image.naturalHeight);
        setOrigKB(Math.max(1, Math.round(file.size / 1024)));
        await processImage(image, getCurrent(), cropPosition);
        setStatus("Photo ready. Choose a document or enter your own size and KB target."); setIsSuccess(true);
      };
      image.onerror = () => {
        setStatus("This image could not be opened. Please try another JPG, PNG, or WebP file."); setIsSuccess(false); setProcessing(false);
      };
      image.src = reader.result as string;
    };
    reader.onerror = () => {
      setStatus("Unable to read this image. Please try another file."); setIsSuccess(false); setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const selectDoc = async (idx: number) => {
    setSel(idx); setCustomW(""); setCustomH(""); setCustomKB("");
    const nextDoc = DOCS[idx];
    if (img) {
      setStatus("Applying document size..."); setIsSuccess(false);
      await processImage(img, nextDoc, cropPosition);
      setStatus(`${nextDoc.label} size applied successfully.`); setIsSuccess(true);
    }
  };

  const applyCustom = async () => {
    if (!img) { setStatus("Please upload a photo first."); setIsSuccess(false); return; }
    const cur = getCurrent();
    if (cur.w < MIN_DIMENSION || cur.w > MAX_DIMENSION || cur.h < MIN_DIMENSION || cur.h > MAX_DIMENSION) {
      setStatus(`Width and height must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} pixels.`); setIsSuccess(false); return;
    }
    if (customKB !== "" && (cur.kb < MIN_TARGET_KB || cur.kb > MAX_TARGET_KB)) {
      setStatus(`KB target must be between ${MIN_TARGET_KB} and ${MAX_TARGET_KB} KB.`); setIsSuccess(false); return;
    }
    setStatus("Applying custom size..."); setIsSuccess(false);
    await processImage(img, cur, cropPosition);
    setStatus(`${cur.w} × ${cur.h} pixels applied${cur.kb ? ` • Target ≤ ${cur.kb} KB` : ""}.`); setIsSuccess(true);
  };

  const updateCrop = async (axis: "x" | "y", value: number) => {
    const next = { ...cropPosition, [axis]: value };
    setCropPosition(next);
    if (img) await processImage(img, getCurrent(), next);
  };

  const compressToTarget = async (sourceCanvas: HTMLCanvasElement, targetKB: number): Promise<{ blob: Blob | null; canvas: HTMLCanvasElement }> => {
    const targetBytes = targetKB * 1024;
    let bestUnderTarget: Blob | null = null;
    let low = 0.05; let high = 0.98;
    for (let i = 0; i < 10; i++) {
      const quality = (low + high) / 2;
      const blob = await canvasToBlob(sourceCanvas, quality);
      if (!blob) continue;
      if (blob.size <= targetBytes) { bestUnderTarget = blob; low = quality; } else { high = quality; }
    }
    if (bestUnderTarget) return { blob: bestUnderTarget, canvas: sourceCanvas };
    let workingCanvas = sourceCanvas;
    for (let step = 0; step < 8; step++) {
      const scale = 0.9;
      const next = document.createElement("canvas");
      next.width = Math.max(50, Math.floor(workingCanvas.width * scale));
      next.height = Math.max(50, Math.floor(workingCanvas.height * scale));
      const ctx = next.getContext("2d");
      if (!ctx) break;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, next.width, next.height);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(workingCanvas, 0, 0, workingCanvas.width, workingCanvas.height, 0, 0, next.width, next.height);
      let lowQ = 0.05; let highQ = 0.95; let under: Blob | null = null;
      for (let i = 0; i < 8; i++) {
        const q = (lowQ + highQ) / 2;
        const blob = await canvasToBlob(next, q);
        if (!blob) continue;
        if (blob.size <= targetBytes) { under = blob; lowQ = q; } else { highQ = q; }
      }
      if (under) return { blob: under, canvas: next };
      workingCanvas = next;
    }
    const finalBlob = await canvasToBlob(workingCanvas, 0.05);
    return { blob: finalBlob, canvas: workingCanvas };
  };

  const download = async () => {
    if (!canvas) { setStatus("Please upload a photo first."); setIsSuccess(false); return; }
    const s = getCurrent();
    if (s.w < MIN_DIMENSION || s.w > MAX_DIMENSION || s.h < MIN_DIMENSION || s.h > MAX_DIMENSION) {
      setStatus(`Width and height must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} pixels.`); setIsSuccess(false); return;
    }
    if (s.kb > 0 && (s.kb < MIN_TARGET_KB || s.kb > MAX_TARGET_KB)) {
      setStatus(`KB target must be between ${MIN_TARGET_KB} and ${MAX_TARGET_KB} KB.`); setIsSuccess(false); return;
    }
    setProcessing(true);
    setStatus(s.kb > 0 ? `Optimizing image to stay within ${s.kb} KB...` : "Preparing your HD photo..."); setIsSuccess(false);
    try {
      let finalCanvas = canvas;
      let blob: Blob | null = null;
      if (s.kb > 0) {
        const result = await compressToTarget(canvas, s.kb);
        blob = result.blob; finalCanvas = result.canvas;
      } else { blob = await canvasToBlob(canvas, 0.94); }
      if (!blob) throw new Error("Image encoding failed.");
      const actualKB = blob.size / 1024;
      setNewKB(Math.max(1, Math.round(actualKB)));
      const targetWasMet = s.kb === 0 || actualKB <= s.kb;
      const url = URL.createObjectURL(blob);
      const safeLabel = hasCustom ? `Custom-${s.w}x${s.h}` : s.label.replace(/[^a-zA-Z0-9]+/g, "-");
      const fileName = `NEXORA-${safeLabel}-${finalCanvas.width}x${finalCanvas.height}${s.kb ? `-${s.kb}KB` : "-HD"}.jpg`;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (isIOS) {
        const win = window.open("", "_blank");
        if (win) {
          win.location.href = url;
          setStatus(targetWasMet ? `Photo ready (${actualKB.toFixed(1)} KB). Use Share → Save to Photos.` : `Photo created at ${actualKB.toFixed(1)} KB. Use Share → Save to Photos.`);
          setIsSuccess(true);
        } else {
          window.location.href = url;
          setStatus("Photo opened. Use Share → Save to Photos."); setIsSuccess(true);
        }
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click(); a.remove();
        setStatus(targetWasMet ? `Download complete • ${actualKB.toFixed(1)} KB` : `Download complete • ${actualKB.toFixed(1)} KB. The requested target could not be reached at the selected dimensions.`);
        setIsSuccess(targetWasMet);
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      // ✅ FIXED - gtag type error fixed
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "passport_photo_download", {
          event_category: "Image Tools",
          event_label: s.label,
          target_kb: s.kb || undefined,
          output_width: finalCanvas.width,
          output_height: finalCanvas.height,
          output_kb: Number(actualKB.toFixed(1)),
        });
      }
    } catch {
      setStatus("Unable to create the photo. Please try again with another image."); setIsSuccess(false);
    } finally { setProcessing(false); }
  };

  const clearAll = () => {
    setImg(null); setPreview(""); setStatus(""); setIsSuccess(false);
    setCustomW(""); setCustomH(""); setCustomKB(""); setSel(0);
    setCanvas(null); setOrigW(0); setOrigH(0); setOrigKB(0); setNewKB(0);
    setCropPosition({ x: 0.5, y: 0.5 });
    if (fileRef.current) fileRef.current.value = "";
  };

  const cur = getCurrent();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>✦ FREE • HD • NO WATERMARK • PRIVATE</span>
          </div>
          <h1 style={{ fontSize: 36, margin: "12px 0 6px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Passport Photo<br />Maker</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0, lineHeight: 1.5 }}>Create passport, visa, ID and application photos with custom dimensions and KB targets.</p>
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
              return (
                <button key={`${s.label}-${i}`} onClick={() => selectDoc(i)} type="button" style={{ padding: "7px 9px", borderRadius: 9, border: isActive ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: isActive ? "#fff7ed" : "#fff", color: isActive ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 11, lineHeight: 1.3, textAlign: "left", whiteSpace: "nowrap", flexShrink: 0 }}>{s.label}<br /><span style={{ fontSize: 9, fontWeight: 600, color: "#64748b" }}>{s.sub}</span></button>
              );
            })}
          </div>
          <p style={{ fontWeight: 800, fontSize: 12, margin: "10px 0 6px" }}>Custom Width / Height / KB</p>
          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: 9 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input type="number" inputMode="numeric" min={MIN_DIMENSION} max={MAX_DIMENSION} value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder={`W • ${DOCS[sel].w}`} aria-label="Custom width" style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <div style={{ display: "flex", alignItems: "center", fontWeight: 800, color: "#94a3b8", fontSize: 13 }}>×</div>
              <input type="number" inputMode="numeric" min={MIN_DIMENSION} max={MAX_DIMENSION} value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder={`H • ${DOCS[sel].h}`} aria-label="Custom height" style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #2563eb", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
              <input type="number" inputMode="numeric" min={MIN_TARGET_KB} max={MAX_TARGET_KB} value={customKB} onChange={(e) => setCustomKB(e.target.value)} placeholder={DOCS[sel].kb ? `${DOCS[sel].kb} KB` : "KB target"} aria-label="Target file size in KB" style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: "1.5px solid #f97316", fontSize: 13, fontWeight: 700, outline: "none", background: "#fff", color: "#0f172a", minWidth: 0 }} />
            </div>
            <p style={{ fontSize: 10, color: "#64748b", margin: "7px 2px 0", lineHeight: 1.4 }}>Width/height: {MIN_DIMENSION}–{MAX_DIMENSION}px • KB target: {MIN_TARGET_KB}–{MAX_TARGET_KB} KB</p>
            {img && <button onClick={applyCustom} type="button" disabled={processing} style={{ width: "100%", padding: 9, marginTop: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer", fontSize: 12, opacity: processing ? 0.6 : 1 }}>Apply Custom Settings →</button>}
          </div>
          {preview && (
            <>
              <div style={{ marginTop: 16, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 12, textAlign: "center" }}>
                <p style={{ fontWeight: 800, fontSize: 13, margin: "0 0 8px" }}>Photo Preview</p>
                <img src={preview} alt={`Passport photo preview for ${cur.label}`} style={{ width: "100%", maxWidth: 280, maxHeight: 320, borderRadius: 10, objectFit: "contain", background: "#fff", border: "1px solid #e2e8f0" }} />
                <div style={{ marginTop: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>Original: <b style={{ color: "#0f172a" }}>{origW} × {origH} • {origKB} KB</b></div>
                  <div style={{ fontSize: 18, color: "#16a34a", lineHeight: 1.2 }}>↓</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#15803d" }}>Output: {cur.w} × {cur.h} • {cur.kb ? `Target ≤ ${cur.kb} KB` : `${newKB || "—"} KB`}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 12, margin: "0 0 8px" }}>Adjust Crop Position</p>
                <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 10px" }}>Move the image if the face or shoulders are not centered.</p>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Horizontal</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.x} onChange={(e) => updateCrop("x", Number(e.target.value))} style={{ width: "100%" }} />
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, margin: "10px 0 4px" }}>Vertical</label>
                <input type="range" min="0" max="1" step="0.01" value={cropPosition.y} onChange={(e) => updateCrop("y", Number(e.target.value))} style={{ width: "100%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 9, color: "#94a3b8" }}>
                  <span>Left / Top</span>
                  <button type="button" onClick={() => { setCropPosition({ x: 0.5, y: 0.5 }); if (img) processImage(img, getCurrent(), { x: 0.5, y: 0.5 }); }} style={{ border: "none", background: "transparent", color: "#2563eb", fontWeight: 800, cursor: "pointer", fontSize: 10 }}>Reset Crop</button>
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
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0", fontWeight: 700 }}>🔒 Your photo is processed in your browser and is not uploaded by this tool.</p>
        </div>
        <div style={{ height: 18 }} />
        <a href="/image-dpi-changer" style={{ display: "block", background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 10, padding: "10px 12px", textDecoration: "none", fontSize: 13, color: "#15803d", fontWeight: 700, textAlign: "center" }}>Need to change photo DPI? <span style={{ color: "#16a34a", textDecoration: "underline" }}>Open DPI Changer</span> →</a>
        <div style={{ height: 30 }} />
        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Quick Tip</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>This free tool can create passport, visa, ID and application photos with custom pixel dimensions and file-size targets.</p>
        </div>
        <div style={{ height: 30 }} />
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Common Passport & Application Photo Sizes</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Passport & Visa:</b> India 413 × 531 pixels, USA 600 × 600 pixels, and several 35 × 45 mm formats are included.<br /><b>SSC / Railway / IBPS:</b> 200 × 230 pixels with a 20 KB target preset.<br /><b>UPSC / Bank:</b> 300 × 350 pixels with a 50 KB target preset.<br /><b>PAN:</b> 400 × 300 pixels • <b>Aadhaar / Voter ID:</b> 300 × 400 pixels • <b>Driving License:</b> 300 × 350 pixels.<br /><br /><strong>Always verify the latest photo dimensions and file-size requirements on the official application or authority website before submitting.</strong></p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>How to Use the Passport Photo Maker</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Upload your photo.<br /><b>Step 2:</b> Select Passport, Visa, SSC 20 KB, UPSC 50 KB, or another available preset.<br /><b>Step 3:</b> If required, enter your own width, height and KB target.<br /><b>Step 4:</b> Adjust the crop position if necessary.<br /><b>Step 5:</b> Download your JPEG photo.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Why Use NEXORA?</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Benefit</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Document presets</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>25 presets</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Faster setup</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Custom dimensions</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Yes</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Flexible output</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>KB target</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>≤ target</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Better control</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>None</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Clean output</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Browser processing</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Yes</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Photo stays on device</td></tr>
          </tbody></table>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How can I make a 20 KB photo?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>Select the SSC, IBPS or Railway 20 KB preset, or enter 20 in the KB field. The tool compresses the JPEG to stay at or below the target whenever the selected dimensions allow it.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How can I make a 50 KB photo?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>Select the UPSC or Bank Form preset, or enter 50 in the KB field. The compressor automatically optimizes the JPEG.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Can I enter my own photo size?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>Yes. Enter your required width and height in pixels. You can also enter a maximum KB target.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Can I move the crop?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>Yes. Use the horizontal and vertical crop controls below the preview to reposition the image before downloading.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my photo uploaded to a server?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>No. The image processing in this tool happens in your browser. The photo itself is not uploaded by the tool.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Does this tool automatically remove the background?</summary><p style={{ color: "#475569", lineHeight: 1.7 }}>No. This tool creates the requested photo dimensions and preserves the uploaded image. It does not automatically remove or replace the original background.</p></details>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Open DPI Changer →</a>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: NEXORA<br />Last Updated: 15 Nov 2026 • Free & Private</p>
      </main>
      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10–1200</span><span style={{ padding: "0 18px" }}>✦ Image Compressor</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10–1200</span><span style={{ padding: "0 18px" }}>✦ Image Compressor</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span>
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
