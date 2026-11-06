"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const doAI = async () => {
    if (!image) return alert("Pehle photo daalo!");
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/handwriting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setText(data.text || "");
    } catch { alert("Error, dobara try karo"); }
    setLoading(false);
  };

  const downloadDoc = () => {
    const blob = new Blob([text], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "NEXORA-Handwriting.doc"; a.click();
  };

  const downloadPDF = () => {
    const win = window.open("", "_blank"); if (!win) return;
    win.document.write(`<html><head><title>NEXORA</title><style>body{font-family:Arial;padding:40px;line-height:1.9;font-size:16px;white-space:pre-wrap;max-width:750px;margin:auto}h1{font-size:22px;border-bottom:3px solid #10b981;padding-bottom:10px}</style></head><body><h1>NEXORA - Handwriting to Text</h1>${text.replace(/\n/g,"<br>")}<br><br><p style="font-size:11px;color:#999">Made with NEXORA - By Ayush Chauhan</p></body></html>`);
    win.document.close(); setTimeout(()=>win.print(), 600);
  };

  const copyText = async () => { await navigator.clipboard.writeText(text); alert("Copied!"); };

  return (
    <div style={{ fontFamily: "Arial", background: "#f6f7fb", minHeight: "100vh", paddingBottom: 30 }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ fontSize: 22 }}>NEX<span style={{ color: "#10b981" }}>ORA</span></b>
          <a href="/" style={{ color: "#10b981", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>← All Tools</a>
        </div>
      </header>
      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginTop: 16, border: "1px solid #eee" }}>
          <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>✍️ AI Handwriting to Text • No.1 • Free • Private</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginTop: 10 }}>Handwriting to Text - AI Wala, Bilkul Saaf</h1>
          <p style={{ color: "#666", fontSize: 13 }}>Photo daalo, AI meri tarah padhega, Line Proper, Saaf Typed Text banayega. 2-3 Sec me.</p>

          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>handleFile(e.target.files?.[0])} />
          <div onClick={()=>fileRef.current?.click()} style={{ marginTop: 14, border: "3px dashed #10b981", borderRadius: 20, padding: "30px 16px", textAlign: "center", background: "#f0fdf4", cursor: "pointer" }}>
            <div style={{ fontSize: 32 }}>📸</div>
            <b>Handwriting Photo Yaha Daalo</b>
            <div style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>Camera / Gallery se chuno</div>
            {image && <img src={image} style={{ width: "100%", maxHeight: 320, objectFit: "contain", marginTop: 12, borderRadius: 12 }} alt="hw" />}
          </div>

          <button onClick={doAI} disabled={loading} style={{ width: "100%", marginTop: 14, padding: 15, borderRadius: 12, border: "none", background: loading ? "#94a3b8" : "#10b981", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
            {loading ? "⏳ AI Padh Raha Hai... 2-3 Sec..." : "✨ AI Se Text Banao →"}
          </button>

          {text && (
            <div style={{ marginTop: 16 }}>
              <b style={{ fontSize: 13 }}>📝 Tera Saaf Typed Text - Galat lage to yahi Edit kar le:</b>
              <textarea value={text} onChange={e=>setText(e.target.value)} style={{ width: "100%", minHeight: 260, marginTop: 8, padding: 14, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 15, lineHeight: 1.9, fontFamily: "Arial" }} />
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <button onClick={downloadPDF} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#171725", color: "#fff", fontWeight: 900, cursor: "pointer" }}>📄 PDF Banao</button>
                <button onClick={downloadDoc} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 900, cursor: "pointer" }}>⬇️ Word Download</button>
                <button onClick={copyText} style={{ padding: "14px 18px", borderRadius: 12, background: "#fff", border: "1.5px solid #10b981", color: "#059669", fontWeight: 800, cursor: "pointer" }}>📋 Copy</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 14, background: "#fef3c7", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6 }}>
            <b>💡 No.1 Wala Result ke liye:</b> Ujale me photo lo, seedha photo lo, ek baar me 1 page. AI meri tarah samajh ke sahi word likhega.
          </div>
        </div>
      </main>
    </div>
  );
}
