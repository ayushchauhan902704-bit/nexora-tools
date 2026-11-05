"use client";
import { useState, useRef } from "react";

export default function CompressImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [target, setTarget] = useState(20);
  const [customKB, setCustomKB] = useState("");
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

  const getTargetKB = () => {
    let v = parseInt(customKB);
    if (isNaN(v)) v = target;
    if (v < 10) v = 10;
    if (v > 1000) v = 1000;
    return v;
  };

  // EXACT COMPRESS - Size + Quality dono kam karega
  const makeBlob = (img: HTMLImageElement, scale: number, quality: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      let w = Math.max(80, Math.round(img.width * scale));
      let h = Math.max(80, Math.round(img.height * scale));
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
    });
  };

  const compress = async () => {
    if (!file) { setError("Please upload a photo first."); return; }
    const finalKB = getTargetKB();
    setTarget(finalKB); setCustomKB(String(finalKB));
    setLoading(true); setError("");
    try {
      const img = new Image();
      img.src = preview;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const targetBytes = finalKB * 1024;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;

      // Pehle normal size pe try karo, phir chhota karte jao jab tak exact na aaye
      const scales = [1, 0.85, 0.7, 0.55, 0.4, 0.28, 0.18, 0.12];
      const qualities = [0.92, 0.8, 0.65, 0.5, 0.35, 0.2, 0.12];

      outer: for (const scale of scales) {
        for (const q of qualities) {
          const blob = await makeBlob(img, scale, q);
          if (!blob) continue;
          const diff = Math.abs(blob.size - targetBytes);
          // Jo sabse close hai usko yaad rakho
          if (diff < bestDiff) { bestDiff = diff; bestBlob = blob; }
          // Agar target se thoda neeche aa gaya aur 90% se upar hai to wahi best hai - EXACT
          if (blob.size <= targetBytes && blob.size >= targetBytes * 0.85) {
            bestBlob = blob; break outer;
          }
          // Agar is scale pe bhi bahut bada hai to quality aur kam karne ka fayda nahi, scale chhota karo
          if (blob.size > targetBytes && q === 0.12) break;
          if (blob.size < targetBytes * 0.6) break; // Bahut chhota ho gaya, agla scale try mat karo
        }
        if (bestBlob && bestBlob.size <= targetBytes && bestBlob.size >= targetBytes * 0.85) break;
      }

      if (bestBlob) {
        setCompressedUrl(URL.createObjectURL(bestBlob));
        setNewSize(bestBlob.size);
      }
    } catch { setError("Something went wrong. Please try another photo."); }
    setLoading(false);
  };

  const download = () => {
    if (!compressedUrl) return;
    const a = document.createElement("a");
    a.href = compressedUrl; a.download = `nexora-${target}kb.jpg`; a.click();
  };

  const formatSize = (b: number) => b >= 1024 * 1024 ? (b / (1024 * 1024)).toFixed(2) + " MB" : (b / 1024).toFixed(1) + " KB";
  const savedPercent = origSize && newSize ? Math.round((1 - newSize / origSize) * 100) : 0;
  const isExact = newSize > 0 && newSize <= target * 1024;

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
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: "0.5px" }}>✦ FREE • NO WATERMARK • 100% PRIVATE</span>
          <h1 style={{ fontSize: 44, margin: "16px 0 8px", lineHeight: 1.1, letterSpacing: "-1px", fontWeight: 900, background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Image Compressor</h1>
          <p style={{ color: "#64748b", fontSize: 17, margin: 0, lineHeight: 1.6 }}>Reduce image to any size you want.<br/>For UPSC, Passport, SSC, College Form.</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Upload Your Photo Here</p>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div onClick={() => inputRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: preview ? 10 : 18, textAlign: "center", cursor: "pointer", background: "#fff" }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 10, objectFit: "contain" }} /> : <><div style={{ fontSize: 28 }}>📷</div><p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>Tap to Upload Photo</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • 100% Private</p></>}
          </div>

          {file && <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "10px 0 0" }}>Original: <b style={{ color: "#0f172a" }}>{formatSize(origSize)}</b> • {file.name}</p>}

          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 12, padding: "10px 12px", marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number" min={10} max={1000} value={customKB}
                onChange={(e) => { setCustomKB(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setTarget(Math.min(1000, Math.max(10, v))); }}
                placeholder="Kitne KB ka chahiye? Type kro"
                style={{ flex: 1, padding: "11px 12px", borderRadius: 10, border: "1.5px solid #2563eb", fontSize: 14, fontWeight: 600, outline: "none", background: "#fff", color: "#0f172a" }}
              />
              <span style={{ fontWeight: 800, fontSize: 14, flexShrink: 0 }}>KB</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 2, whiteSpace: "nowrap", scrollbarWidth: "none" }}>
              {[10, 15, 20, 30, 40, 50, 80, 100, 200, 500].map(s => (
                <button key={s} onClick={() => { setTarget(s); setCustomKB(String(s)); }} style={{ padding: "6px 10px", borderRadius: 999, border: target === s ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: target === s ? "#fff7ed" : "#fff", color: target === s ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>{s}KB</button>
              ))}
            </div>
          </div>

          {error && <p style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "14px 0 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={compress} disabled={loading} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>{loading ? "Compressing... Exact Size Bana Raha Hu" : "Compress Image →"}</button>
            <button onClick={() => { setFile(null); setPreview(""); setCompressedUrl(""); setError(""); setCustomKB(""); setTarget(20); }} style={{ padding: "15px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Clear</button>
          </div>
        </div>

        {compressedUrl && (
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, marginTop: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
            <p style={{ textAlign: "center", fontWeight: 800, fontSize: 16, margin: "0 0 4px" }}>✅ Ho Gaya!</p>
            <p style={{ textAlign: "center", fontSize: 18, fontWeight: 900, margin: "0 0 6px", color: isExact ? "#2563eb" : "#dc2626" }}>{formatSize(origSize)} → {formatSize(newSize)}</p>
            <p style={{ textAlign: "center", fontSize: 13, color: isExact ? "#16a34a" : "#dc2626", margin: "0 0 14px", fontWeight: 700 }}>{isExact ? `Perfect! ${target}KB ke andar aa gaya • ${savedPercent}% Size Kam Hua` : `Target ${target}KB tha, ${formatSize(newSize)} hua`}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 10, textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#64748b", margin: "0 0 8px" }}>BEFORE • {formatSize(origSize)}</p>
                <img src={preview} alt="Before" style={{ width: "100%", height: 140, objectFit: "contain", borderRadius: 8, background: "#fff" }} />
              </div>
              <div style={{ background: "#ecfdf5", borderRadius: 12, padding: 10, textAlign: "center", border: "1px solid #bbf7d0" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#047857", margin: "0 0 8px" }}>AFTER • {formatSize(newSize)}</p>
                <img src={compressedUrl} alt="After" style={{ width: "100%", height: 140, objectFit: "contain", borderRadius: 8, background: "#fff" }} />
              </div>
            </div>
            <button onClick={download} style={{ width: "100%", padding: 15, background: "#0f172a", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 14 }}>Download {target}KB Photo ↓</button>
          </div>
        )}

        <div style={{ height: 70 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Earn Money With This Tool!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Gaon / Mohalle me bahut logo ko form ke liye 20KB photo chahiye hota hai. Cyber cafe 20-30 Rs leta hai. Tu WhatsApp pe ₹20 per photo compress karke de. Roz 20 photo = ₹400. Koi paisa nahi lagna, sirf ye free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>What is Image Compressor?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>An <b>image compressor</b> reduces your photo size without losing much quality. If your photo is 2MB and form asks for <b>20KB photo</b>, this tool will make it 20KB in 2 seconds. It works for <b>UPSC photo compressor 20KB, Passport photo 20KB, SSC, College form</b>.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>How to Use?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Upload photo.<br/><b>Step 2:</b> Type kitni KB chahiye - jaise 15, 20, 37.<br/><b>Step 3:</b> Compress and Download.</p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How to compress image to 20KB?</summary><p style={{ color: "#475569" }}>Upload photo, 20 type karo, Compress dabao, download karo.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kya main 15KB ya 37KB bhi kar sakta hu?</summary><p style={{ color: "#475569" }}>Haan, 10KB se 1000KB tak kuch bhi type kar sakte ho.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my photo safe?</summary><p style={{ color: "#475569" }}>Yes. Photo browser me hi compress hoti hai, server pe nahi jati.</p></details>
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
