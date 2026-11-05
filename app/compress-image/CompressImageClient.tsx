"use client";
import { useState, useRef } from "react";

const SIZES = [20, 50, 100, 200, 300, 500];

export default function CompressImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [target, setTarget] = useState(20);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please upload only JPG, PNG or WebP image."); return; }
    setError(""); setFile(f); setOrigSize(f.size); setCompressedUrl(""); setNewSize(0);
    setPreview(URL.createObjectURL(f));
  };

  const compress = async () => {
    if (!file) { setError("Please upload a photo first."); return; }
    setLoading(true); setError("");
    try {
      const img = new Image();
      img.src = preview;
      await new Promise((res) => (img.onload = res));
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      // Smart resize if too big
      const maxDim = 1600;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      let quality = 0.9;
      let blob: Blob | null = null;
      const targetBytes = target * 1024;
      // Try quality loop to reach target
      for (let i = 0; i < 8; i++) {
        blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
        if (!blob) break;
        if (blob.size <= targetBytes || quality <= 0.1) break;
        quality -= 0.12;
      }
      if (blob) {
        setCompressedUrl(URL.createObjectURL(blob));
        setNewSize(blob.size);
      }
    } catch { setError("Something went wrong. Please try another photo."); }
    setLoading(false);
  };

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl; a.download = `nexora-compressed-${target}kb.jpg`; a.click();
  };

  const formatKB = (b: number) => (b / 1024).toFixed(1) + " KB";

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 18px 10px" }}>
        {/* HEADING - BLUE + CENTER */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 34, margin: "0 0 8px", color: "#2563eb", lineHeight: 1.2 }}>Image Compressor</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Reduce image to 20KB, 50KB, 100KB, 200KB.<br/>For UPSC, Passport, SSC, College Form. Free, No Watermark.</p>
        </div>

        {/* TOOL BOX - WHITE */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 12px", textAlign: "center" }}>Upload Your Photo Here</p>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div onClick={() => inputRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: preview ? 12 : 28, textAlign: "center", cursor: "pointer", background: "#ffffff" }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, objectFit: "contain" }} /> : <><div style={{ fontSize: 32 }}>📷</div><p style={{ fontWeight: 700, margin: "8px 0 4px" }}>Tap to Upload Photo</p><p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • 100% Private</p></>}
          </div>

          {file && <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "12px 0 0" }}>Original: <b style={{ color: "#0f172a" }}>{formatKB(origSize)}</b> • {file.name}</p>}

          <p style={{ fontWeight: 700, fontSize: 14, margin: "18px 0 10px", textAlign: "center" }}>Select Target Size</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {SIZES.map(s => (
              <button key={s} onClick={() => setTarget(s)} style={{ padding: "9px 16px", borderRadius: 999, border: target === s ? "2px solid #f97316" : "1.5px solid #e2e8f0", background: target === s ? "#fff7ed" : "#fff", color: target === s ? "#ea580c" : "#0f172a", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>{s}KB</button>
            ))}
          </div>

          {error && <p style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "14px 0 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={compress} disabled={loading} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>{loading ? "Compressing..." : "Compress Image →"}</button>
            <button onClick={() => { setFile(null); setPreview(""); setCompressedUrl(""); setError(""); }} style={{ padding: "15px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Clear</button>
          </div>

          {compressedUrl && (
            <div style={{ background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 14, padding: 14, marginTop: 16, textAlign: "center" }}>
              <b>✅ Done! {formatKB(origSize)} → {formatKB(newSize)}</b>
              <p style={{ fontSize: 13, color: "#047857", margin: "6px 0 12px" }}>Your photo is ready for form upload.</p>
              <button onClick={download} style={{ padding: "12px 24px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Download {target}KB Photo ↓</button>
            </div>
          )}
        </div>

        <div style={{ height: 40 }}></div>

        {/* EARNING BOX */}
        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Earn Money With This Tool!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Gaon / Mohalle me bahut logo ko form ke liye 20KB photo chahiye hota hai. Cyber cafe 20-30 Rs leta hai. Tu WhatsApp pe ₹20 per photo compress karke de. Roz 20 photo = ₹400. Koi paisa nahi lagna, sirf ye free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        {/* CONTENT */}
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>What is Image Compressor?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>An <b>image compressor</b> reduces your photo size without losing much quality. If your photo is 2MB and form asks for <b>20KB photo</b>, this tool will make it 20KB in 2 seconds. It works for <b>UPSC photo compressor 20KB, Passport photo 20KB, SSC, College form</b> - all forms.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>How to Use?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Upload your photo.<br/><b>Step 2:</b> Select target size like 20KB or 50KB.<br/><b>Step 3:</b> Click Compress and Download.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How to compress image to 20KB?</summary><p style={{ color: "#475569" }}>Upload photo, select 20KB, click Compress, download. Free for UPSC, Passport forms.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is this image compressor free?</summary><p style={{ color: "#475569" }}>Yes, 100% free. No login, no watermark.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Will quality remain good?</summary><p style={{ color: "#475569" }}>Yes, it keeps HD quality as much as possible for form upload.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my photo safe?</summary><p style={{ color: "#475569" }}>Yes. Photo is processed in your browser only, never uploaded.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Can I compress for UPSC / Passport?</summary><p style={{ color: "#475569" }}>Yes, for UPSC, SSC, Passport, College forms - 20KB, 50KB, 100KB.</p></details>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/ai-text-humanizer" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Try Next Tool → AI Text Humanizer</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br/>Last Updated: 5 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span>
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
