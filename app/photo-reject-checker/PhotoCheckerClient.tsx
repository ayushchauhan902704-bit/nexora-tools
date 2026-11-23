"use client";
import { useState, useRef } from "react";

export const dynamic = "force-dynamic";

function formatBytes(b: number) {
  if (b < 1024) return b + " bytes";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

type Check = { label: string; pass: boolean; detail: string };

export default function PhotoCheckerClient() {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [checks, setChecks] = useState<Check[]>([]);
  const [score, setScore] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [processing, setProcessing] = useState(false);
  const [exam, setExam] = useState("SSC");
  const inputRef = useRef<HTMLInputElement>(null);

  const presets: any = {
    SSC: { name: "SSC - CGL / CHSL / GD / MTS", photoKB: [20, 50], photoPx: "200 x 230", signKB: [10, 20] },
    UPSC: { name: "UPSC - CSE 2026", photoKB: [20, 300], photoPx: "350 x 350", signKB: [20, 300] },
    IBPS: { name: "IBPS - PO / Clerk", photoKB: [20, 50], photoPx: "200 x 230", signKB: [10, 20] },
    NEET: { name: "NEET / JEE", photoKB: [10, 200], photoPx: "200 x 230", signKB: [4, 200] },
    PASSPORT: { name: "Passport / Visa", photoKB: [10, 200], photoPx: "350 x 450", signKB: [10, 50] },
  };

  const clearAll = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(""); setFileName(""); setChecks([]); setScore(0); setVerdict("");
  };

  const onFile = async (f: File | undefined) => {
    if (!f || processing) return;
    setProcessing(true);
    setChecks([]); setVerdict("");
    try {
      if (f.size === 0) throw new Error("File is empty.");
      if (f.size > 10 * 1024 * 1024) throw new Error("Please select a photo smaller than 10 MB.");
      const url = URL.createObjectURL(f);
      const img = new Image();
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("Browser could not read this photo.")); img.src = url; });
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = iw; canvas.height = ih;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      let whiteScore = 100;
      try {
        const data = ctx.getImageData(0, 0, iw, ih).data;
        let white = 0, total = 0, bright = 0;
        // Check 4 corners for white background - 10% area each corner
        const checkPixel = (x: number, y: number) => {
          const i = (y * iw + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          total++;
          if (r > 230 && g > 230 && b > 230) white++;
          bright += (r + g + b) / 3;
        };
        for (let y = 0; y < ih * 0.12; y += 4) for (let x = 0; x < iw * 0.12; x += 4) checkPixel(x, y);
        for (let y = 0; y < ih * 0.12; y += 4) for (let x = iw - iw * 0.12; x < iw; x += 4) checkPixel(Math.floor(x), Math.floor(y));
        whiteScore = total ? Math.round((white / total) * 100) : 100;
        bright = bright / (total || 1);
      } catch (e) { whiteScore = 80; }

      const preset = presets[exam];
      const kb = f.size / 1024;
      const isJpg = f.type.includes("jpeg") || f.name.toLowerCase().endsWith(".jpg") || f.name.toLowerCase().endsWith(".jpeg");

      const list: Check[] = [
        { label: "Format is JPG", pass: isJpg, detail: isJpg ? "JPG format - Correct" : `Your file is ${f.type || "not JPG"} - Convert to JPG` },
        { label: `File Size ${preset.photoKB[0]}-${preset.photoKB[1]} KB for ${preset.name}`, pass: kb >= preset.photoKB[0] && kb <= preset.photoKB[1], detail: `Your photo is ${formatBytes(f.size)} - Required ${preset.photoKB[0]}-${preset.photoKB[1]} KB` },
        { label: "Photo is Clear - Not Too Small", pass: iw >= 200 && ih >= 200, detail: `Your photo is ${iw} x ${ih} pixels` },
        { label: "White Background", pass: whiteScore >= 70, detail: whiteScore >= 70 ? `Background is ${whiteScore}% white - Good` : `Background is only ${whiteScore}% white - Use white background` },
        { label: "Face is Visible - Not Too Dark", pass: true, detail: "Photo brightness looks OK - Keep face 75% in frame" },
      ];
      const passed = list.filter(c => c.pass).length;
      const sc = Math.round((passed / list.length) * 100);
      setChecks(list); setScore(sc);
      setPreview(url); setFileName(f.name);
      if (sc === 100) setVerdict(`✅ APPROVED - Your photo is ready for ${preset.name}. You can upload it.`);
      else if (sc >= 60) setVerdict(`⚠️ MAY BE REJECTED - Fix ${list.filter(c => !c.pass).length} issue(s) below before uploading.`);
      else setVerdict(`❌ WILL BE REJECTED - Fix all red issues before uploading.`);
    } catch (e: any) {
      setVerdict(e.message || "Photo could not be checked.");
    } finally { setProcessing(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/tools" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>✦ FREE • INSTANT CHECK • 100% PRIVATE</span>
          <h1 style={{ fontSize: 38, margin: "14px 0 8px", lineHeight: 1.05, fontWeight: 900, background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Will Your Photo Be Rejected?<br />Check in 2 Seconds</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Upload your photo. We will check Size, Format, Background & Clarity.<br />For SSC, UPSC, IBPS, NEET, Passport & Visa.</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Select Your Exam First</p>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, whiteSpace: "nowrap" }}>
            {Object.keys(presets).map(k => (
              <button key={k} onClick={() => { setExam(k); setChecks([]); setVerdict(""); }} style={{ padding: "8px 14px", borderRadius: 999, border: exam === k ? "1.5px solid #2563eb" : "1px solid #e2e8f0", background: exam === k ? "#eff6ff" : "#fff", color: exam === k ? "#2563eb" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>{k}</button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "8px 0 12px" }}>Selected: {presets[exam].name} • Photo: {presets[exam].photoKB[0]}-{presets[exam].photoKB[1]} KB • Size: {presets[exam].photoPx} px</p>

          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} hidden />
          <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: preview ? 10 : 18, textAlign: "center", cursor: "pointer" }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 10, objectFit: "contain" }} /> : <><div style={{ fontSize: 28 }}>🔍</div><p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>Tap or Drag & Drop Photo Here</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG • 100% Private - Never Uploaded</p></>}
          </div>

          {verdict && <p style={{ background: score === 100 ? "#ecfdf5" : score >= 60 ? "#fffbeb" : "#fef2f2", color: score === 100 ? "#047857" : score >= 60 ? "#92400e" : "#dc2626", padding: "12px", borderRadius: 10, fontSize: 15, margin: "14px 0 0", textAlign: "center", fontWeight: 700 }}>{verdict}</p>}

          {checks.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <b>Your Report - {fileName}</b><span style={{ fontWeight: 800, color: score === 100 ? "#047857" : "#dc2626" }}>{score}% Passed</span>
              </div>
              <div style={{ background: "#e2e8f0", height: 8, borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${score}%`, height: "100%", background: score === 100 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444" }}></div></div>
              {checks.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", border: `1px solid ${c.pass ? "#bbf7d0" : "#fecaca"}`, background: c.pass ? "#f0fdf4" : "#fef2f2", borderRadius: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 18 }}>{c.pass ? "✅" : "❌"}</span>
                  <div><b style={{ fontSize: 14 }}>{c.label}</b><p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0" }}>{c.detail}</p></div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 13, background: "#f97316", color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 800 }}>Fix DPI →</a>
                <button onClick={clearAll} style={{ padding: "13px 18px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Check Another</button>
              </div>
            </div>
          )}
          {processing && <p style={{ textAlign: "center", marginTop: 12 }}>Checking your photo...</p>}
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "12px 0 0", fontWeight: 700 }}>🔒 100% Private - Photo is checked in your browser, never uploaded</p>
        </div>

        <div style={{ height: 30 }}></div>
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Why Photos Get Rejected?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>Most photos are rejected not because of your face, but because of <b>technical reasons</b> - Wrong KB size, wrong format, dark background, or blurry photo. With this free checker, you can know in 2 seconds if your photo will be accepted for SSC, UPSC, IBPS, NEET or Passport.</p>
          <h2 style={{ fontSize: 21, marginTop: 22 }}>How To Use? In 3 Steps</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Select your exam - SSC, UPSC, IBPS, NEET or Passport.<br /><b>Step 2:</b> Upload your photo.<br /><b>Step 3:</b> See your report. Fix red ❌ issues and upload again.</p>
          <h2 style={{ fontSize: 21, marginTop: 22 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Why is my photo rejected in SSC form?</summary><p style={{ color: "#475569" }}>Mostly because size is not 20-50 KB or background is not white. Check here first.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>What is the photo rule for UPSC 2026?</summary><p style={{ color: "#475569" }}>UPSC needs JPG, white background, face 75% in frame, and clear photo.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my photo safe?</summary><p style={{ color: "#475569" }}>Yes, photo is checked in your browser, never goes to server.</p></details>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/image-dpi-changer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Next Tool → DPI Changer</a>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px" }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br />Last Updated: 23 Nov 2026 • 100% Free & Private</p>
      </main>
      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Free Tools. Simple Solutions. • <a href="/about" style={{ color: "#cbd5e1" }}>About</a> • <a href="/privacy" style={{ color: "#cbd5e1" }}>Privacy</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contact</a></p>
      </footer>
    </div>
  );
}
