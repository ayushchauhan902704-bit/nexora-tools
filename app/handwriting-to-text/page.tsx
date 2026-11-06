"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
    setLoading(true);
    setText("");
    setStatus("⏳ AI padh raha hai... 3-5 sec ruk ja...");
    try {
      const res = await fetch("/api/handwriting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (data.text) {
        setText(data.text);
        setStatus("✅ Ho gaya! Neeche check kar le, galat lage to edit kar le.");
      } else {
        setText("");
        setStatus("❌ Kuch nahi aaya. Dobara try kar.");
      }
    } catch (err) {
      setStatus("❌ Error aaya. Net check karke dobara try kar.");
    }
    setLoading(false);
  };

  const downloadDoc = () => {
    if (!text) return;
    const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:16px;line-height:1.9;white-space:pre-wrap">${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "NEXORA-Handwriting.doc";
    a.click();
  };

  const downloadPDF = () => {
    if (!text) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>NEXORA</title><style>body{font-family:Arial;padding:40px;line-height:1.9;font-size:16px;white-space:pre-wrap;max-width:750px;margin:auto;color:#111}h1{font-size:22px;border-bottom:3px solid #10b981;padding-bottom:10px;margin-bottom:20px}.foot{margin-top:30px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:10px}</style></head><body><h1>NEXORA - Handwriting to Text</h1>${text.replace(/</g, "&lt;").replace(/\n/g, "<br>")}<div class="foot">Made with NEXORA - By Ayush Chauhan</div></body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 700);
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    alert("Copied! Ab kahi bhi paste kar le.");
  };

  const clearAll = () => { setImage(""); setText(""); setStatus(""); };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f6f7fb", minHeight: "100vh", paddingBottom: 40 }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ width: "min(920px, calc(100% - 24px))", margin: "auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ fontSize: 22, letterSpacing: -0.5 }}>NEX<span style={{ color: "#10b981" }}>ORA</span></b>
          <a href="/" style={{ color: "#10b981", fontWeight: 800, fontSize: 12, textDecoration: "none" }}>← All Tools</a>
        </div>
      </header>

      <main style={{ width: "min(920px, calc(100% - 24px))", margin: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginTop: 16, border: "1px solid #eee", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>✍️ AI HANDWRITING TO TEXT • No.1 • FREE • PRIVATE</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "12px 0 6px", lineHeight: 1.2 }}>Handwriting to Text<br />AI Wala, Bilkul Saaf</h1>
          <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, margin: 0 }}>Photo daalo, AI meri tarah padhega. Line proper, Spelling sahi, Saaf Typed Text. 3-5 Sec me.</p>

          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />

          <div onClick={() => fileRef.current?.click()} style={{ marginTop: 16, border: "3px dashed #10b981", borderRadius: 20, padding: "24px 16px", textAlign: "center", background: "#f0fdf4", cursor: "pointer" }}>
            <div style={{ fontSize: 36 }}>📸</div>
            <b style={{ fontSize: 15 }}>{image ? "Photo badalni hai? Dobara dabao" : "Handwriting Photo Yaha Daalo"}</b>
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4 }}>Camera / Gallery se chuno • 1 Page ek baar me</div>
            {image && <img src={image} style={{ width: "100%", maxHeight: 340, objectFit: "contain", marginTop: 14, borderRadius: 12, background: "#fff", border: "1px solid #eee" }} alt="handwriting" />}
          </div>

          {status && <div style={{ marginTop: 12, background: status.includes("❌") || status.includes("ERROR") ? "#fee2e2" : "#fef3c7", color: status.includes("❌") || status.includes("ERROR") ? "#991b1b" : "#92400e", borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{status}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={doAI} disabled={loading || !image} style={{ flex: 1, padding: 15, borderRadius: 12, border: "none", background: loading || !image ? "#94a3b8" : "#10b981", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
              {loading ? "⏳ AI Padh Raha Hai..." : "✨ AI Se Text Banao →"}
            </button>
            {image && <button onClick={clearAll} style={{ padding: "15px 16px", borderRadius: 12, background: "#fff", border: "1.5px solid #e5e7eb", fontWeight: 800, cursor: "pointer" }}>✕</button>}
          </div>

          {text && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: 13 }}>📝 Tera Saaf Typed Text - Galat lage to yahi Edit kar le:</b>
                <span style={{ fontSize: 11, color: "#10b981", fontWeight: 800 }}>{text.split(" ").length} Words</span>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%", minHeight: 280, marginTop: 8, padding: 14, borderRadius: 12, border: "1.5px solid #10b981", background: "#f9fafb", fontSize: 15, lineHeight: 1.9, fontFamily: "Arial", outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <button onClick={downloadPDF} style={{ flex: 1, minWidth: 120, padding: 14, borderRadius: 12, border: "none", background: "#171725", color: "#fff", fontWeight: 900, cursor: "pointer" }}>📄 PDF Banao</button>
                <button onClick={downloadDoc} style={{ flex: 1, minWidth: 120, padding: 14, borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 900, cursor: "pointer" }}>⬇️ Word Download</button>
                <button onClick={copyText} style={{ padding: "14px 18px", borderRadius: 12, background: "#fff", border: "1.5px solid #10b981", color: "#059669", fontWeight: 800, cursor: "pointer" }}>📋 Copy</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, background: "#f0fdf4", borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 1.7, color: "#334155" }}>
            <b>💡 No.1 Wala Result ke liye:</b><br />
            1. Ujale me photo lo, seedha lo<br />
            2. Ek baar me 1 page daalo<br />
            3. Photo blur na ho
          </div>
        </div>
      </main>
    </div>
  );
}
