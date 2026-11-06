"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [mode, setMode] = useState<"normal" | "logo">("normal");
  const [type, setType] = useState("link");
  const [link, setLink] = useState("");
  const [upi, setUpi] = useState("");
  const [upiName, setUpiName] = useState("");
  const [text, setText] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mediaLink, setMediaLink] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const mediaRef = useRef<HTMLInputElement>(null);

  const getData = () => {
    if (type === "link") return link.trim();
    if (type === "upi") {
      if (!upi.trim()) return "";
      if (upi.includes("upi://")) return upi.trim();
      return `upi://pay?pa=${upi.trim()}&pn=${encodeURIComponent(upiName.trim() || "NEXORA")}&cu=INR`;
    }
    if (type === "text") return text.trim();
    if (type === "wifi") {
      if (!wifiName.trim()) return "";
      return `WIFI:T:WPA;S:${wifiName.trim()};P:${wifiPass};;`;
    }
    if (type === "photo" || type === "video") return mediaLink.trim();
    return "";
  };
  const data = getData();

  const handleLogoUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoUrl(url);
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(f);
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 1000;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (Math.max(w, h) > max) {
          const s = max / Math.max(w, h);
          w = Math.round(w * s); h = Math.round(h * s);
        }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob((b) => resolve(b!), "image/jpeg", 0.65);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((res) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
      v.onerror = () => res(0);
      v.src = URL.createObjectURL(file);
    });
  };

  // 4 HOST - Ek fail to dusra - iPhone pe bhi chalega
  const uploadToHost = async (blob: Blob | File, name: string): Promise<string> => {
    const hosts = [
      async () => {
        const f = new FormData();
        f.append("file", blob, name);
        const r = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: f });
        const j = await r.json();
        const u = j?.data?.url?.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        if (u && u.startsWith("http")) return u;
        throw new Error("tmp fail");
      },
      async () => {
        const f = new FormData();
        f.append("file", blob, name);
        const r = await fetch("https://file.io/?expires=14d", { method: "POST", body: f });
        const j = await r.json();
        if (j?.link?.startsWith("http")) return j.link;
        throw new Error("fileio fail");
      },
      async () => {
        const f = new FormData();
        f.append("file", blob, name);
        const r = await fetch("https://0x0.st", { method: "POST", body: f });
        const t = (await r.text()).trim();
        if (t.startsWith("http")) return t;
        throw new Error("0x0 fail");
      },
      async () => {
        const f = new FormData();
        f.append("reqtype", "fileupload");
        f.append("fileToUpload", blob, name);
        const r = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: f });
        const t = (await r.text()).trim();
        if (t.startsWith("http")) return t;
        throw new Error("catbox fail");
      },
    ];
    let lastErr: any = null;
    for (const h of hosts) {
      try { return await h(); } catch (e) { lastErr = e; }
    }
    throw lastErr;
  };

  const handleMediaUpload = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    if (!isVideo && !isImage) { alert("Sirf Photo ya Video chuno!"); return; }
    if (isVideo) {
      if (f.size > 100 * 1024 * 1024) { alert("Video 100MB se chhoti rakho!"); return; }
      const dur = await getVideoDuration(f);
      if (dur > 25) { alert(`Video ${Math.round(dur)} sec ki hai! 10-20 sec ki video chuno. Gallery me Trim karke dobara chuno.`); return; }
    } else {
      if (f.size > 50 * 1024 * 1024) { alert("Photo 50MB se chhoti rakho!"); return; }
    }
    setMediaType(isVideo ? "video" : "photo");
    setMediaPreview(URL.createObjectURL(f));
    setUploading(true); setProgress(10); setQrDataUrl(""); setMediaLink("");
    try {
      let toUpload: Blob | File = f;
      let name = f.name;
      if (isImage) {
        setProgress(30);
        toUpload = await compressImage(f);
        name = "nexora-photo.jpg";
        setProgress(60);
      } else {
        setProgress(50);
      }
      const link = await uploadToHost(toUpload, name);
      setProgress(100);
      setMediaLink(link);
      setTimeout(() => generateQRDirect(link), 100);
    } catch (err: any) {
      console.log("Upload error:", err);
      alert("Upload nahi hui. Net check karo, Safari Private mode band karo, dobara try karo.");
    }
    setUploading(false);
  };

  const generateQRDirect = async (text: string) => {
    setLoading(true);
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(text)}`;
    try {
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = apiUrl;
      await new Promise((res, rej) => { qrImg.onload = res; qrImg.onerror = rej; });
      const canvas = document.createElement("canvas");
      canvas.width = 600; canvas.height = 600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(qrImg, 0, 0, 600, 600);
      if (mode === "logo" && logoFile) {
        const lImg = new Image(); lImg.src = logoFile;
        await new Promise((res) => { lImg.onload = res; lImg.onerror = res; });
        const size = 120; const x = (600 - size) / 2, y = (600 - size) / 2;
        ctx.fillStyle = "#fff"; ctx.fillRect(x - 12, y - 12, size + 24, size + 24);
        ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 3; ctx.strokeRect(x - 12, y - 12, size + 24, size + 24);
        ctx.drawImage(lImg, x, y, size, size);
      }
      setQrDataUrl(canvas.toDataURL("image/png"));
      setTimeout(() => { document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
    } catch {}
    setLoading(false);
  };

  const generate = async () => {
    if ((type === "photo" || type === "video") && !mediaLink) { alert("Pehle photo / video chuno! Upload hogi, fir QR banega."); return; }
    if (!data) { alert("Pehle data daalo bhai!"); return; }
    if (mode === "logo" && !logoFile) { alert("Logo wala select kiya hai to pehle logo upload karo!"); return; }
    await generateQRDirect(data);
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `NEXORA-QR-${mode}-${type}-${Date.now()}.png`;
    a.click();
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "16px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" };
  const input: any = { width: "100%", padding: 13, border: "1px solid #dedee8", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", marginTop: 8, background: "#fff", color: "#171725" };
  const tab = (active: boolean): any => ({ flex: 1, padding: "11px 6px", borderRadius: 12, border: active ? "2px solid #6c5ce7" : "1px solid #e5e7eb", background: active ? "#f0efff" : "#fff", color: active ? "#6c5ce7" : "#555", fontWeight: 800, fontSize: 12, cursor: "pointer", textAlign: "center" });

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", minHeight: "100vh", paddingBottom: 20, overflowX: "hidden" }}>
      <style>{`@media(max-width:600px){.qr-tabs{flex-wrap:wrap !important}}`}</style>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #e8e8ef", zIndex: 50 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ ...badge, margin: 0 }}>⚡ 100x FAST • PHOTO • VIDEO QR</span><a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none" }}>← All Tools</a></div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>📱 Link, UPI, Text, WiFi, Photo, Video • 100x Fast • No Watermark PNG HD • Free</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.7, marginTop: 8 }}>QR Code Generator</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Normal QR ya Logo wala QR banao - Link, UPI, Text, WiFi, Photo, Video sabke liye. 100x Fast Upload. Download PNG HD.</p>

          <label style={{ fontSize: 11, fontWeight: 800, color: "#555" }}>1️⃣ CHOOSE STYLE - Kaisa QR Chahiye?</label>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setMode("normal")} style={{ ...tab(mode === "normal"), fontSize: 14, padding: 14 }}>⬜ Normal QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Fast Scan • Clean</span></button>
            <button onClick={() => setMode("logo")} style={{ ...tab(mode === "logo"), fontSize: 14, padding: 14 }}>🖼️ With Logo QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Shop Logo Beech Me</span></button>
          </div>

          {mode === "logo" && (
            <div style={{ marginTop: 12, background: "#f0efff", border: "1.5px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 800 }}>📤 Apna Logo Upload Karo</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>{logoUrl ? "✅ Logo Lag Gaya - Change Karo" : "Choose Logo / Photo"}</button>
              {logoUrl && <img src={logoUrl} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, margin: "10px auto 0", border: "2px solid #fff", display: "block" }} alt="logo" />}
            </div>
          )}

          <label style={{ fontSize: 11, fontWeight: 800, color: "#555", display: "block", marginTop: 16 }}>2️⃣ KIS CHEEZ KA QR BANANA HAI?</label>
          <div className="qr-tabs" style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setType("link")} style={tab(type === "link")}>🔗 Link</button>
            <button onClick={() => setType("upi")} style={tab(type === "upi")}>💸 UPI</button>
            <button onClick={() => setType("text")} style={tab(type === "text")}>📝 Text</button>
            <button onClick={() => setType("wifi")} style={tab(type === "wifi")}>📶 WiFi</button>
            <button onClick={() => setType("photo")} style={tab(type === "photo")}>📷 Photo</button>
            <button onClick={() => setType("video")} style={tab(type === "video")}>🎥 Video</button>
          </div>

          <div style={{ marginTop: 12 }}>
            {type === "link" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Website / Instagram / YouTube Link</label><input style={input} value={link} onChange={e => setLink(e.target.value)} placeholder="https://instagram.com/tera-shop" /></>}
            {type === "upi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>UPI ID</label><input style={input} value={upi} onChange={e => setUpi(e.target.value)} placeholder="e.g. 9389641559@paytm" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Shop / Tumhara Naam</label><input style={input} value={upiName} onChange={e => setUpiName(e.target.value)} placeholder="e.g. Ayush Kirana Store" /></>}
            {type === "text" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Koi bhi Text</label><textarea style={{ ...input, minHeight: 70 }} rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Shop address, Menu, Offer..." /></>}
            {type === "wifi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>WiFi Name (SSID)</label><input style={input} value={wifiName} onChange={e => setWifiName(e.target.value)} placeholder="e.g. MyWiFi" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>WiFi Password</label><input style={input} value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="WiFi password" /></>}

            {(type === "photo" || type === "video") && <div style={{ border: "2px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center", background: "#f0efff" }}>
              <input ref={mediaRef} type="file" accept={type === "photo" ? "image/*" : "video/*"} onChange={handleMediaUpload} style={{ display: "none" }} />
              {mediaPreview ? (
                <>
                  {mediaType === "video" ? <video src={mediaPreview} controls style={{ width: "100%", maxHeight: 220, borderRadius: 10, background: "#000" }} /> : <img src={mediaPreview} style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 10, background: "#fff" }} alt="preview" />}
                  {uploading ? <><p style={{ fontSize: 12, fontWeight: 800, color: "#6c5ce7", marginTop: 8 }}>⚡ 100x Fast Upload... {progress}%</p><div style={{ width: "100%", background: "#e5e7eb", height: 6, borderRadius: 99, marginTop: 6 }}><div style={{ width: `${progress}%`, background: "#6c5ce7", height: 6, borderRadius: 99 }}></div></div></>
                  : mediaLink ? <><p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginTop: 8, wordBreak: "break-all" }}>✅ Link Ban Gaya: {mediaLink}</p><p style={{ fontSize: 11, color: "#666" }}>Scan karte hi ye {mediaType === "video" ? "video chalegi" : "photo khulegi"}.</p></>
                  : <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Upload fail hui, dobara chuno.</p>}
                  <button onClick={() => mediaRef.current?.click()} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: "#6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 8, fontSize: 12 }}>{type === "video" ? "🎥 Dusri Video Chuno" : "📷 Dusri Photo Chuno"}</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32 }}>{type === "video" ? "🎥" : "📷"}</div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#000", marginTop: 4 }}>{type === "video" ? "Video Chuno - 10-20 Sec - Uska QR Banega" : "Photo Chuno - Badi Photo Bhi Chalegi (50MB Tak) - Uska QR Banega"}</p>
                  <p style={{ fontSize: 11, color: "#666" }}>{type === "video" ? "QR scan karte hi video chalegi. 10-20 sec ki video best hai." : "QR scan karte hi photo khulegi. Badi photo auto chhoti ho jayegi, fail nahi hogi."}</p>
                  <button onClick={() => mediaRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>{type === "video" ? "🎥 Video Chuno" : "📷 Photo Chuno"}</button>
                  <p style={{ fontSize: 10, color: "#888", marginTop: 6 }}>⚡ 100x Fast • Photo 50MB tak • Video 100MB tak, 10-20 sec</p>
                </>
              )}
            </div>}
          </div>

          <button onClick={generate} disabled={uploading} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 14, opacity: uploading ? 0.6 : 1 }}>{loading ? "⏳ Ban Raha Hai..." : uploading ? `⚡ Upload Ho Rahi Hai... ${progress}%` : type === "photo" ? "📷 Generate Photo QR →" : type === "video" ? "🎥 Generate Video QR →" : "Generate QR Code →"}</button>

          {qrDataUrl && (
            <div id="qr-result" style={{ textAlign: "center", marginTop: 16 }}>
              <img src={qrDataUrl} style={{ maxWidth: 280, width: "100%", height: "auto", display: "block", margin: "0 auto", border: "1px solid #eee", borderRadius: 14, background: "#fff" }} alt="QR Code" />
              <p style={{ fontSize: 12, color: "#555", marginTop: 8, wordBreak: "break-all" }}>Data: <b>{data}</b></p>
              {(type === "photo" || type === "video") && <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 800 }}>✅ Scan karte hi teri {type === "video" ? "video chalegi 🎥" : "photo khulegi 📷"}</p>}
              <button onClick={download} style={{ width: "100%", padding: 13, borderRadius: 12, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 10 }}>⬇️ Download QR PNG - No Watermark HD</button>
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA QR Generator?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}>NEXORA QR Generator — 600x600 PNG HD, 100x Fast, clean, no watermark, free forever. Photo QR - 50MB tak ki badi photo bhi chalegi, auto compress hogi. Video QR - 10-20 sec ki video ka QR banao, scan karte hi video chalegi. UPI, Link, Text, WiFi - Sab ek jagah.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>How to Create - 3 Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7 }}><b>Step 1:</b> Style Chuno — Normal ya Logo<br /><b>Step 2:</b> Type Chuno — Photo / Video / Link / UPI + File Chuno<br /><b>Step 3:</b> Generate + Download — PNG HD</p>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7, paddingLeft: 18 }}><li>✅ Photo QR - 50MB tak, Auto Compress, 100x Fast</li><li>✅ Video QR - 10-20 Sec Video, Scan karte hi chalegi</li><li>✅ Link, UPI, Text, WiFi - Sab Types</li><li>✅ 600x600 PNG HD - No Watermark</li><li>✅ Free Forever, No Signup</li></ul>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Logo QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Logo QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid $5+/mo</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Photo QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Photo to QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Photo QR</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Video QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Video to QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Video QR</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Quality</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>600x600 PNG HD ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>200px Low</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>UPI QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>UPI Payment QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No UPI</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - QR Code Generator</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}><b>Q: Badi photo ka QR kaise banaye?</b><br />A: Photo wala button dabao, 50MB tak ki photo chuno - Tool khud chhoti karke upload karega, fail nahi hogi.<br /><br /><b>Q: Video ka QR kaise banaye?</b><br />A: Video wala button dabao, 10-20 sec ki video chuno, Generate dabao - Scan karte hi video chalegi.<br /><br /><b>Q: Video lambi hai to kya karu?</b><br />A: Gallery me video ko Trim karke 15 sec ka kar lo, fir upload karo.<br /><br /><b>Q: Is it free?</b><br />A: Yes, 100% free, no watermark.</p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India</div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - QR Generator</div><div>Made in India 🇮🇳 | No Watermark</div></div></div>
        </div>
      </footer>
    </div>
  );
}
