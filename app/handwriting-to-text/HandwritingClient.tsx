"use client";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";

declare global { interface Window { puter: any } }

export default function HandwritingClient() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [puterReady, setPuterReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (window.puter) setPuterReady(true); }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max = 1600;
          let w = img.width, h = img.height;
          if (w > max) { h = (h * max) / w; w = max; }
          if (h > max) { w = (w * max) / h; h = max; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h); }
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please upload only JPG, PNG or WebP image."); return; }
    setError(""); setText("");
    const compressed = await compressImage(f);
    setImage(compressed);
  };

  const doAI = async () => {
    if (!image) { setError("Please upload a photo first."); return; }
    if (!window.puter) { setError("Puter load ho raha hai, 2 sec ruk ke dobara dabao."); return; }
    setLoading(true); setError(""); setText("");
    try {
      const prompt = `You are the best handwriting expert. Read this handwritten page carefully and transcribe EXACTLY. Rules: 1. Transcribe EXACTLY what is written. 2. Keep line breaks PROPER. 3. If unclear, guess logical word. 4. Fix spelling, keep Hinglish as written. 5. Output ONLY clean typed text, no explanation, no markdown.`;
      let response: any;
      try { response = await window.puter.ai.chat(prompt, image); }
      catch (e) { response = await window.puter.ai.chat([{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] }]); }
      let result = "";
      if (typeof response === "string") result = response;
      else if (response?.message?.content) {
        if (typeof response.message.content === "string") result = response.message.content;
        else if (Array.isArray(response.message.content)) result = response.message.content.map((c: any) => c.text || "").join("");
      } else if (response?.text) result = response.text;
      if (result && result.length > 5) setText(result.replace(/```/g, "").trim());
      else setError("AI ne kuch nahi diya. Dobara try kar.");
    } catch (err: any) { setError("Puter login maang raha hai. Allow karke dobara try kar."); }
    setLoading(false);
  };

  const downloadDoc = () => {
    if (!text) return;
    const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:16px;line-height:1.9;white-space:pre-wrap;color:#000">${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "nexora-handwriting.doc"; a.click();
  };

  const downloadPDF = () => {
    if (!text) return;
    const win = window.open("", "_blank"); if (!win) return;
    win.document.write(`<html><head><title>NEXORA</title><style>body{font-family:Arial;padding:30px;line-height:1.9;font-size:16px;white-space:pre-wrap;max-width:750px;margin:auto;color:#000}h1{font-size:22px;border-bottom:3px solid #2563eb;padding-bottom:10px;margin-bottom:20px;color:#000}</style></head><body><h1>NEXORA - Handwriting to Text</h1>${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</body></html>`);
    win.document.close(); setTimeout(() => win.print(), 700);
  };

  const copyText = async () => { if (!text) return; await navigator.clipboard.writeText(text); alert("Copied!"); };
  const clearAll = () => { setImage(""); setText(""); setError(""); };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <Script src="https://js.puter.com/v2/" onLoad={() => setPuterReady(true)} />
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
        {/* TOP - BILKUL COMPRESSOR JESA */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: "0.5px" }}>✦ FREE • NO WATERMARK • 100% PRIVATE</span>
          <h1 style={{ fontSize: 44, margin: "16px 0 8px", lineHeight: 1.1, letterSpacing: "-1px", fontWeight: 900, background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Handwriting to Text</h1>
          <p style={{ color: "#64748b", fontSize: 17, margin: 0, lineHeight: 1.6 }}>Handwriting photo ko saaf Typed Text me badlo.<br />For Notes, School, College, Homework.</p>
          <p style={{ color: "#0f172a", fontSize: 12, fontWeight: 700, margin: "8px 0 0" }}>{puterReady ? "🟢 AI Ready" : "🟡 AI Load ho raha hai..."}</p>
        </div>

        {/* TOOL BOX - BILKUL COMPRESSOR JESA */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center", color: "#0f172a" }}>Upload Your Handwriting Photo Here</p>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <div onClick={() => inputRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: image ? 10 : 18, textAlign: "center", cursor: "pointer", background: "#fff" }}>
            {image ? <img src={image} alt="Preview" style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 10, objectFit: "contain" }} /> : <><div style={{ fontSize: 28 }}>📸</div><p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15, color: "#0f172a" }}>Tap to Upload Photo</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • 100% Private</p></>}
          </div>

          {image && <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "10px 0 0" }}>Photo lag gayi ✅ • Ab neeche AI wala button dabao</p>}

          {error && <p style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "14px 0 0", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={doAI} disabled={loading || !image} style={{ flex: 1, padding: 15, background: loading || !image ? "#94a3b8" : "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>{loading ? "AI Padh Raha Hai... Ruk Ja" : "AI Se Text Banao →"}</button>
            <button onClick={clearAll} style={{ padding: "15px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700, color: "#0f172a" }}>Clear</button>
          </div>
        </div>

        {/* RESULT BOX - BILKUL COMPRESSOR KE RESULT JESA */}
        {text && (
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, marginTop: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
            <p style={{ textAlign: "center", fontWeight: 800, fontSize: 16, margin: "0 0 4px", color: "#0f172a" }}>✅ Ho Gaya!</p>
            <p style={{ textAlign: "center", fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: "#16a34a" }}>{text.split(" ").length} Words • Galat lage to yahi edit kar le</p>
            <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%", minHeight: 220, padding: 14, borderRadius: 12, border: "1.5px solid #2563eb", background: "#ffffff", color: "#000000", fontSize: 15, lineHeight: 1.8, fontFamily: "Arial", outline: "none", boxSizing: "border-box" }} />
            {/* 3 BUTTON - EK HI LINE ME */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={downloadPDF} style={{ flex: 1, padding: 14, background: "#0f172a", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>📄 PDF</button>
              <button onClick={downloadDoc} style={{ flex: 1, padding: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>⬇️ Word</button>
              <button onClick={copyText} style={{ flex: 1, padding: 14, background: "#fff", border: "1.5px solid #2563eb", color: "#0f172a", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>📋 Copy</button>
            </div>
          </div>
        )}

        <div style={{ height: 70 }}></div>

        {/* YELLOW TIP BOX - BILKUL COMPRESSOR JESA */}
        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b style={{ color: "#0f172a" }}>💡 Best Result ke liye - Pro Tip!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7, color: "#0f172a" }}>Ujale me seedhi photo lo, ek baar me 1 page daalo, photo blur na ho. Agar handwriting saaf hogi to AI 100% sahi padhega. Notes, Homework, Assignment sab typed ho jayega 10 sec me.</p>
        </div>

        <div style={{ height: 30 }}></div>

        {/* SEO CONTENT - BILKUL COMPRESSOR JESA */}
        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21, color: "#0f172a" }}>What is Handwriting to Text?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>An <b>AI handwriting to text</b> tool converts your handwritten photo into clean typed text. If your notes are in handwriting and you want <b>typed notes, PDF, Word file</b>, this tool will do it in 10 seconds. It works for <b>School Notes, College Notes, Homework, Assignment</b>.</p>
          <h2 style={{ fontSize: 21, marginTop: 26, color: "#0f172a" }}>How to Use?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Upload handwriting photo.<br /><b>Step 2:</b> AI Se Text Banao dabao.<br /><b>Step 3:</b> PDF, Word ya Copy karke use karo.</p>
          <h2 style={{ fontSize: 21, marginTop: 26, color: "#0f172a" }}>Frequently Asked Questions</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer", color: "#0f172a" }}>How to convert handwriting to text?</summary><p style={{ color: "#475569" }}>Upload photo, AI Se Text Banao dabao, text aa jayega.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer", color: "#0f172a" }}>Kya Hindi handwriting bhi padhega?</summary><p style={{ color: "#475569" }}>Haan, Hinglish aur Hindi-English dono padh lega.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer", color: "#0f172a" }}>Is my photo safe?</summary><p style={{ color: "#475569" }}>Yes. Photo sirf AI ko padhne ke liye jati hai, save nahi hoti.</p></details>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Try Next Tool → Image Compressor</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br />Last Updated: 6 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Handwriting to Text</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span><span style={{ padding: "0 18px" }}>✦ Handwriting to Text</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ AI Text Humanizer</span>
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
