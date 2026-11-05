"use client";
import { useState, useRef, useEffect } from "react";

export default function BackgroundRemoverClient() {
  const [bgColor, setBgColor] = useState("transparent");
  const [status, setStatus] = useState("Upload a photo to start");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("Tap to Upload Photo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const s = document.createElement("script");
    s.type = "module";
    s.innerHTML = `
      import removeBackground from "https://esm.sh/@imgly/background-removal@1.4.5";
      window.__nexoraRemoveBg = removeBackground;
      window.dispatchEvent(new Event("nexora-bg-ready"));
    `;
    document.body.appendChild(s);
    const onReady = () => setLibReady(true);
    window.addEventListener("nexora-bg-ready", onReady);
    if (!document.querySelector('script[data-nexora-importmap]')) {
      const im = document.createElement("script");
      im.setAttribute("type", "importmap");
      im.setAttribute("data-nexora-importmap", "1");
      im.textContent = JSON.stringify({ imports: { "@imgly/background-removal": "https://esm.sh/@imgly/background-removal@1.4.5" } });
      document.head.appendChild(im);
    }
    return () => window.removeEventListener("nexora-bg-ready", onReady);
  }, []);

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
    if (!(window as any).__nexoraRemoveBg) {
      setStatus("⏳ AI Library load ho rahi hai, 5 sec ruk ke phir try karo...");
      return;
    }
    setUploadText("⏳ Loading AI...");
    setShowPreview(false);
    setStatus("⏳ AI Loading...");
    progressRef.current = 0;
    setProgress(0);
    setIsProcessing(true);
    try {
      const removeBg = (window as any).__nexoraRemoveBg;
      const blob = await removeBg(file, {
        progress: (_key: string, current: number, total: number) => {
          if (!total) return;
          const pct = Math.round((current / total) * 100);
          // FIX: Sirf aage badhega, 100 se 0 kabhi nahi hoga
          if (pct > progressRef.current) {
            progressRef.current = pct;
            setProgress(pct);
            if (pct < 30) setStatus(`⏳ AI Loading... ${pct}%`);
            else if (pct < 90) setStatus(`🤖 Background Hata Raha Hu... ${pct}%`);
            else setStatus(`✨ Almost Done... ${pct}%`);
          }
        },
      });
      progressRef.current = 100;
      setProgress(100);
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setTimeout(() => { redraw(); }, 50);
        setShowPreview(true);
        setUploadText("✅ Background Removed");
        setStatus("✅ Done! Choose background color");
        setInfo(`${img.naturalWidth}x${img.naturalHeight} • HD PNG`);
        setIsProcessing(false);
        setProgress(100);
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
        {/* HEADING - PRO FIXED */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
              ✦ FREE • HD • NO WATERMARK • {libReady ? "AI READY ✅" : "AI LOADING..."}
            </span>
          </div>
          <h1 style={{ fontSize: 38, margin: "14px 0 8px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Background<br/>Remover</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Remove background in 1 second.<br/>Transparent, White, Blue, Red - HD PNG.</p>
        </div>

        {/* TOOL BOX - CHHOTA + CLEAN */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Upload Your Photo Here</p>
          <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: 18, textAlign: "center", background: "#fff", cursor: "pointer" }}>
            <div style={{ fontSize: 28 }}>📷</div>
            <p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>{uploadText}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • 100% Private • AI in Browser</p>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          {isProcessing && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "#2563eb" }}>{status}</span>
                <span style={{ color: "#2563eb" }}>{progress}%</span>
              </div>
              <div style={{ width: "100%", height: 8, background: "#eef2f7", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.3s ease", borderRadius: 999 }} />
              </div>
            </div>
          )}
          {!isProcessing && <p style={{ fontSize: 13, fontWeight: 700, textAlign: "center", margin: "12px 0 0", color: "#2563eb" }}>{status}</p>}

          <p style={{ fontWeight: 700, fontSize: 14, margin: "16px 0 10px", textAlign: "center" }}>Choose Background</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {colors.map((c) => (
              <button key={c.val} onClick={() => { setBgColor(c.val); setTimeout(() => redraw(), 50); }} style={{ padding: "8px 14px", borderRadius: 999, border: bgColor === c.val ? "2px solid #f97316" : "1.5px solid #e2e8f0", background: bgColor === c.val ? "#fff7ed" : "#fff", color: bgColor === c.val ? "#ea580c" : "#0f172a", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{c.label}</button>
            ))}
          </div>

          {showPreview && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <canvas ref={canvasRef} style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #eee" }} />
              <p style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{info}</p>
              <button onClick={download} style={{ width: "100%", padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>Download HD PNG ↓</button>
            </div>
          )}
          {!showPreview && !isProcessing && <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 16 }}>Remove Background →</button>}
        </div>

        <div style={{ height: 70 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Earn Money With This Tool!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Passport photo ke liye White background chahiye hota hai. Studio 50 Rs leta hai. Tu WhatsApp pe ₹30 me photo ka background White karke de. Roz 20 photo = ₹600. Yehi tool use kar, 1 sec me ho jayega.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Why NEXORA No.1 Background Remover?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>Unlike remove.bg with limits, watermark and paid plans, NEXORA is <b>100% free forever, no watermark, HD PNG, 100% private</b> - your photo never leaves your phone. AI runs in browser. Choose <b>Transparent for products, White for passport, Blue for visa, Red for documents.</b></p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>How to Use?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Upload photo.<br/><b>Step 2:</b> AI removes background in 1 sec.<br/><b>Step 3:</b> Choose background and Download HD PNG.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>NEXORA vs Others</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA ✅</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Limit</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Unlimited ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>1-2 Free Only</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>No ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Paid</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Quality</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>HD PNG ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Low Quality</td></tr>
          </tbody></table>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is background remover free?</summary><p style={{ color: "#475569" }}>Yes, 100% free, no watermark, unlimited.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>How to make passport photo background white?</summary><p style={{ color: "#475569" }}>Upload, remove, select White for passport, Blue for visa.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is my photo safe?</summary><p style={{ color: "#475569" }}>Yes, AI runs in browser, photo never goes to server.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Does it work on iPhone?</summary><p style={{ color: "#475569" }}>Yes, iPhone, Android, Laptop - no app needed.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Will quality remain HD?</summary><p style={{ color: "#475569" }}>Yes, HD PNG original quality, no blur.</p></details>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/passport-photo-maker" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Try Next Tool → Passport Photo Maker</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br/>Last Updated: 5 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span>
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
