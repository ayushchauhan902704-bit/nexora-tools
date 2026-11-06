"use client";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";

declare global { interface Window { puter: any } }

export default function Page() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [puterReady, setPuterReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    setStatus("Photo load ho rahi hai...");
    const compressed = await compressImage(f);
    setImage(compressed);
    setText("");
    setStatus("");
  };

  const doAI = async () => {
    if (!image) { alert("Pehle photo daalo bhai!"); return; }
    if (!window.puter) { alert("Puter load ho raha hai, 2 sec ruk ke dobara dabao"); return; }
    setLoading(true);
    setText("");
    setStatus("⏳ AI padh raha hai... 5-10 sec ruk ja...");
    try {
      const prompt = `You are the best handwriting expert. Read this handwritten page carefully and transcribe EXACTLY.
Rules: 1. Transcribe EXACTLY what is written. 2. Keep line breaks PROPER. 3. If unclear, guess logical word. 4. Fix spelling, keep Hinglish as written. 5. Output ONLY clean typed text, no explanation, no markdown.`;
      let response: any;
      try { response = await window.puter.ai.chat(prompt, image); }
      catch (e) { response = await window.puter.ai.chat([{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: image } }] }]); }
      let result = "";
      if (typeof response === "string") result = response;
      else if (response?.message?.content) {
        if (typeof response.message.content === "string") result = response.message.content;
        else if (Array.isArray(response.message.content)) result = response.message.content.map((c: any) => c.text || "").join("");
      } else if (response?.text) result = response.text;
      if (result && result.length > 5) { setText(result.replace(/```/g, "").trim()); setStatus("✅ Ho gaya! Neeche check kar le."); }
      else setStatus("❌ AI ne kuch nahi diya. Dobara try kar.");
    } catch (err: any) { setStatus("❌ Puter login maang raha hai. Allow karke dobara try kar."); }
    setLoading(false);
  };

  const downloadDoc = () => {
    if (!text) return;
    const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:16px;line-height:1.9;white-space:pre-wrap;color:#000">${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "NEXORA-Handwriting.doc"; a.click();
  };

  const downloadPDF = () => {
    if (!text) return;
    const win = window.open("", "_blank"); if (!win) return;
    win.document.write(`<html><head><title>NEXORA</title><style>body{font-family:Arial;padding:30px;line-height:1.9;font-size:16px;white-space:pre-wrap;max-width:750px;margin:auto;color:#000}h1{font-size:22px;border-bottom:3px solid #2563eb;padding-bottom:10px;margin-bottom:20px;color:#000}</style></head><body><h1>NEXORA - Handwriting to Text</h1>${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</body></html>`);
    win.document.close(); setTimeout(() => win.print(), 700);
  };

  const copyText = async () => { if (!text) return; await navigator.clipboard.writeText(text); alert("Copied!"); };
  const clearAll = () => { setImage(""); setText(""); setStatus(""); };

  return (
    <>
      <Script src="https://js.puter.com/v2/" onLoad={() => setPuterReady(true)} />
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#eef2ff", minHeight: "100vh", paddingBottom: 20 }}>
        {/* HEADER - CHOTA */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ width: "min(480px, calc(100% - 24px))", margin: "auto", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <b style={{ fontSize: 20, letterSpacing: -0.5, color: "#000" }}>NEX<span style={{ color: "#2563eb" }}>ORA</span></b>
            <a href="/" style={{ color: "#2563eb", fontWeight: 800, fontSize: 12, textDecoration: "none" }}>← All Tools</a>
          </div>
        </header>

        {/* TOOL BOX - EK DUM CHOTA - 480px */}
        <main style={{ width: "min(480px, calc(100% - 16px))", margin: "auto" }}>
          <div style={{ background: "#ffffff", borderRadius: 16, padding: 12, marginTop: 10, border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>

            {/* BADGE */}
            <div style={{ background: "#dbeafe", color: "#1e40af", padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 900, textAlign: "center", letterSpacing: 0.3 }}>✍️ HANDWRITING TO TEXT • FREE • No.1</div>

            {/* HEADING - MOTI BLUE STYLISH */}
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: "10px 0 4px", lineHeight: 1.1, textAlign: "center", color: "#1d4ed8", letterSpacing: -0.5, fontFamily: "'Segoe UI', Arial, sans-serif", textShadow: "0 1px 0 #bfdbfe" }}>
              Handwriting to Text
            </h1>
            <p style={{ color: "#000000", fontSize: 12, lineHeight: 1.5, margin: "0 0 10px", textAlign: "center", fontWeight: 600 }}>
              Photo daalo, AI saaf Typed Text bana dega.<br />Line Proper • Spelling Sahi • 5-10 Sec Me
            </p>
            <p style={{ color: "#000000", fontSize: 11, textAlign: "center", margin: "0 0 10px", fontWeight: 700 }}>{puterReady ? "🟢 AI Ready" : "🟡 AI Load ho raha hai..."}</p>

            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />

            {/* PHOTO BOX - EK DUM CHOTA */}
            <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #2563eb", borderRadius: 12, padding: "10px 8px", textAlign: "center", background: "#eff6ff", cursor: "pointer" }}>
              <div style={{ fontSize: 22, lineHeight: 1 }}>📸</div>
              <b style={{ fontSize: 13, color: "#000000", display: "block", marginTop: 2 }}>{image ? "Photo Badlo" : "Photo Yaha Daalo"}</b>
              <div style={{ fontSize: 10, color: "#000000", fontWeight: 700, marginTop: 1 }}>Camera / Gallery • 1 Page</div>
              {image && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, background: "#fff", borderRadius: 8, padding: 6, border: "1px solid #e5e7eb" }}>
                  <img src={image} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }} alt="handwriting" />
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <b style={{ fontSize: 11, color: "#000000", display: "block" }}>✅ Photo Lag Gayi</b>
                    <span style={{ fontSize: 10, color: "#000000" }}>Ab neeche AI wala button dabao</span>
                  </div>
                  <span style={{ fontSize: 16 }}>👉</span>
                </div>
              )}
            </div>

            {status && <div style={{ marginTop: 8, background: status.includes("❌") ? "#fee2e2" : "#fef9c3", color: "#000000", borderRadius: 8, padding: "8px 10px", fontSize: 11, fontWeight: 800, lineHeight: 1.4, border: "1px solid #e5e7eb" }}>{status}</div>}

            {/* AI BUTTON - CHOTA */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={doAI} disabled={loading || !image} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: loading || !image ? "#94a3b8" : "#2563eb", color: "#fff", fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
                {loading ? "⏳ AI Padh Raha Hai..." : "✨ AI Se Text Banao →"}
              </button>
              {image && <button onClick={clearAll} style={{ padding: "11px 13px", borderRadius: 10, background: "#fff", border: "1.5px solid #e5e7eb", fontWeight: 900, cursor: "pointer", color: "#000000" }}>✕</button>}
            </div>

            {text && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 12, color: "#000000" }}>📝 Tera Typed Text - Edit kar sakta hai:</b>
                  <span style={{ fontSize: 10, color: "#2563eb", fontWeight: 900 }}>{text.split(" ").length} Words</span>
                </div>
                {/* TEXTAREA - BLACK TEXT, WHITE BG - SAB DIKHEGA */}
                <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%", minHeight: 170, marginTop: 6, padding: 10, borderRadius: 10, border: "1.5px solid #2563eb", background: "#ffffff", color: "#000000", fontSize: 14, lineHeight: 1.7, fontFamily: "Arial", outline: "none", boxSizing: "border-box", fontWeight: 500 }} />

                {/* 3 BUTTON - EK HI LINE ME LEFT TO RIGHT */}
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "nowrap" }}>
                  <button onClick={downloadPDF} style={{ flex: 1, padding: "11px 2px", borderRadius: 10, border: "none", background: "#111827", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>📄 PDF</button>
                  <button onClick={downloadDoc} style={{ flex: 1, padding: "11px 2px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>⬇️ Word</button>
                  <button onClick={copyText} style={{ flex: 1, padding: "11px 2px", borderRadius: 10, background: "#fff", border: "1.5px solid #2563eb", color: "#000000", fontWeight: 900, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>📋 Copy</button>
                </div>
              </div>
            )}

            {/* TIPS - CHOTA, BLACK TEXT */}
            <div style={{ marginTop: 10, background: "#f8fafc", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6, color: "#000000", border: "1px solid #eef2ff" }}>
              <b style={{ color: "#000000", fontSize: 11 }}>💡 Best Result ke liye:</b><br />
              <span style={{ color: "#000000" }}>1. Ujale me seedhi photo lo • 2. 1 page ek baar me • 3. Blur na ho</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
