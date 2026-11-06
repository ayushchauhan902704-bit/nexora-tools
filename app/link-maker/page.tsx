"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [preview, setPreview] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const compress = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 1000;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (Math.max(w, h) > max) { const s = max / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob((b) => resolve(b || file), "image/jpeg", 0.85);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const handleFile = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) { alert("Sirf Photo chuno!"); return; }
    setPreview(URL.createObjectURL(f));
    setLink(""); setUploading(true);
    try {
      const blob = await compress(f);
      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", blob, "photo.jpg");
      const r = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form });
      const t = (await r.text()).trim();
      if (t.startsWith("http")) setLink(t);
      else throw new Error("fail");
    } catch {
      alert("Upload fail. Dobara try karo.");
    }
    setUploading(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f7f8fc", minHeight: "100vh", paddingBottom: 20 }}>
      <div style={{ width: "min(600px,calc(100% - 24px))", margin: "auto", paddingTop: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #e8e8ef" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>📷 Photo Link - Seedha Photo Khulega</h1>
          <p style={{ fontSize: 13, color: "#666" }}>Photo chuno, link banegi. Link dabate hi sirf photo khulegi. Koi Google, koi site nahi.</p>

          <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #6c5ce7", borderRadius: 14, padding: 16, textAlign: "center", background: "#f0efff", cursor: "pointer", marginTop: 14 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {preview ? <><img src={preview} style={{ width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 10 }} alt="photo" /><p style={{ fontSize: 12, marginTop: 8 }}>Dusri Photo Chuno</p></> : <><div style={{ fontSize: 36 }}>📷</div><p style={{ fontWeight: 800 }}>Photo Chuno</p><button style={{ padding: "11px 20px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, marginTop: 8 }}>📁 Photo Chuno</button></>}
          </div>

          {uploading && <p style={{ textAlign: "center", color: "#6c5ce7", fontWeight: 800, marginTop: 12 }}>Link Ban Rahi Hai...</p>}

          {link && (
            <div style={{ marginTop: 16, border: "1.5px solid #16a34a", borderRadius: 14, padding: 14, background: "#f0fdf4" }}>
              <b style={{ fontSize: 13 }}>✅ Teri Photo Link:</b>
              <p style={{ fontSize: 12, wordBreak: "break-all", background: "#fff", padding: 10, borderRadius: 8, marginTop: 6 }}>{link}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <button onClick={copy} style={{ padding: 13, borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800 }}>{copied ? "✅ Copy Ho Gaya!" : "📋 Copy Link"}</button>
                <a href={link} target="_blank" style={{ padding: 13, borderRadius: 10, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, textAlign: "center", textDecoration: "none", display: "block" }}>🖼️ Photo Khol Ke Dekho</a>
              </div>
              <p style={{ fontSize: 11, color: "#555", textAlign: "center", marginTop: 10 }}>Offline karne ke liye: Photo kholo → Lambi Dabao → Save Image dabao. Ab Gallery me hamesha khulegi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
